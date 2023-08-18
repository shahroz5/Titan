/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.RivaahGhsDiscountDetailsExtDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Rivaah GHS.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesRivaahGhsDiscountServiceImpl")
public class RivaahGhsDiscountServiceImpl implements DiscountService {

	public RivaahGhsDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name(), this);
	}

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA

	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {

		log.info("Apply discount: {}, txnId: {}, discountId: {}", discountDetail.getDiscountType(), salesTxn.getId(),
				discountDetail.getDiscountId());

		PaymentDetailsDaoExt paymentDetailsDao = null;
		// if AB to CM scenario, then ignore payment check
		if (StringUtils.isEmpty(discountDetail.getReferenceId())) {
			paymentDetailsDao = paymentDetailsRepositoryExt.findByPaymentCodeAndInstrumentNoAndSalesTxnDaoId(
					PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(),
					discountEngineResponseConfigs.getRivaahGhsDetails().getAccountNo(), salesTxn.getId());
			if (paymentDetailsDao == null) {
				paymentDetailsDao = paymentDetailsRepositoryExt.findByIdAndSalesTxnDaoLocationCode(
						discountEngineResponseConfigs.getRivaahGhsDetails().getRefPaymentId(),
						salesTxn.getLocationCode());
			}
			if (paymentDetailsDao == null || PaymentStatusEnum.FAILED.name().equals(paymentDetailsDao.getStatus())) {
				throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
						"Either payment does not exists for the discount to be added or the payment is not valid.",
						Map.of(SalesConstants.REMARKS, "Payment is invalid for the discount."));
			}
			log.info("refPaymentId for discount: {}", paymentDetailsDao.getId());
		}

		// get payment added for the account and link it :pending for CN as payment

		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
				DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
				StringUtils.isEmpty(discountDetail.getReferenceId())
						? DiscountInitialStatusEnum.RIVAAH_ASHIRWAAD_DISCOUNT.getDiscountInitialStatus()
						: DiscountSalesStatusEnum.CONFIRMED.name(),
				paymentDetailsDao);

		// Save discount config details & Link to the discount applied
		discountDetailsDao.setDiscountConfig(discountUtilService
				.saveDiscountConfigDetails(discountEngineResponseConfigs.getDiscountConfigDetails()));

		// for RIVAAH GHS change explicitly change discount value details
		discountDetailsDao.setDiscountValueDetails(MapperUtil.getStringFromJson(
				new JsonData("DISCOUNT_VALUE_DETAILS", discountEngineResponseConfigs.getRivaahGhsDetails())));

		// add RIVAAH details to discount value details
		return discountDetailsDao;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {

		List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetailsDaoExt.getId());
		if (CollectionUtils.isEmpty(apportionedItemDiscounts)) {
			return;
		}
		DiscountItemDetailsDaoExt discountItemDetailsDao = apportionedItemDiscounts.get(0);
		List<DiscountItemDetailsDaoExt> itemDiscountsToBeDeleted = new ArrayList<>();
		Set<String> impactedItemIds = new HashSet<>();
		// If Clubbed or Cumulative discounts, dependent discounts will be deleted
		// together
		// Pending: Multiple level of Cumulative & clubbed discount to be deleted too
		/*
		 * if (!StringUtils.isEmpty(discountItemDetailsDao.getDiscountDetail().
		 * getClubbedDiscountId())) { itemDiscountsToBeDeleted =
		 * discountItemDetailsRepository
		 * .findAllByDiscountDetailSalesTxnAndDiscountDetailClubbedDiscountIdAndItemIdIn
		 * (salesTxn, discountItemDetailsDao.getDiscountDetail().getClubbedDiscountId(),
		 * discountItemDetailsDao.getItemId()); } if
		 * (!StringUtils.isEmpty(discountItemDetailsDao.getDiscountDetail().
		 * getCumulativeDiscountId())) { itemDiscountsToBeDeleted =
		 * discountItemDetailsRepository
		 * .findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(
		 * salesTxn,
		 * List.of(discountItemDetailsDao.getDiscountDetail().getCumulativeDiscountId())
		 * ); // All the items part of cumulative discounts should be updated with
		 * latest // value impactedItemIds =
		 * itemDiscountsToBeDeleted.stream().map(DiscountItemDetailsDaoExt::getItemId)
		 * .collect(Collectors.toSet()); }
		 */

		// If Clubbed discounts or Cumulative discounts not found, will be deleted
		// independently
		if (CollectionUtils.isEmpty(itemDiscountsToBeDeleted)) {
			itemDiscountsToBeDeleted.add(discountItemDetailsDao);
		}
		// Delete discount details
		discountUtilService.deleteAllItemDiscountDetails(itemDiscountsToBeDeleted);
		
		

		impactedItemIds.add(discountItemDetailsDao.getItemId());

		// Update discount value & final value of impacted items
		discountUtilService.updateTransactionSpecificItemDetails(salesTxn, impactedItemIds, false);
	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// Na

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {

		// if Ab to CM discount, then ignore check.
		if (!StringUtils.isEmpty(discountDetail.getReferenceId())) {
			return;
		}

		if (StringUtil.isBlankJsonStr(salesTxn.getDiscountTxnDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Rivaah discount details not found",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, "Rivaah discount details not found"));
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails())
				|| CollectionUtil.isEmpty(discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs())) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Rivaah Discount should be selected to apply the discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Rivaah Discount should be selected to apply the discount"));
		}

		// if same type of discount is added for the item already, then also throw error
		List<DiscountItemDetailsDaoExt> discountsOfSameType = discountItemDetailsRepository
				.findAllByItemIdAndDiscountDetailSalesTxnIdAndDiscountDetailDiscountType(itemId, salesTxn.getId(),
						discountDetail.getDiscountType());
		if (!CollectionUtil.isEmpty(discountsOfSameType)) {
			throw new ServiceException(
					SalesConstants.DYNAMIC_DISCOUNT_CODE_CANNOT_BE_CLUBBED_WITH_DYNAMIC_INVALID_DISCOUNT_CODES,
					SalesConstants.ERR_DISC_033,
					"One item cannot have mutiple discount of type: " + discountDetail.getDiscountType(),
					Map.of(SalesConstants.DISCOUNT_CODE, discountDetail.getDiscountCode(), "invalidDiscountCodes",
							discountsOfSameType.stream()
									.map(itemDiscount -> itemDiscount.getDiscountDetail().getDiscountCode())
									.collect(Collectors.toList()).toString()));
		}

		RivaahGhsDiscountDto rivaahDetailsFound = null;
		for (RivaahGhsDiscountDto rivaahGhsDetails : discountTxnDetails.getRivaahGhsDiscountDetails().getRivaahGhs()) {
			if (rivaahGhsDetails.getAccountNo().equals(discountDetail.getRivaahGhsDiscountDetails().getAccountNo())
					&& rivaahGhsDetails.getSchemeCode()
							.equals(discountDetail.getRivaahGhsDiscountDetails().getSchemeCode())
					&& rivaahGhsDetails.getMakingChargeDiscountPercent()
							.equals(discountDetail.getRivaahGhsDiscountDetails().getMakingChargeDiscountPercent())
					&& rivaahGhsDetails.getUcpDiscountPercent()
							.equals(discountDetail.getRivaahGhsDiscountDetails().getUcpDiscountPercent())) {
				rivaahDetailsFound = rivaahGhsDetails;
				break;
			}
		}

		if (rivaahDetailsFound == null) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Given rivaah Discount not found",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Given rivaah Discount not found in transaction."));
		}

		// item should be not be in excluded product group for RIVAAH GHS
		List<SalesItemDetailsDto> itemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn,
				List.of(itemId));
		if (CollectionUtil.isEmpty(itemList)) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid item id: " + itemId, Map.of("type", "item"));
		}

		if (!CollectionUtil.isEmpty(rivaahDetailsFound.getExcludeProductGroup())
				&& rivaahDetailsFound.getExcludeProductGroup().contains(itemList.get(0).getProductGroupCode())) {
			throw new ServiceException(discountDetail.getDiscountCode() + " not eligible for apportion to the item.",
					"ERR-DISC-007",
					"Discount Code: " + discountDetail.getDiscountCode() + ", not eligible for apportion to the item.",
					Map.of("discountCode", discountDetail.getDiscountCode()));
		}

	}

	@Transactional
	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		log.info("Apply discount: {}, txnId: {}, discountId: {}, refPaymentId: {}", discountType, salesTxn.getId(),
				discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountId(),
				discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId());

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// check if discount already exists
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		if (discountTxnDetails.getRivaahGhsDiscountDetails() == null || BooleanUtils
				.isNotTrue(discountTxnDetails.getRivaahGhsDiscountDetails().getIsRivaahDiscountApplicable())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Rivaah GHS details not found to validate."));
		}

		// if present and applicable is true, then need to delete previous
		// discounts and handle.
		deleteTransactionLevelDiscounts(salesTxn, DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name());

		// take RIVAAH GHS discount:
		// 1. one for max MC
		// 2. another one for max UCP
		List<PaymentDetailsDaoExt> ghsPaymentDetailsList = paymentDetailsRepositoryExt
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxn.getId(),
						PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), null, null, salesTxn.getLocationCode(),
						PaymentStatusEnum.getPaidPaymentStatus());
		// get valid CN payments also
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = getValidCreditNotePayments(salesTxn);
		// combine same customer CN with GHS discount
		List<PaymentDetailsDaoExt> paymentList = Stream.of(cnPaymentDetailsList, ghsPaymentDetailsList)
				.flatMap(Collection::stream).collect(Collectors.toList());

		// if list is empty, then return
		if (CollectionUtil.isEmpty(paymentList)) {
			// save rivaahGHS details in txn for future purpose
			updateDiscountTxnDetailsForRivaahGhs(salesTxn, null, discountTxnDetails, false);
			return new DiscountResponseDto(List.of(), List.of());
		}

		Map<String, PaymentDetailsDaoExt> rivaahGhsPaymentDetailsMap = new HashMap<>();
		List<RivaahGhsDiscountDto> rivaahDetailsList = getRivaahGhsWithMaxDiscountPct(paymentList,
				rivaahGhsPaymentDetailsMap);

		if (rivaahDetailsList.isEmpty()) {
			return new DiscountResponseDto(List.of(), List.of());
		}
		// set rivaahDetails to request body
		discountBillLevelCreateDto.setRivaahGhsDetails(new RivaahGhsDiscountDetailsDto(rivaahDetailsList));

		// validate details
		DiscountBillLevelRequestDto discountBillLevelRequestDto = discountUtilService
				.getDiscountEligibleRequestDto(salesTxn, discountBillLevelCreateDto, discountType);

		// if exclude PGC mapping exists, filter items that belong to excluded product
		// group.
		List<DiscountItemsDto> itemsToRemove = new ArrayList<>();
		List<String> combinedExcludeProductGroupList = new ArrayList<>();
		rivaahDetailsList.forEach(rivaahGhsDetail -> {
			if (!CollectionUtil.isEmpty(rivaahGhsDetail.getExcludeProductGroup())) {
				combinedExcludeProductGroupList.addAll(rivaahGhsDetail.getExcludeProductGroup());
			}
		});

		if (!CollectionUtil.isEmpty(combinedExcludeProductGroupList)) {

			discountBillLevelRequestDto.getItemDetails().forEach(item -> {
				if (combinedExcludeProductGroupList.contains(item.getProductGroupCode())) {
					itemsToRemove.add(item);
				}
			});
		}
		if (!CollectionUtil.isEmpty(itemsToRemove)) {
			discountBillLevelRequestDto.getItemDetails().removeAll(itemsToRemove);
		}

		DiscountBillLevelResponseDto discountEligibleItemResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		// if response if empty, then discount not applicable,
		if (CollectionUtil.isEmpty(discountEligibleItemResponseDto.getDiscountDetails())) {
			updateDiscountTxnDetailsForRivaahGhs(salesTxn, null, discountTxnDetails, false);
			return new DiscountResponseDto(List.of(), List.of());
		}

		// if item list is empty discount is applicable but the items in transaction are
		// not eligible for it.
		if (CollectionUtil.isEmpty(discountEligibleItemResponseDto.getDiscountDetails().get(0).getItemDetails())) {
			// save rivaahGHS details in txn for future purpose
			updateDiscountTxnDetailsForRivaahGhs(salesTxn, discountBillLevelCreateDto.getRivaahGhsDetails(),
					discountTxnDetails, false);
			return new DiscountResponseDto(List.of(), List.of());
		}

		// call engine to get discount for valid items,
		// clubbing to be checked at item level? -- have to understand how to go about
		// it
		// TODO
		List<String> discountIdList = discountUtilService.validateAndCreateBestDiscountForEligibleItems(salesTxn,
				discountEligibleItemResponseDto, discountBillLevelCreateDto);
		
		discountTxnDetails=discountUtilService.getDiscountTxnDetails(salesTxn);


		// compare discount with each of the existing item discount value,
		// if new discount is higher then old to be deleted and new to be given.

		// save rivaahGHS details in txn for future purpose
		updateDiscountTxnDetailsForRivaahGhs(salesTxn, discountBillLevelCreateDto.getRivaahGhsDetails(),
				discountTxnDetails, false);

		// to check min utilization % for all GHS payments
		// sort payments by row id
		ghsPaymentDetailsList.sort(Comparator.comparing(PaymentDetailsDaoExt::getRowId, Comparator.reverseOrder()));
		BigDecimal remainingAmount = commonPaymentService.getTxnValueAndDueAmount(salesTxn, false).getAmountDue();
		if (remainingAmount.signum() < 0) {
			throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
					SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
		}

		for (PaymentDetailsDaoExt paymentDao : ghsPaymentDetailsList) {
			remainingAmount = remainingAmount.add(paymentDao.getAmount());

			JsonData jsonData = MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class);
			GhsPaymentOtherDetailsDto ghsPaymentOtherDetailsDto = MapperUtil.mapObjToClass(jsonData.getData(),
					GhsPaymentOtherDetailsDto.class);

			commonPaymentService.checkMinUtilization(paymentDao, ghsPaymentOtherDetailsDto.getBalance(),
					ghsPaymentOtherDetailsDto.getMinUtilizationPct(), remainingAmount);
		}

		return new DiscountResponseDto(List.of(), discountIdList);
	}

	private List<PaymentDetailsDaoExt> getValidCreditNotePayments(SalesTxnDaoExt salesTxn) {
		List<PaymentDetailsDaoExt> cnPaymentDetailsList = paymentDetailsRepositoryExt.getAllPaymentCodePayments(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), salesTxn.getId(),
				PaymentStatusEnum.getPaidPaymentStatus(), salesTxn.getLocationCode());
		// filter CN with Rivaah GHS discount
		if (!CollectionUtil.isEmpty(cnPaymentDetailsList)) {
			List<PaymentDetailsDaoExt> tempCnPaymentList = new ArrayList<>();
			for (PaymentDetailsDaoExt paymentDao : cnPaymentDetailsList) {
				CreditNotePaymentOtherDetailsDto otherD = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(paymentDao.getOtherDetails(), JsonData.class).getData(),
						CreditNotePaymentOtherDetailsDto.class);
				// if Rivaah discount is valid, then discount id will be presnet
				if (salesTxn.getCustomerId().equals(otherD.getCnOwnerId())
						&& DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(otherD.getDiscountType())
						&& !StringUtils.isEmpty(otherD.getDiscountId())) {
					tempCnPaymentList.add(paymentDao);
				}
			}
			cnPaymentDetailsList = tempCnPaymentList;
		}
		return cnPaymentDetailsList;
	}

	private List<RivaahGhsDiscountDto> getRivaahGhsWithMaxDiscountPct(List<PaymentDetailsDaoExt> paymentDetailsDaoList,
			Map<String, PaymentDetailsDaoExt> rivaahGhsPaymentDetailsMap) {

		RivaahGhsDiscountDto rivaahGhsDetailsForMc = null;
		RivaahGhsDiscountDto rivaahGhsDetailsForUcp = null;

		for (PaymentDetailsDaoExt paymentDetails : paymentDetailsDaoList) {
			// if not Rivaah GHS payment, then ignore.
			if (checkIfGhsPaymentIsRivaah(paymentDetails)) {
				continue;
			}

			JsonData jsonData = MapperUtil.mapObjToClass(paymentDetails.getOtherDetails(), JsonData.class);
			String discountId;
			String schemeCode;
			List<String> productGroupRestrictedList;
			Integer discountMcPct;
			Integer discountUcpPct;
			String instrumentNumber;
			if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetails.getPaymentCode())) {
				GhsPaymentOtherDetailsDto oldGhsOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						GhsPaymentOtherDetailsDto.class);
				discountId = oldGhsOtherDetails.getDiscountId();
				schemeCode = oldGhsOtherDetails.getSchemeCode();
				discountMcPct = oldGhsOtherDetails.getDiscountMcPct();
				discountUcpPct = oldGhsOtherDetails.getDiscountUcpPct();
				productGroupRestrictedList = oldGhsOtherDetails.getProductGroupCodesRestricted();
				instrumentNumber = paymentDetails.getInstrumentNo();
			} else {
				CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						CreditNotePaymentOtherDetailsDto.class);
				discountId = cnOtherDetails.getDiscountId();
				schemeCode = cnOtherDetails.getSchemeCode();
				discountMcPct = cnOtherDetails.getDiscountMcPct();
				discountUcpPct = cnOtherDetails.getDiscountUcpPct();
				productGroupRestrictedList = cnOtherDetails.getProductGroupCodesRestricted();
				instrumentNumber = paymentDetails.getInstrumentNo() + "_" + paymentDetails.getReference2();
			}

			// if discount is present, then it's considered
			if (!StringUtils.isEmpty(discountId)) {
				if (checkMaxMcPct(rivaahGhsDetailsForMc, discountMcPct)) {
					rivaahGhsDetailsForMc = new RivaahGhsDiscountDto(schemeCode, productGroupRestrictedList,
							new BigDecimal(discountMcPct), new BigDecimal(discountUcpPct), instrumentNumber, true,
							false, paymentDetails.getId(), paymentDetails.getPaymentCode());

					rivaahGhsPaymentDetailsMap.put(paymentDetails.getId(), paymentDetails);
				}

				if (checkMaxUcpPct(rivaahGhsDetailsForUcp, discountUcpPct)) {
					rivaahGhsDetailsForUcp = new RivaahGhsDiscountDto(schemeCode, productGroupRestrictedList,
							new BigDecimal(discountMcPct), new BigDecimal(discountUcpPct), instrumentNumber, false,
							true, paymentDetails.getId(), paymentDetails.getPaymentCode());

					rivaahGhsPaymentDetailsMap.put(paymentDetails.getId(), paymentDetails);
				}

			}

		}

		// if list is empty, then return
		if (rivaahGhsPaymentDetailsMap.isEmpty()) {
			return new ArrayList<>();
		}

		// rivaah Ghs details list
		return getValidRivaahGhsDetails(rivaahGhsDetailsForMc, rivaahGhsDetailsForUcp);
	}

	private boolean checkMaxUcpPct(RivaahGhsDiscountDto rivaahGhsDetailsForUcp, Integer discountUcpPct) {
		return rivaahGhsDetailsForUcp == null
				|| rivaahGhsDetailsForUcp.getUcpDiscountPercent().compareTo(new BigDecimal(discountUcpPct)) < 0;
	}

	private boolean checkMaxMcPct(RivaahGhsDiscountDto rivaahGhsDetailsForMc, Integer discountMcPct) {
		return rivaahGhsDetailsForMc == null
				|| rivaahGhsDetailsForMc.getMakingChargeDiscountPercent().compareTo(new BigDecimal(discountMcPct)) < 0;
	}

	private boolean checkIfGhsPaymentIsRivaah(PaymentDetailsDaoExt paymentDetails) {
		return PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentDetails.getPaymentCode())
				&& !GhsSchemeTypeEnum.RIVAAH_SCHEME.name().equals(paymentDetails.getReference3());
	}

	private List<RivaahGhsDiscountDto> getValidRivaahGhsDetails(RivaahGhsDiscountDto rivaahGhsDetailsForMc,
			RivaahGhsDiscountDto rivaahGhsDetailsForUcp) {
		List<RivaahGhsDiscountDto> rivaahDetailsList = new ArrayList<>();
		if (rivaahGhsDetailsForMc != null
				&& rivaahGhsDetailsForMc.getAccountNo().equals(rivaahGhsDetailsForUcp.getAccountNo())) {
			rivaahGhsDetailsForMc.setIsUcpdiscountUsed(true);
			rivaahDetailsList.add(rivaahGhsDetailsForMc);
		} else {
			rivaahDetailsList.add(rivaahGhsDetailsForMc);
			rivaahDetailsList.add(rivaahGhsDetailsForUcp);
		}
		return rivaahDetailsList;
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {
		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
			// Update discount status to CONFIRMED
			discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
		}

		discountDetailsRepository.saveAll(discountDaoList);

	}

	@Override
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {

		List<DiscountItemDetailsDaoExt> itemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn, discountType);

		// clear from discountTxnDetails
		updateDiscountTxnDetailsForRivaahGhs(salesTxn, null, discountUtilService.getDiscountTxnDetails(salesTxn), true);
		salesTxnRepositoryExt.save(salesTxn);

		if (CollectionUtils.isEmpty(itemDiscountDetailsList)) {
			return;
		}
		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		Set<String> clubbedDiscountIds = new HashSet<>();
		List<DiscountItemDetailsDaoExt> itemDiscountDetailstoBeDeleted = new ArrayList<>();
		Set<String> updatedItemIds = new HashSet<>();
		itemDiscountDetailsList.forEach(itemDiscount -> {
			updatedItemIds.add(itemDiscount.getItemId());
			if (itemDiscount.getDiscountDetail().getClubbedDiscountId() != null) {
				clubbedDiscountIds.add(itemDiscount.getDiscountDetail().getClubbedDiscountId());
			} else {
				itemDiscountDetailstoBeDeleted.add(itemDiscount);
			}
		});

		if (!CollectionUtils.isEmpty(clubbedDiscountIds)) {
			List<DiscountItemDetailsDaoExt> itemDiscountDetailswithClubbingList = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnAndDiscountDetailClubbedDiscountIdInAndItemIdIn(salesTxn,
							clubbedDiscountIds, updatedItemIds);
			itemDiscountDetailstoBeDeleted.addAll(itemDiscountDetailswithClubbingList);
		}

		discountUtilService.deleteAllItemDiscountDetails(itemDiscountDetailstoBeDeleted);

		// Update discount values for the impacted items
		if (!CollectionUtils.isEmpty(updatedItemIds))
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// NA

	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA
	}

	public void updateDiscountTxnDetailsForRivaahGhs(SalesTxnDaoExt salesTxn,
			RivaahGhsDiscountDetailsDto rivaahGhsDetails, DiscountTransactionDetails discountTxnDetails,
			boolean isDelete) {

		if (isDelete) {
			discountTxnDetails.setRivaahGhsDiscountDetails(null);
		} else {
			RivaahGhsDiscountDetailsExtDto rivaahDetails = new RivaahGhsDiscountDetailsExtDto();
			rivaahDetails.setIsRivaahDiscountApplicable(false);
			rivaahDetails.setRivaahGhs(rivaahGhsDetails.getRivaahGhs());
			discountTxnDetails.setRivaahGhsDiscountDetails(rivaahDetails);
		}

		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
	}
}
