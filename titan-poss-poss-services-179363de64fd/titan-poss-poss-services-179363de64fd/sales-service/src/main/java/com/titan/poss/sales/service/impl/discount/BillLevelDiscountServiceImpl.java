/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsResponseDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service Class for *BILL_LEVEL_DISCOUNT*
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesBillLevelDiscountServiceImpl")
public class BillLevelDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	public static final String FOR_DISCOUNT = "For discount code: ";

	public BillLevelDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name(), this);
	}

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// Validate club with Other Bill level discount, if applicable.
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsOtherBillLevelDiscount())) {
			// Validate if Other Bill level discount applied in the transaction,
			Boolean isBillDiscountApplied = verifyIfAnyBillDiscountAppliedInTransaction(salesTxn);
			if (BooleanUtils.isTrue(isBillDiscountApplied)) {
				throw new ServiceException(
						"Discount can't be clubbed with the applied Bill level Discount in the transaction",
						"ERR-DISC-012", FOR_DISCOUNT + discountCode);
			}
		} else {
			List<DiscountDetailsDaoExt> billDiscountDetailsList = discountDetailsRepository
					.findAllBySalesTxnIdAndApplicableLevelAndDiscountType(salesTxn.getId(),
							DiscountApplicableLevelEnum.BILL_LEVEL.name(), DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name());
			if (!CollectionUtils.isEmpty(billDiscountDetailsList)) {
				billDiscountDetailsList.forEach(billLevelDiscount -> {

					JsonData clubConfigJson = MapperUtil.mapObjToClass(
							billLevelDiscount.getDiscountConfig().getClubbableConfigDetails(), JsonData.class);
					ClubbingConfigDetails clubOfferConfig = MapperUtil.mapObjToClass(clubConfigJson.getData(),
							ClubbingConfigDetails.class);
					if (BooleanUtils.isFalse(clubOfferConfig.getIsOtherBillLevelDiscount())) {
						throw new ServiceException(
								"Discount can't be clubbed with the applied Bill level Discount in the transaction",
								"ERR-DISC-012", FOR_DISCOUNT + billLevelDiscount.getDiscountCode());
					}
				});
			}
		}
	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponse, DiscountOtherDetailsDto discountOtherDetails) {
		// NA
		return null;
	}

	@Override
	@Transactional
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetails) {

		List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetails.getId());

		if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
			Set<String> updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			// Delete the apportioned discount values at item level
			discountItemDetailsRepository.deleteByDiscountDetailId(discountDetails.getId());

			// Update discount values for the impacted items
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);

		}

		// Delete bill level discount at sales transaction level
		discountDetailsRepository.deleteById(discountDetails.getId());

		// Delete discount config details
		discountConfigDetailsRepository.delete(discountDetails.getDiscountConfig());

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {

		// Order configurations Not applicable for Bill discounts

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA

	}

	/**
	 * Method to apply bill level discounts
	 * 
	 * @param salesTxn
	 * @param DiscountBillLevelCreateDto
	 */
	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// Validate If more than 2 bill level discounts is applied for same transaction.
		if(discountBillLevelCreateDto.getDiscountDetails().size()>2) {
			throw new ServiceException("Max of 2 bill level discounts are allowed to select","ERR-DISC-041");
		}
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();
		discountBillLevelCreateDto.getDiscountDetails().forEach(discountBillDetail -> {

			// Validate duplicate discount getting applied again
			checkIfAppliedDiscount(salesTxn, discountBillDetail);

			EligibleDiscountItemsRequestDto eligibleDiscountItemsRequestDto = discountUtilService
					.getEligibleItemRequestBody(salesTxn, discountBillDetail);

			log.info("Sales - Bill level eligible Item check engine API Request body - {}",
					MapperUtil.getJsonString(eligibleDiscountItemsRequestDto));

			// Engine API call to get eligible items for selected discount
			EligibleDiscountItemsResponseDto eligibleDiscountItemResponse = engineService
					.getEligibleItemsForBillLevelDiscounts(discountType, eligibleDiscountItemsRequestDto);

			log.info("Sales - Bill level eligible Item check engine API Response body - {}",
					MapperUtil.getJsonString(eligibleDiscountItemResponse));

			if (StringUtils.isEmpty(eligibleDiscountItemResponse)
					|| (!StringUtils.isEmpty(eligibleDiscountItemResponse) && CollectionUtils
							.isEmpty(eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getItemDetails()))) {
				throw new ServiceException(
						"No item eligible for the selected discount :- " + discountBillDetail.getDiscountCode(),
						"ERR-DISC-023", Map.of("discountCode", discountBillDetail.getDiscountCode()));
			}

			// Validate Eligible Club offer configs
			discountUtilService.validateCommonEligibleClubOfferConfigs(
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getClubbingDetails(),
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getDiscountCode(),
					salesTxn);

			// Validate discount type specific clubbing configs
			validateEligibleClubOfferConfigs(
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getClubbingDetails(),
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getDiscountCode(),
					salesTxn);

			// Refer discount basic criteria config and check If Bill level Fixed
			// value or UCP %
			Boolean isDiscountOnBillValue = getApplicableBillDiscountLogic(eligibleDiscountItemResponse
					.getEligibleItemDetails().get(0).getDiscountConfigDetails().getBasicCriteriaDetails());

			DiscountDetailsDaoExt discountDetailsDaoExt = new DiscountDetailsDaoExt();

			// Apply Filter on bill level discount eligible item codes
			List<String> billDiscountEligibleItemIds = eligibleDiscountItemResponse.getEligibleItemDetails().get(0)
					.getItemDetails().stream().map(DiscountItemsDto::getItemId).collect(Collectors.toList());

			log.info("Discount code :- {} and eligible item Id's - {}", discountBillDetail.getDiscountCode(),
					billDiscountEligibleItemIds);

			BigDecimal maxDiscountAlloweed = eligibleDiscountItemResponse.getEligibleItemDetails().get(0)
					.getDiscountConfigDetails().getBasicCriteriaDetails().getMaxDiscount();

			if (BooleanUtils.isTrue(isDiscountOnBillValue)) {

				BigDecimal billFlatDiscount = BigDecimal.ZERO;

				if (BooleanUtils.isTrue(discountBillDetail.getIsEdited())) {
					// compare with max discount allowed and apply the same
					discountUtilService.validateMaxDiscountAllowed(discountBillDetail.getDiscountValue(),
							maxDiscountAlloweed, discountBillDetail.getDiscountCode());

					billFlatDiscount = discountBillDetail.getDiscountValue();
				} else {
					// If Not edited, pick Flat discount value from discount config
					billFlatDiscount = eligibleDiscountItemResponse.getEligibleItemDetails().get(0)
							.getDiscountConfigDetails().getBasicCriteriaDetails().getUcpValue();
				}

				// Create Discount details
				discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(discountBillDetail, salesTxn,
						DiscountApplicableLevelEnum.BILL_LEVEL.name(),
						DiscountInitialStatusEnum.BILL_LEVEL_DISCOUNT.getDiscountInitialStatus(), billFlatDiscount);

				// Save discount config details & Link to the discount applied
				discountDetailsDaoExt.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(
						eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()));

				// Apportion the bill discounts to the eligible item Id's
				discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
						billDiscountEligibleItemIds,null);
			} else {

				// Create bill level discount record with value ZERO, once computed at item
				// level sum up & update back the bill level value
				// Create Discount details
				discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(discountBillDetail, salesTxn,
						DiscountApplicableLevelEnum.BILL_LEVEL.name(),
						DiscountInitialStatusEnum.BILL_LEVEL_DISCOUNT.getDiscountInitialStatus(), BigDecimal.ZERO);

				// Save discount config details & Link to the discount applied
				discountDetailsDaoExt.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(
						eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()));

				// Get the calculated item discounts to sum up at bill level discount
				discountDetailsDaoExt = discountUtilService.calculateBillLevelDiscountOnUCPOfEachItemAndSumUp(
						discountDetailsDaoExt, salesTxn, billDiscountEligibleItemIds);

				if (BooleanUtils.isTrue(discountDetailsDaoExt.getIsEdited()) && maxDiscountAlloweed != null) {
					// compare with max discount allowed
					discountUtilService.validateMaxDiscountAllowed(discountDetailsDaoExt.getDiscountValue(),
							maxDiscountAlloweed, discountDetailsDaoExt.getDiscountCode());
				}

			}

			discountDetailsRepository.save(discountDetailsDaoExt);

			discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));

		});

		return new DiscountResponseDto(discountDetails);
	}

	@Override
	@Transactional
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		// NA

	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, null);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			Set<String> updatedItemIds = new HashSet<>();
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetails.getId());

				if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
					updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
							.collect(Collectors.toSet());

					// Delete the apportioned discount values at item level
					discountItemDetailsRepository.deleteByDiscountDetailId(discountDetails.getId());

				}

				// Delete bill level discount at sales transaction level
				discountDetailsRepository.deleteById(discountDetails.getId());

				// Delete discount config details
				discountConfigDetailsRepository.delete(discountDetails.getDiscountConfig());

			}

			// Update discount values for the impacted items
			if (!CollectionUtils.isEmpty(updatedItemIds))
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
		}

	}

	@Override
	@Transactional
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {

		List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetailDao.getId());

		// Refer discount basic criteria config and check If Bill level Fixed
		// value or UCP %
		BaseBasicCriteriaDetails baseBasicCriteriaDetails = (BaseBasicCriteriaDetails) MapperUtil.getObjectMapping(
				discountDetailDao.getDiscountConfig().getBasicCriteriaDetails(), new BaseBasicCriteriaDetails());

		Boolean isDiscountOnBillValue = getApplicableBillDiscountLogic(baseBasicCriteriaDetails);

		log.info("Discount apportioned item details - {}{}", discountDetailDao, apportionedItemDiscountDetails);

		BigDecimal maxDiscountAlloweed = BigDecimal.ZERO;

		if (BooleanUtils.isTrue(isDiscountOnBillValue)) {

			if (BooleanUtils.isTrue(discountDetailDao.getIsEdited())
					&& baseBasicCriteriaDetails.getMaxDiscount() != null) {
				// compare with max discount allowed and apply the same
				discountUtilService.validateMaxDiscountAllowed(discountDetailDao.getDiscountValue(),
						maxDiscountAlloweed, discountDetailDao.getDiscountCode());

			}

			// Apportion the bill discounts to the eligible item Id's
			discountUtilService.reApportionBillLevelDiscountsToApplicableItems(discountDetailDao, salesTxn,
					apportionedItemDiscountDetails, isPriceUpdate);
		} else {

			// Get the calculated item discounts to sum up at bill level discount
			discountUtilService.reCalculateBillLevelDiscountOnUCPOfEachItemAndSumUp(discountDetailDao, salesTxn,
					apportionedItemDiscountDetails, isPriceUpdate);

			if (BooleanUtils.isTrue(discountDetailDao.getIsEdited())
					&& baseBasicCriteriaDetails.getMaxDiscount() != null) {
				// compare with max discount allowed and apply the same
				discountUtilService.validateMaxDiscountAllowed(discountDetailDao.getDiscountValue(),
						maxDiscountAlloweed, discountDetailDao.getDiscountCode());

			}

			discountDetailsRepository.save(discountDetailDao);

		}

	}

	// Method to verify If Bill level Discount applied in the transaction
	private Boolean verifyIfAnyBillDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn) {
		List<DiscountDetailsDaoExt> billDiscountDetailsList = discountDetailsRepository
				.findAllBySalesTxnIdAndApplicableLevelAndDiscountType(salesTxn.getId(),
						DiscountApplicableLevelEnum.BILL_LEVEL.name(), DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name());
		Boolean isBillDiscountsApplied = false;
		if (!CollectionUtils.isEmpty(billDiscountDetailsList)) {
			isBillDiscountsApplied = true;
		}

		return isBillDiscountsApplied;
	}

	/**
	 * @param basicCriteriaDetails
	 * @return
	 */
	private Boolean getApplicableBillDiscountLogic(BaseBasicCriteriaDetails basicCriteriaDetails) {

		Boolean isDiscountOnBillValue = false;

		if (BooleanUtils.isTrue(basicCriteriaDetails.getIsBillValue())) {
			isDiscountOnBillValue = true;
		}

		if (basicCriteriaDetails.getUcpValue() == null
				|| basicCriteriaDetails.getUcpValue().compareTo(BigDecimal.ZERO) <= 0) {
			throw new ServiceException("Bill Level discount UCP value should be positive value to apply the discount",
					"ERR-DISC-013", "Bill level Discount - UCP value: " + basicCriteriaDetails.getUcpValue());
		}

		return isDiscountOnBillValue;
	}

	// Method to validate if same discount applied again
	private void checkIfAppliedDiscount(SalesTxnDaoExt salesTxn, DiscountBillLevelItemDetailsDto discountBillDetail) {
		List<DiscountDetailsDaoExt> discountApplied = discountDetailsRepository
				.findAllBySalesTxnIdAndDiscountId(salesTxn.getId(), discountBillDetail.getDiscountId());
		if (!CollectionUtils.isEmpty(discountApplied)) {
			throw new ServiceException(
					"Discount already applied in the transaction - " + discountBillDetail.getDiscountCode(),
					"ERR-DISC-031", Map.of("discountCode", discountBillDetail.getDiscountCode()));
		}
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}

}
