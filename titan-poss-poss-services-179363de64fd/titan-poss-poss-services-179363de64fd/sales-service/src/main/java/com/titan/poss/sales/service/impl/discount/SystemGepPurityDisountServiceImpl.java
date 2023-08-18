/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.GepPurityItemsDto;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationRequest;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationResponse;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.GepPurityDiscountDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for 'SYSTEM_DISCOUNT_GEP_PURITY' implementation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesSystemGepPurityDisountServiceImpl")
public class SystemGepPurityDisountServiceImpl implements DiscountService {

	public SystemGepPurityDisountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name(), this);
	}

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA
	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {
		// NA
		return null;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {

		discountUtilService.deleteHeaderDiscountByDiscountDetails(salesTxn, discountDetailsDaoExt);

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// NA

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA

	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		log.info("Apply discount: {}, txnId: {}, discountId: {}, refPaymentId: {}", discountType, salesTxn.getId(),
				discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountId(),
				discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId());
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		String locationCode = CommonUtil.getStoreCode();
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		DiscountBillLevelItemDetailsDto discountBillDetailDto = discountBillLevelCreateDto.getDiscountDetails().get(0);

		// get payment
		PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
				discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), locationCode);
		// reference3 is credit note id
		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(paymentDetailsDao.getReference3());
		// if gepConfigDetails id is not present then return
		if (creditNoteDao.getGepConfigDetailsDao() == null) {
			return new DiscountResponseDto(List.of());
		}

		// discount details
		CreditNoteDiscountDetailsDto cnDiscountDetails = getCreditNoteDiscountDetails(creditNoteDao);

		// get utilization %
		BigDecimal utilzPct = getUtilzPct(paymentDetailsDao, creditNoteDao);

		DiscountDetailsBaseDto discountDetailsBaseDto = engineService
				.getDiscountConfigDetails(discountBillDetailDto.getDiscountId());

		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(
				discountBillDetailDto, salesTxn, DiscountApplicableLevelEnum.BILL_LEVEL.name(),
				DiscountInitialStatusEnum.SYSTEM_DISCOUNT_GEP_PURITY.getDiscountInitialStatus(),
				discountBillDetailDto.getDiscountValue());
		
		//disable isDiscountPresent flag once discount is applied 
		paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
		// set ref payment
		discountDetailsDaoExt.setRefPayment(paymentDetailsDao);
		// set gep config id
		discountDetailsDaoExt.setGepConfigDetailsId(creditNoteDao.getGepConfigDetailsDao().getId());
		// set discount value details for later usage
		discountDetailsDaoExt.setDiscountValueDetails(MapperUtil.getStringFromJson(
				new JsonData("DISCOUNT_VALUE_DETAILS", Map.of("discountValueDetails", Map.of("utilizationPct", utilzPct,
						"gepPurityDiscount", cnDiscountDetails.getGepPurityDiscount())))));

		// calculate GEP purity discount
		Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap = calculateGepPurityDiscount(
				salesTxn, businessDate, cnDiscountDetails, utilzPct, discountDetailsDaoExt, creditNoteDao,
				Boolean.FALSE);
		if (itemIdAndCreatedDiscountItemDetailsMap.isEmpty()) {// if discount is not applied, then pass empty list
			return new DiscountResponseDto(List.of());
		}

		// if any other discount is added for the same payment, pick the best
		// one and delete the other
		Map<Boolean, List<DiscountDetailsDaoExt>> isCurrentDiscountSave = discountUtilService.getBestDiscount(
				discountDetailsDaoExt.getDiscountValue(), discountDetailsDaoExt.getSalesTxn(), paymentDetailsDao);

		log.info("Is current discount the best discount? - \t{}\t", isCurrentDiscountSave.keySet());
		if (isCurrentDiscountSave.containsKey(false)) {
			return new DiscountResponseDto(List.of());
		}

		// if best discount, only then saved
		log.info("Total GEP purity discount applied - {}", discountDetailsDaoExt.getDiscountValue());

		// delete already added discounts, if exists
		if (!CollectionUtil.isEmpty(isCurrentDiscountSave.get(true))) {
			isCurrentDiscountSave.get(true).forEach(existingDiscount -> discountUtilService
					.deleteHeaderDiscountByDiscountDetails(salesTxn, existingDiscount));
		}

		// save details
		// Save discount config details & Link to the discount applied
		discountDetailsDaoExt.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));
		discountDetailsRepository.save(discountDetailsDaoExt);
		discountItemDetailsRepository.saveAll(itemIdAndCreatedDiscountItemDetailsMap.values());

		// Update the total discount value of each item(including apportioned value)
		discountUtilService.updateTransactionSpecificItemDetails(salesTxn,
				itemIdAndCreatedDiscountItemDetailsMap.keySet(), false);

		// check if discountValue >= totalValue for each item
		checkIfDiscountExceedsTotalValue(discountUtilService.getTransactionSpecificItemDetails(salesTxn, null),
				paymentDetailsDao, locationCode);

		// if due amount goes negative, then what should be done? reverse all discount
		// details added? - NO (confirmed by BA)

		return new DiscountResponseDto(
				List.of(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt)));
	}

	public BigDecimal getUtilzPct(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDao) {
		// % of CN amount utilized as payment
		return paymentDetailsDao.getAmount()
				.divide(creditNoteDao.getAmount(), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
				.multiply(BigDecimal.valueOf(100));
	}

	public Map<String, DiscountItemDetailsDaoExt> calculateGepPurityDiscount(SalesTxnDaoExt salesTxn, Date businessDate,
			CreditNoteDiscountDetailsDto cnDiscountDetails, BigDecimal utilzPct, DiscountDetailsDaoExt discountDetails,
			CreditNoteDaoExt creditNoteDao, Boolean isRivaah) {

		// get items after filtering non-eligible items
		List<SalesItemDetailsDto> salesItemList = discountUtilService
				.filterAndGetEligibleItemsForCurrentDiscount(discountDetails, salesTxn);

		if (CollectionUtil.isEmpty(salesItemList)) {
			return Map.of();
		}
		// map of item id and item details
		Map<String, SalesItemDetailsDto> salesItemMap = salesItemList.stream()
				.collect(Collectors.toMap(SalesItemDetailsDto::getId, Function.identity()));

		List<GepPurityItemsDto> itemforGepPurityList = salesItemList.stream()
				.map(salesItem -> new GepPurityItemsDto(salesItem.getItemCode(), salesItem.getId(),
						salesItem.getLotNumber(), salesItem.getProductGroupCode(), null))
				.collect(Collectors.toList());

		// map of purity and total discount value wrt to it.
		Map<BigDecimal, BigDecimal> purityDiscountMap = getPurityDiscountMap(cnDiscountDetails);

		GepPurityScemeValidationRequest gepPurityScemeValidationRequest = new GepPurityScemeValidationRequest();
		gepPurityScemeValidationRequest.setBusinessDate(CalendarUtils.addOffSetTimeZone(businessDate));
		gepPurityScemeValidationRequest
				.setGepConfigDetailsId(creditNoteDao == null ? discountDetails.getGepConfigDetailsId()
						: creditNoteDao.getGepConfigDetailsDao().getId());
		gepPurityScemeValidationRequest.setTxnType(salesTxn.getTxnType());
		gepPurityScemeValidationRequest.setItemDetails(itemforGepPurityList);

		Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap = new HashMap<>();// discount_item_details
		BigDecimal totalDiscount = BigDecimal.ZERO;// total discount applied

		for (Map.Entry<BigDecimal, BigDecimal> purityEntry : purityDiscountMap.entrySet()) {
			// call GEP config based on each purity
			gepPurityScemeValidationRequest.setGepPurity(purityEntry.getKey());
			GepPurityScemeValidationResponse gepPurityScemeValidationResponse = engineService
					.validateGepPurityScheme(isRivaah, gepPurityScemeValidationRequest);

			if (CollectionUtil.isEmpty(gepPurityScemeValidationResponse.getEligibleItemDetails())
					|| CollectionUtil.isEmpty(
							gepPurityScemeValidationResponse.getEligibleItemDetails().get(0).getGepConfigDetails())
					|| CollectionUtil.isEmpty(gepPurityScemeValidationResponse.getEligibleItemDetails().get(0)
							.getGepConfigDetails().get(0).getItemDetails())) {
				// if no mapping found, then continue with next purity
				continue;
			}

			boolean isConfigValid = discountUtilService.validateGepPutiryConfig(
					gepPurityScemeValidationResponse.getEligibleItemDetails().get(0).getGepConfigDetails().get(0),
					utilzPct, businessDate, creditNoteDao, true, salesTxn);
			if (!isConfigValid) {
				return Map.of();// if config not valid, then return empty map.
			}

			// discount applied based on utilz pct.
			BigDecimal discountAmountApplicable = purityEntry.getValue().multiply(utilzPct)
					.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			List<GepPurityItemsDto> eligibleSalesItemList = gepPurityScemeValidationResponse.getEligibleItemDetails()
					.get(0).getGepConfigDetails().get(0).getItemDetails();

			totalDiscount = apportionDiscountToItems(discountDetails, salesItemMap,
					itemIdAndCreatedDiscountItemDetailsMap, discountAmountApplicable, eligibleSalesItemList,
					totalDiscount);
		}

		// set total discount
		discountDetails.setDiscountValue(totalDiscount);

		// NOTE: do not save anything here as this function is being used in
		// re-apportion also.
		return itemIdAndCreatedDiscountItemDetailsMap;
	}

	private BigDecimal apportionDiscountToItems(DiscountDetailsDaoExt discountDetails,
			Map<String, SalesItemDetailsDto> salesItemMap,
			Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap,
			BigDecimal discountAmountApplicable, List<GepPurityItemsDto> eligibleSalesItemList,
			BigDecimal totalDiscount) {

		// Sum up the total items value to calculate the each eligible itemValue
		// contribution as percentage
		BigDecimal eligibleItemsTotalValue = eligibleSalesItemList.stream()
				.map(eligibleItem -> salesItemMap.get(eligibleItem.getItemId()).getTotalValue())
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		// split discountAmountApplicable between all items
		for (GepPurityItemsDto eligibleItem : eligibleSalesItemList) {

			// if applicable pct is 'null' or 'ZERO', then skip to next item
			if (eligibleItem.getApplicablePct() == null
					|| eligibleItem.getApplicablePct().compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			// Calculate the each eligible item value contribution out of all eligible items
			// total value as percentage
			BigDecimal itemValuePercentage = salesItemMap.get(eligibleItem.getItemId()).getTotalValue()
					.divide(eligibleItemsTotalValue, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// Apply purity discount value on each items percentage, to get exact
			// apportioned value
			BigDecimal discountApportionedValue = discountAmountApplicable.multiply(itemValuePercentage)
					.divide(BigDecimal.valueOf(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// apply applicable pct from GEP Purity config on each item
			discountApportionedValue = discountApportionedValue
					.multiply(eligibleItem.getApplicablePct().divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			if (itemIdAndCreatedDiscountItemDetailsMap.containsKey(eligibleItem.getItemId())) {
				DiscountItemDetailsDaoExt apportionedDiscountItemDetails = itemIdAndCreatedDiscountItemDetailsMap
						.get(eligibleItem.getItemId());
				apportionedDiscountItemDetails.setDiscountValue(
						apportionedDiscountItemDetails.getDiscountValue().add(discountApportionedValue));
				itemIdAndCreatedDiscountItemDetailsMap.put(eligibleItem.getItemId(), apportionedDiscountItemDetails);
			} else {
				// create new entry in item discount details with newly apportioned record.
				DiscountItemDetailsDaoExt newApportionedDiscountItemDetails = new DiscountItemDetailsDaoExt();
				newApportionedDiscountItemDetails.setItemId(eligibleItem.getItemId());
				newApportionedDiscountItemDetails.setDiscountDetail(discountDetails);
				newApportionedDiscountItemDetails.setDiscountValue(discountApportionedValue);
				newApportionedDiscountItemDetails
						.setPreDiscountValue(salesItemMap.get(eligibleItem.getItemId()).getTotalValue());
				// add item discount details to map
				itemIdAndCreatedDiscountItemDetailsMap.put(eligibleItem.getItemId(), newApportionedDiscountItemDetails);
			}

			// total discount applied
			totalDiscount = totalDiscount.add(discountApportionedValue);

		}

		return totalDiscount;
	}

	private Map<BigDecimal, BigDecimal> getPurityDiscountMap(CreditNoteDiscountDetailsDto cnDiscountDetails) {
		Map<BigDecimal, BigDecimal> purityDiscountMap = new HashMap<>();
		cnDiscountDetails.getGepPurityDiscount().forEach(gepDeduction -> {
			if (purityDiscountMap.containsKey(gepDeduction.getGepItemPurity())) {
				BigDecimal totalDiscount = purityDiscountMap.get(gepDeduction.getGepItemPurity())
						.add(gepDeduction.getDiscountValue());
				purityDiscountMap.put(gepDeduction.getGepItemPurity(), totalDiscount);
			} else {
				purityDiscountMap.put(gepDeduction.getGepItemPurity(), gepDeduction.getDiscountValue());
			}
		});

		return purityDiscountMap;
	}

	public CreditNoteDiscountDetailsDto getCreditNoteDiscountDetails(CreditNoteDaoExt creditNoteDao) {

		if (StringUtil.isBlankJsonStr(creditNoteDao.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have valid details to apply discount.");
		}
		JsonData jsonData = MapperUtil.mapObjToClass(creditNoteDao.getDiscountDetails(), JsonData.class);
		if (StringUtil.isBlankJsonData(jsonData) || jsonData.getData() == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have valid details to apply discount.");
		}

		CreditNoteDiscountDetailsDto cnDiscountDetails = MapperUtil.mapObjToClass(jsonData.getData(),
				CreditNoteDiscountDetailsDto.class);
		if (CollectionUtil.isEmpty(cnDiscountDetails.getGepPurityDiscount())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have GEP purity details to apply discount.");
		}
		return cnDiscountDetails;
	}

	private void checkIfDiscountExceedsTotalValue(List<SalesItemDetailsDto> salesItemList,
			PaymentDetailsDaoExt paymentDetails, String locationCode) {

		for (SalesItemDetailsDto salesItem : salesItemList) {
			if (salesItem.getTotalDiscount().compareTo(salesItem.getTotalValue()) >= 0) {
				// if discount goes in negative, then do not apply discount at all
				// throw error, but payment also should be deleted.
				discountUtilService.deletePaymentIndividually(paymentDetails, locationCode);
				throw new ServiceException(SalesConstants.DISCOUNT_EXCEEDS_ITEM_VALUE_FOR_SOME_ITEMS,
						SalesConstants.ERR_DISC_032,
						"Discount exceeds item value for item code - " + salesItem.getItemCode()
								+ ", total item value - " + salesItem.getTotalValue() + ", total discount "
								+ salesItem.getTotalDiscount());
			}
		}

	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				// Check at least one item should have apportioned this GHS bonus discount
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
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		// NA

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {

		List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetailDao.getId());

		Map<String, DiscountItemDetailsDaoExt> apportionedItemDiscountMap = apportionedItemDiscountDetails.stream()
				.collect(Collectors.toMap(DiscountItemDetailsDaoExt::getItemId, Function.identity()));

		if (CollectionUtils.isEmpty(apportionedItemDiscountMap)) {
			return;
		}

		// reference3 is credit note id
		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt
				.getOne(discountDetailDao.getRefPayment().getReference3());
		// discount details
		CreditNoteDiscountDetailsDto cnDiscountDetails = getCreditNoteDiscountDetails(creditNoteDao);

		// get utilization %
		BigDecimal utilzPct = getUtilzPct(discountDetailDao.getRefPayment(), creditNoteDao);

		// calculate GEP purity discount
		Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap = calculateGepPurityDiscount(
				salesTxn, businessDayService.getBusinessDay().getBusinessDate(), cnDiscountDetails, utilzPct,
				discountDetailDao, creditNoteDao, Boolean.FALSE);
		// pending: what to do if above map is empty?

		// get item discount details to save
		itemIdAndCreatedDiscountItemDetailsMap.forEach((itemId, itemDiscount) -> {
			if (apportionedItemDiscountMap.containsKey(itemId)) {
				DiscountItemDetailsDaoExt discountItemDetails = apportionedItemDiscountMap.get(itemId);
				discountItemDetails.setDiscountValue(itemDiscount.getDiscountValue());
				itemIdAndCreatedDiscountItemDetailsMap.put(itemId, discountItemDetails);
			}
		});

		// if any item discount was present initially, but not now then that should be
		// deleted
		apportionedItemDiscountMap.entrySet().removeAll(itemIdAndCreatedDiscountItemDetailsMap.entrySet());
		if (!CollectionUtils.isEmpty(apportionedItemDiscountMap)) {
			discountItemDetailsRepository.deleteAll(apportionedItemDiscountMap.values());
		}

		log.info("Total GEP purity discount applied - {}", discountDetailDao.getDiscountValue());
		// save discount details
		discountDetailsRepository.save(discountDetailDao);
		if (!CollectionUtils.isEmpty(itemIdAndCreatedDiscountItemDetailsMap)) {
			discountItemDetailsRepository.saveAll(itemIdAndCreatedDiscountItemDetailsMap.values());
		}

		// item update with tax
		// Update the total discount value of each item(including apportioned value)
		discountUtilService.updateTransactionSpecificItemDetails(salesTxn,
				itemIdAndCreatedDiscountItemDetailsMap.keySet(), isPriceUpdate);

	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// how to know how much % for CN was utilized?
		// how to save purity details? as we will only have final discount value?
		// need CN type also, to know if GEP or GRN CN was used.(for config check)

		JsonData discountValueDetailsJson = MapperUtil.mapObjToClass(orderDiscountDetailDao.getDiscountValueDetails(),
				JsonData.class);
		if (StringUtil.isBlankJsonData(discountValueDetailsJson)) {
			return;
		}

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn, null);
		if (CollectionUtil.isEmpty(salesItemList)) {
			return;
		}

		@SuppressWarnings("unchecked")
		Map<Object, Object> discountValueDetails = (Map<Object, Object>) MapperUtil
				.mapObjToClass(discountValueDetailsJson.getData(), Map.class).get("discountValueDetails");
		BigDecimal utilizationPct = MapperUtil.mapObjToClass(discountValueDetails.get("utilizationPct"),
				BigDecimal.class);
		CreditNoteDiscountDetailsDto cnDiscountDetails = new CreditNoteDiscountDetailsDto();
		cnDiscountDetails.setGepPurityDiscount(new ArrayList<>());
		@SuppressWarnings("unchecked")
		List<Object> objList = MapperUtil.mapObjToClass(discountValueDetails.get("gepPurityDiscount"), List.class);
		objList.forEach(obj -> cnDiscountDetails.getGepPurityDiscount()
				.add(MapperUtil.mapObjToClass(obj, GepPurityDiscountDto.class)));

		// Create discount
		DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetailsForOrderToCM(
				orderDiscountDetailDao, salesTxn, DiscountSalesStatusEnum.CONFIRMED.name());

		// Map discount config details from Order to CM
		discountDetailsDaoExt.setDiscountConfig((DiscountConfigDetailsDaoExt) MapperUtil
				.getObjectMapping(orderDiscountDetailDao.getDiscountConfig(), new DiscountConfigDetailsDaoExt(), "id"));

		// calculate GEP purity discount
		Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap = calculateGepPurityDiscount(
				salesTxn, businessDayService.getBusinessDay().getBusinessDate(), cnDiscountDetails, utilizationPct,
				discountDetailsDaoExt, null, Boolean.FALSE);

		if (itemIdAndCreatedDiscountItemDetailsMap.isEmpty()) {// if discount is not applied, then pass empty list
			return;
		}

		// Save the carry forwarded discount details
		discountConfigDetailsRepository.save(discountDetailsDaoExt.getDiscountConfig());
		discountDetailsRepository.save(discountDetailsDaoExt);
		discountItemDetailsRepository.saveAll(itemIdAndCreatedDiscountItemDetailsMap.values());
	}

}
