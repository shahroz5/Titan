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

import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.DiscountValueDetails;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsResponseDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.DiscountComponentTypeEnum;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountValueDetailsObjectDto;
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
 * Service Class for *COIN_OFFER_DISCOUNT*
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesKaratageExchangeDiscountServiceImpl")
public class KaratageExchangeDiscountServiceImpl implements DiscountService {

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

	public static final String ONE_KARATAGE_TYPE = "1";

	public static final String TWO_KARATAGE_TYPE = "2";

	public KaratageExchangeDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name(), this);
	}

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// Validate if any discount type specific club offers applicable.
		// NA
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

		discountUtilService.deleteHeaderDiscountByDiscountDetails(salesTxn, discountDetails);

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {

		if (StringUtils.isEmpty(orderConfigDetails) && !salesTxn.getTxnType().equals(TransactionTypeEnum.AB.name())) {
			return;
		}

		if (StringUtils.isEmpty(orderConfigDetails)) {
			throw new ServiceException("Order Configurations not available for the discount applied", "ERR-DISC-015",
					"Discount code : " + discountCode);
		}

		// Is Display on AB being handled in discount engine, no need to validate that
		// again

		// Is gold rate frozen is a pre check to avail this discount done on discount
		// engine

		discountOtherDetailsDto.setMinPaymentPercent(orderConfigDetails.getAbPercent());

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA

	}

	/**
	 * Method to apply transaction level flat discounts
	 * 
	 * @param salesTxn
	 * @param DiscountBillLevelCreateDto
	 */
	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {

		DiscountOtherDetailsDto discountOtherDetails = new DiscountOtherDetailsDto();
		
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();
		discountBillLevelCreateDto.getDiscountDetails().forEach(discountBillDetail -> {

			// get payment
			PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
					discountBillDetail.getRefPaymentId(), PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(),
					CommonUtil.getStoreCode());

			EligibleDiscountItemsRequestDto eligibleDiscountItemsRequestDto = discountUtilService
					.getEligibleItemRequestBody(salesTxn, discountBillDetail);

			log.info("Sales - Karatage offer eligible Item check engine API Request body - {}",
					MapperUtil.getJsonString(eligibleDiscountItemsRequestDto));

			// Engine API call to get eligible items for selected discount
			EligibleDiscountItemsResponseDto eligibleDiscountItemResponse = engineService
					.getEligibleItemsForBillLevelDiscounts(discountType, eligibleDiscountItemsRequestDto);

			log.info("Sales - Karatage offer eligible Item check engine API Response body - {}",
					MapperUtil.getJsonString(eligibleDiscountItemResponse));

			if (CollectionUtils.isEmpty(eligibleDiscountItemResponse.getEligibleItemDetails())
					|| (!CollectionUtils.isEmpty(eligibleDiscountItemResponse.getEligibleItemDetails())
							&& CollectionUtils.isEmpty(
									eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getItemDetails()))) {
				throw new ServiceException(
						"No item eligible for the selected discount :- " + discountBillDetail.getDiscountCode(),
						"ERR-DISC-023", Map.of("discountCode", discountBillDetail.getDiscountCode()));
			}

			// If Order transactions, validate applicable order configs
			if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())) {
				validateOrderConfigs(salesTxn,
						eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails().getOrderConfigDetails(),
						discountOtherDetails,
						eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails().getDiscountCode());
			}
			
			// Validate Eligible Club offer configs
			discountUtilService.validateCommonEligibleClubOfferConfigs(
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getClubbingDetails(),
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getDiscountCode(),
					salesTxn);
			// Validate club with Bill level,if applicable.
			// Both TRUE and NULL value means eligible for Club
			if (!BooleanUtils.isNotFalse(eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
					.getClubbingDetails().getIsBillLevelDiscount())) {
				// verify if Bill level discount is applied in the transaction
				discountUtilService.verifyIfBillLevelDiscountAppliedInTransaction(salesTxn,eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
						.getDiscountCode());
			}
			
			// Create Discount details
			DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(
					discountBillDetail, salesTxn, DiscountApplicableLevelEnum.BILL_LEVEL.name(),
					DiscountInitialStatusEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.getDiscountInitialStatus(),
					discountBillDetail.getDiscountValue());
			
			//disable isDiscountPresent flag once discount is applied 
			paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
			discountDetailsDaoExt.setRefPayment(paymentDetailsDao);

			// Save discount config details & Link to the discount applied
			discountDetailsDaoExt.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()));

			// Apply Filter on karatage offer discount eligible item codes
			BigDecimal appliedTotalDiscountValue = validateAndApportionKaratageExchangeDiscount(salesTxn,
					eligibleDiscountItemResponse, discountDetailsDaoExt,discountOtherDetails);

			discountDetailsDaoExt.setDiscountValue(appliedTotalDiscountValue);

			BigDecimal maxDiscountAlloweed = eligibleDiscountItemResponse.getEligibleItemDetails().get(0)
					.getDiscountConfigDetails().getBasicCriteriaDetails().getMaxDiscount();

			// compare with max discount allowed and apply the same
			discountUtilService.validateMaxDiscountAllowed(discountDetailsDaoExt.getDiscountValue(),
					maxDiscountAlloweed, discountBillDetail.getDiscountCode());

			discountDetailsRepository.save(discountDetailsDaoExt);

			discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));

		});

		return new DiscountResponseDto(discountDetails);

	}

	@Transactional
	public BigDecimal validateAndApportionKaratageExchangeDiscount(SalesTxnDaoExt salesTxn,
			EligibleDiscountItemsResponseDto eligibleDiscountItemResponse,
			DiscountDetailsDaoExt discountDetailsDaoExt,DiscountOtherDetailsDto discountOtherDetails) {
		Map<String, List<String>> karatageDiscountEligibleItems = eligibleDiscountItemResponse.getEligibleItemDetails()
				.get(0).getItemDetails().stream()
				.collect(Collectors.groupingBy(DiscountItemsDto::getApplicableKaratageType,
						Collectors.mapping(DiscountItemsDto::getItemId, Collectors.toList())));

		BigDecimal oneKTDiscountValue = BigDecimal.ZERO;
		BigDecimal twoKTDiscountValue = BigDecimal.ZERO;

		BigDecimal appliedTotalDiscountValue = BigDecimal.ZERO;

		// Get the applicable Karatage specific discount values
		DiscountValueDetailsObjectDto discountValueDetailsObjectDto = discountUtilService
				.getDiscountValueDetailsObject(discountDetailsDaoExt.getDiscountValueDetails());
		for (DiscountValueDetails discountValueComponent : discountValueDetailsObjectDto.getDiscountValueDetails()) {
			if (discountValueComponent.getComponent()
					.equalsIgnoreCase(DiscountComponentTypeEnum.KARATAGE_DISCOUNT_1KT.name())) {
				oneKTDiscountValue = discountValueComponent.getDiscountValue();
			} else if (discountValueComponent.getComponent()
					.equalsIgnoreCase(DiscountComponentTypeEnum.KARATAGE_DISCOUNT_2KT.name())) {
				twoKTDiscountValue = discountValueComponent.getDiscountValue();
			}
		}

		List<String> eligibleSalesItemList = new ArrayList<>();
		karatageDiscountEligibleItems.forEach((k, v) -> {
			eligibleSalesItemList.addAll(v);
		});

		log.info("Eligible sales Items for karatage discount - {}", eligibleSalesItemList);

		for (Map.Entry<String, List<String>> entry : karatageDiscountEligibleItems.entrySet()) {

			log.info("Discount code :- {} >>> Applicable Karat type - {} and eligible item Id's - {}",
					discountDetailsDaoExt.getDiscountCode(), entry.getKey(), entry.getValue());

			BigDecimal karatageDiscountValue = BigDecimal.ZERO;

			if (entry.getKey().equalsIgnoreCase(ONE_KARATAGE_TYPE)) {
				karatageDiscountValue = oneKTDiscountValue;
			} else if (entry.getKey().equalsIgnoreCase(TWO_KARATAGE_TYPE)) {
				karatageDiscountValue = twoKTDiscountValue;
			}
			// Apportion the bill discounts to the karatage specific eligible item Id's
			BigDecimal appliedKaratageDiscountValue = discountUtilService.apportionKaratageDiscountsToApplicableItems(
					discountDetailsDaoExt, salesTxn, eligibleSalesItemList, karatageDiscountValue, entry.getKey(),
					entry.getValue(),discountOtherDetails);

			log.info(
					"Eligible Karatage type - {}, >>> karatageDiscountValue - {} and appliedKaratageDiscountValue - {}",
					entry.getKey(), karatageDiscountValue, appliedKaratageDiscountValue);

			// Sum up the applied Karatage discount value
			appliedTotalDiscountValue = appliedTotalDiscountValue.add(appliedKaratageDiscountValue);

		}
		return appliedTotalDiscountValue;
	}

	@Override
	@Transactional
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				// Check at least one item should have apportioned this Karatage offer discount
				List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetails.getId());
				if (!CollectionUtils.isEmpty(discountItemDetailsList)) {
					discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
				}
			}
		}

		discountDetailsRepository.saveAll(discountDaoList);
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

		// Pending: group by should be on applicable karatage type
		Map<String, List<DiscountItemDetailsDaoExt>> karatageSpecificItemDiscounts = apportionedItemDiscountDetails
				.stream().collect(Collectors.groupingBy(DiscountItemDetailsDaoExt::getApplicableKaratageType,
						Collectors.mapping(discountItemDetails -> discountItemDetails, Collectors.toList())));

		BigDecimal oneKTDiscountValue = BigDecimal.ZERO;
		BigDecimal twoKTDiscountValue = BigDecimal.ZERO;

		// Get the applicable Karatage specific discount values
		DiscountValueDetailsObjectDto discountValueDetailsObjectDto = discountUtilService
				.getDiscountValueDetailsObject(discountDetailDao.getDiscountValueDetails());
		for (DiscountValueDetails discountValueComponent : discountValueDetailsObjectDto.getDiscountValueDetails()) {
			if (discountValueComponent.getComponent()
					.equalsIgnoreCase(DiscountComponentTypeEnum.KARATAGE_DISCOUNT_1KT.name())) {
				oneKTDiscountValue = discountValueComponent.getDiscountValue();
			} else if (discountValueComponent.getComponent()
					.equalsIgnoreCase(DiscountComponentTypeEnum.KARATAGE_DISCOUNT_2KT.name())) {
				twoKTDiscountValue = discountValueComponent.getDiscountValue();
			}
		}

		for (Map.Entry<String, List<DiscountItemDetailsDaoExt>> entry : karatageSpecificItemDiscounts.entrySet()) {
			log.info("Discount code :- {} >>> Applicable Karat type - {} and eligible item discount details - {}",
					discountDetailDao.getDiscountCode(), entry.getKey(), entry.getValue());

			BigDecimal karatageDiscountValue = BigDecimal.ZERO;

			if (entry.getKey().equalsIgnoreCase(ONE_KARATAGE_TYPE)) {
				karatageDiscountValue = oneKTDiscountValue;
			} else if (entry.getKey().equalsIgnoreCase(TWO_KARATAGE_TYPE)) {
				karatageDiscountValue = twoKTDiscountValue;
			}
			// Re Apportion the Karatage discounts to the eligible items
			discountUtilService.reApportionKaratageDiscountsToApplicableItems(discountDetailDao, salesTxn,
					entry.getValue(), isPriceUpdate, karatageDiscountValue);
		}

		log.info("Discount apportioned item details - {}{}", discountDetailDao, apportionedItemDiscountDetails);

		BaseBasicCriteriaDetails baseBasicCriteriaDetails = (BaseBasicCriteriaDetails) MapperUtil.getObjectMapping(
				discountDetailDao.getDiscountConfig().getBasicCriteriaDetails(), new BaseBasicCriteriaDetails());

		if (baseBasicCriteriaDetails.getMaxDiscount() != null) {
			// compare with max discount allowed and apply the same
			discountUtilService.validateMaxDiscountAllowed(discountDetailDao.getDiscountValue(),
					baseBasicCriteriaDetails.getMaxDiscount(), discountDetailDao.getDiscountCode());

		}

		discountDetailsRepository.save(discountDetailDao);

	}

	@Override
	@Transactional
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		EligibleDiscountAbItemsRequestDto eligibleDiscountItemsRequestDto = discountUtilService
				.getEligibleItemRequestBodyForOrderToCM(salesTxn, orderDiscountDetailDao);

		log.info("Sales - Karatage offer eligible Item check engine API for order to CM Request body - {}",
				MapperUtil.getJsonString(eligibleDiscountItemsRequestDto));

		// Engine API call to get eligible items for selected discount
		EligibleDiscountItemsResponseDto eligibleDiscountItemResponse = engineService
				.getEligibleItemsForBillLevelDiscountsForAbToCm(discountType, eligibleDiscountItemsRequestDto);

		log.info("Sales - Karatage offer eligible Item check engine API for order to CM Response body - {}",
				MapperUtil.getJsonString(eligibleDiscountItemResponse));

		// If none of the items in CM eligible for Karatage offer discount means ignore
		// the discount
		if (!CollectionUtils.isEmpty(eligibleDiscountItemResponse.getEligibleItemDetails())) {
			// Validate Eligible Club offer configs
			discountUtilService.validateCommonEligibleClubOfferConfigs(
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getClubbingDetails(),
					eligibleDiscountItemResponse.getEligibleItemDetails().get(0).getDiscountConfigDetails()
							.getDiscountCode(),
					salesTxn);

			DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService
					.createBillLevelDiscountDetailsForOrderToCM(orderDiscountDetailDao, salesTxn,
							DiscountInitialStatusEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.getDiscountInitialStatus());

			// Map discount config details from Order to CM
			discountDetailsDaoExt.setDiscountConfig((DiscountConfigDetailsDaoExt) MapperUtil.getObjectMapping(
					orderDiscountDetailDao.getDiscountConfig(), new DiscountConfigDetailsDaoExt(), "id"));

			// Save the carry forwarded discount config details
			discountConfigDetailsRepository.save(discountDetailsDaoExt.getDiscountConfig());

			// Apply Filter on karatage offer discount eligible item codes
			BigDecimal appliedTotalDiscountValue = validateAndApportionKaratageExchangeDiscount(salesTxn,
					eligibleDiscountItemResponse, discountDetailsDaoExt,null);

			discountDetailsDaoExt.setDiscountValue(appliedTotalDiscountValue);

			BigDecimal maxDiscountAlloweed = eligibleDiscountItemResponse.getEligibleItemDetails().get(0)
					.getDiscountConfigDetails().getBasicCriteriaDetails().getMaxDiscount();

			// compare with max discount allowed and apply the same
			discountUtilService.validateMaxDiscountAllowed(discountDetailsDaoExt.getDiscountValue(),
					maxDiscountAlloweed, discountDetailsDaoExt.getDiscountCode());

			discountDetailsRepository.save(discountDetailsDaoExt);

		}

	}

}
