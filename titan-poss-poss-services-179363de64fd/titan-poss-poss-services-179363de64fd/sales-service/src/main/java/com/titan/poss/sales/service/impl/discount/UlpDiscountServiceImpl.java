/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.LoyaltyDetails;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.DiscountUlpFlagValuesEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.CustomerUlpDao;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.CustomerUlpRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.IntegrationService;

/**
 * Service class for Encircle Discounts
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesUlpDiscountServiceImpl")
public class UlpDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CustomerTxnRepositoryExt customerTxnRepository;

	@Autowired
	private CustomerUlpRepositoryExt customerUlpRepository;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	private static final String ULP_BIRTHDAY = "BIRTHDAY";
	private static final String ULP_SPOUSE_BIRTHDAY = "SPOUSE_BIRTHDAY";
	private static final String ULP_ANNIVERSARY = "ANNIVERSARY";

	public UlpDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name(), this);
		discountFactory.registerDiscountService(DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name(), this);
		discountFactory.registerDiscountService(DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name(), this);
	}

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA

	}

	@Override
	@Transactional
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {
		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
				DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
				DiscountInitialStatusEnum.valueOf(discountDetail.getDiscountType()).getDiscountInitialStatus(), null);

		// Save discount config details & Link to the discount applied
		discountDetailsDao.setDiscountConfig(discountUtilService
				.saveDiscountConfigDetails(discountEngineResponseConfigs.getDiscountConfigDetails()));

		return discountDetailsDao;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		// Not Applicable for encircle discount

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// Not Applicable for encircle discount

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		// Validate encircle discount selected by user
		validateEncircleDetailsAndDiscountType(discountTransactionDetails, discountDetail.getDiscountType());

		LoyaltyDetails loyaltyDetails = getCustomerLoyaltyDetails(salesTxn);

		Boolean isCustomerEligibleForDiscount = false;
		Boolean isDiscountAvailed = false;

		if (discountDetail.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name())) {
			// If business date is not lies between (birthday +/- 15 days), Not eligible for
			// Birthday discount - Will be taken care at encircle side, we solely rely on
			// flag
			// If Flag value is 'MB', eligible for Birthday discount
			if (!StringUtils.isEmpty(loyaltyDetails.getBirthdayDiscount())
					&& loyaltyDetails.getBirthdayDiscount().equalsIgnoreCase(DiscountUlpFlagValuesEnum.MB.name())) {
				isCustomerEligibleForDiscount = true;
			} else if (!StringUtils.isEmpty(loyaltyDetails.getBirthdayDiscount())
					&& loyaltyDetails.getBirthdayDiscount().equalsIgnoreCase(DiscountUlpFlagValuesEnum.A.name())) {
				isDiscountAvailed = true;
			}

		} else if (discountDetail.getDiscountType()
				.equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name())) {
			// If Flag value is 'MSB', eligible for Spouse Birthday discount
			if (!StringUtils.isEmpty(loyaltyDetails.getSpouseBirthdayDiscount()) && loyaltyDetails
					.getSpouseBirthdayDiscount().equalsIgnoreCase(DiscountUlpFlagValuesEnum.MSB.name())) {
				isCustomerEligibleForDiscount = true;
			} else if (!StringUtils.isEmpty(loyaltyDetails.getSpouseBirthdayDiscount()) && loyaltyDetails
					.getSpouseBirthdayDiscount().equalsIgnoreCase(DiscountUlpFlagValuesEnum.A.name())) {
				isDiscountAvailed = true;
			}

		} else if (discountDetail.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name())
				&& !StringUtils.isEmpty(loyaltyDetails.getAnniversaryDiscount())
				&& loyaltyDetails.getAnniversaryDiscount().equalsIgnoreCase(DiscountUlpFlagValuesEnum.Y.name())) {
			// If Flag value is 'Y', eligible for Anniversary discount
			isCustomerEligibleForDiscount = true;
		}

		checkDiscountEligibility(discountDetail, isCustomerEligibleForDiscount, isDiscountAvailed);

	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// NA

		return null;

	}

	private LoyaltyDetails getCustomerLoyaltyDetails(SalesTxnDaoExt salesTxn) {

		// Customer selection is mandatory to apply Encircle discounts
		if (StringUtils.isEmpty(salesTxn.getCustomerId())) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Customer selection is mandatory to apply Encircle discounts",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Customer selection is mandatory to apply Encircle discounts"));
		}

		// Get customer ULP id from customer transaction details
		CustomerTxnDaoExt customerTxnDao = customerTxnRepository.findOneBySalesTxnDaoId(salesTxn.getId());

		// Get ULP details for a Encircle custoemr by ULP ID
		Optional<CustomerUlpDao> customerUlpDao = customerUlpRepository.findById(customerTxnDao.getUlpId());

		if (!customerUlpDao.isPresent()) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Customer ULP details Not available",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, "Customer ULP details Not available"));
		}

		if (StringUtils.isEmpty(customerUlpDao.get().getLoyaltyDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Customer Loyalty details Not available",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Customer Loyalty details Not available"));
		}

		JsonData loyaltyDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(customerUlpDao.get().getLoyaltyDetails()), JsonData.class);

		return MapperUtil.mapObjToClass(loyaltyDetails.getData(), LoyaltyDetails.class);

	}

	public void checkDiscountEligibility(DiscountDetailDto discountDetail, Boolean isCustomerEligibleForDiscount,
			Boolean isDiscountAvailed) {
		if (BooleanUtils.isFalse(isCustomerEligibleForDiscount)) {
			if (BooleanUtils.isTrue(isDiscountAvailed)) {
				throw new ServiceException(
						SalesConstants.INVALID_REQUEST + "Customer has already availed the ULP discount",
						SalesConstants.ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Customer has already availed the ULP discount"));
			} else {
				throw new ServiceException("Customer Not eligible to get the ULP discount", "ERR-DISC-016",
						"Discount Code: " + discountDetail.getDiscountCode());
			}
		}
	}

	@Override
	@Transactional
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {
		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		// Get customer ULP id from customer transaction details
		CustomerTxnDaoExt customerTxnDao = customerTxnRepository.findOneBySalesTxnDaoId(salesTxn.getId());

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		// Validate encircle discount selected by user
		validateEncircleDetailsAndDiscountType(discountTransactionDetails, discountType);

		String availedDiscountType = "";
		if (discountType.equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name())) {
			availedDiscountType = ULP_BIRTHDAY;
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name())) {
			availedDiscountType = ULP_ANNIVERSARY;
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name())) {
			availedDiscountType = ULP_SPOUSE_BIRTHDAY;
		}

		// If Discount flag is already updated, just return
		if (!StringUtils.isEmpty(discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId())
				&& BooleanUtils.isTrue(discountTransactionDetails.getEncircleDetails().getIsUlpDiscountFlagUpdated())) {
			return;
		}

		// Update availed discount flag back to ULP
		UlpDiscountDto ulpDiscountRequestDto = new UlpDiscountDto();
		ulpDiscountRequestDto.setUlpId(customerTxnDao.getUlpId());
		ulpDiscountRequestDto.setDiscountType(availedDiscountType);
		ulpDiscountRequestDto.setInvoiceDate(salesTxn.getDocDate());
		UlpDiscountResponseDto ulpDiscountResponseDto = integrationService
				.availLoyaltyDiscounts(VendorCodeEnum.ULP_NETCARROTS.name(), ulpDiscountRequestDto);
		if (!"0".equals(ulpDiscountResponseDto.getResponseCode())) {
			discountTransactionDetails.getEncircleDetails().setIsUlpDiscountFlagUpdated(false);
			updateEncircleDetailsAndUpdateSalesTxn(salesTxn, discountTransactionDetails);

			Map<String, String> errorCause = Map.of("discountType",
					discountTransactionDetails.getEncircleDetails().getDiscountType(), "errorMessage",
					ulpDiscountResponseDto.getResponseMessage());

			throw new ServiceException(null, ulpDiscountResponseDto.getResponseCode(), errorCause);
		}

		discountTransactionDetails.getEncircleDetails().setIsUlpDiscountFlagUpdated(true);
		discountTransactionDetails.getEncircleDetails().setUlpDiscountTxnId(ulpDiscountResponseDto.getTransactionId());

		for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
			// Update discount status to CONFIRMED after coupon code redemption
			discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
		}

		discountDetailsRepository.saveAll(discountDaoList);

		// Update encircle details back to sales txn
		updateEncircleDetailsAndUpdateSalesTxn(salesTxn, discountTransactionDetails);
	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		List<DiscountItemDetailsDaoExt> itemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn, discountType);

		// Get customer ULP id from customer transaction details
		CustomerTxnDaoExt customerTxnDao = customerTxnRepository.findOneBySalesTxnDaoId(salesTxn.getId());

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (!StringUtils.isEmpty(discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId())
				&& BooleanUtils.isTrue(discountTransactionDetails.getEncircleDetails().getIsUlpDiscountFlagUpdated())) {
			// Revert ULP availed flag

			UlpBillCancellationDto ulpBillCancellationDto = new UlpBillCancellationDto();
			ulpBillCancellationDto.setUlpId(customerTxnDao.getUlpId());
			ulpBillCancellationDto.setDiscountType(DiscountTypeEnum.getUlpDiscountType( discountTransactionDetails.getEncircleDetails().getDiscountType()));
			ulpBillCancellationDto.setInvoiceCancelDate(salesTxn.getDocDate());
			ulpBillCancellationDto
					.setTransactionId(discountTransactionDetails.getEncircleDetails().getUlpDiscountTxnId());
			UlpBaseResponseDto ulpDiscountReverseResponseDto = integrationService
					.reverseAvailedDiscount(VendorCodeEnum.ULP_NETCARROTS.name(), ulpBillCancellationDto);
			if (!"0".equals(ulpDiscountReverseResponseDto.getResponseCode())) {

				Map<String, String> errorCause = Map.of("discountType",
						discountTransactionDetails.getEncircleDetails().getDiscountType(), "errorMessage",
						ulpDiscountReverseResponseDto.getResponseMessage());

				throw new ServiceException(null, ulpDiscountReverseResponseDto.getResponseCode(), errorCause);
			}

		}

		if (!CollectionUtils.isEmpty(itemDiscountDetailsList)) {
			Set<String> updatedItemIds = new HashSet<>();
			for (DiscountItemDetailsDaoExt itemDiscountDetails : itemDiscountDetailsList) {

				updatedItemIds.add(itemDiscountDetails.getItemId());

				// Delete the apportioned discount values at item level
				discountItemDetailsRepository.deleteById(itemDiscountDetails.getId());

				// Delete bill level discount at sales transaction level
				discountDetailsRepository.deleteById(itemDiscountDetails.getDiscountDetail().getId());
			}

			// Update discount values for the impacted items
			if (!CollectionUtils.isEmpty(updatedItemIds))
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
		}

		// Delete Encircle details from discount txn details of sales txn data
		discountTransactionDetails.setEncircleDetails(null);

		salesTxn.setDiscountTxnDetails(MapperUtil
				.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// NA

	}

	private void validateEncircleDetailsAndDiscountType(DiscountTransactionDetails discountTransactionDetails,
			String discountType) {
		if (StringUtils.isEmpty(discountTransactionDetails) || (!StringUtils.isEmpty(discountTransactionDetails)
				&& StringUtils.isEmpty(discountTransactionDetails.getEncircleDetails()))) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Please select eligible Encircle Discount from Dropdown",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Please select eligible Encircle Discount from Dropdown"));
		}

		if (!discountTransactionDetails.getEncircleDetails().getDiscountType().equalsIgnoreCase(discountType)) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST
							+ "Discount type Mis match. Please apply only the selected encircle discount from dropdown",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Discount type Mis match. Please apply only the selected encircle discount from dropdown"));
		}
	}

	@Transactional
	public void updateEncircleDetailsAndUpdateSalesTxn(SalesTxnDaoExt salesTxn,
			DiscountTransactionDetails discountTransactionDetails) {
		salesTxn.setDiscountTxnDetails(MapperUtil
				.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));
		salesTxnRepository.save(salesTxn);
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}

}
