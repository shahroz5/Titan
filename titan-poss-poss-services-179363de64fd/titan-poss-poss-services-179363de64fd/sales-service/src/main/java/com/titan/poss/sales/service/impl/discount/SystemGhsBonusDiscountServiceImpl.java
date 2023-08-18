/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.GhsExcludeProductGroupDetailsDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
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
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import io.micrometer.core.instrument.util.StringUtils;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class for 'SYSTEM_DISCOUNT_GHS_BONUS' implementation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesSystemGhsBonusDiscountService")
public class SystemGhsBonusDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	public SystemGhsBonusDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name(), this);
	}

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

	@Transactional
	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		String locationCode = CommonUtil.getStoreCode();
		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();
		discountBillLevelCreateDto.getDiscountDetails().forEach(discountBillDetail -> {

			// if refPaymentId is present, then
			// doubt; utilization % to be checked?
			PaymentDetailsDaoExt paymentDetailsDao = checkIfRefPaymentIdExists(discountBillLevelCreateDto, locationCode,
					discountBillDetail);

			DiscountDetailsBaseDto discountDetailsBaseDto = engineService
					.getDiscountConfigDetails(discountBillDetail.getDiscountId());

			// Create Discount details
			DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(
					discountBillDetail, salesTxn, DiscountApplicableLevelEnum.BILL_LEVEL.name(),
					DiscountInitialStatusEnum.SYSTEM_DISCOUNT_GHS_BONUS.getDiscountInitialStatus(),
					discountBillDetail.getDiscountValue());
			
			//disable isDiscountPresent flag once discount is applied 
			paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
			
			// set ref payment
			discountDetailsDaoExt.setRefPayment(paymentDetailsDao);

			List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn,
					null);

			// Save discount config details & Link to the discount applied
			// add CFA data to config
			// filter items based on CFA restriction.
			GhsExcludeProductGroupDetailsDto ghsBasicDetails = getValidItems(discountBillDetail, salesItemList);
			discountDetailsBaseDto.setGhsExcludeProductGroupDetails(ghsBasicDetails);

			discountDetailsDaoExt
					.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));

			discountDetailsRepository.save(discountDetailsDaoExt);

			// Apportion the GHS bonus to the eligible item Id's
			discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
					salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()), null);

			discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));

		});

		return new DiscountResponseDto(discountDetails, List.of(discountDetails.get(0).getDiscountTxnId()));

	}

	private PaymentDetailsDaoExt checkIfRefPaymentIdExists(DiscountBillLevelCreateDto discountBillLevelCreateDto,
			String locationCode, DiscountBillLevelItemDetailsDto discountBillDetail) {

		if (StringUtils.isEmpty(discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId())) {
			return null;
		}

		// 1. check and set to discountDetails
		PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
				discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), locationCode);
		// 2. set discount value
		// reference3 is credit note id
		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(paymentDetailsDao.getReference3());
		// discount details
		GhsAccountDiscountDetailsDto cnGHSDiscountDetails = getCreditNoteDiscountDetails(creditNoteDao);
		discountBillDetail.setDiscountValue(cnGHSDiscountDetails.getDiscountValue());

		// 3. How to get CFA restriction?
		GhsExcludeProductGroupDetailsDto ghsBasicDetails = new GhsExcludeProductGroupDetailsDto();
		ghsBasicDetails.setAccountNo(paymentDetailsDao.getInstrumentNo() + "_" + paymentDetailsDao.getReference2());
		ghsBasicDetails.setMakingChargeDiscountPercent(new BigDecimal(cnGHSDiscountDetails.getDiscountMcPct()));
		ghsBasicDetails.setUcpDiscountPercent(new BigDecimal(cnGHSDiscountDetails.getDiscountUcpPct()));
		ghsBasicDetails.setBonus(cnGHSDiscountDetails.getDiscountValue());
		ghsBasicDetails.setSchemeCode(cnGHSDiscountDetails.getSchemeCode());
		ghsBasicDetails.setSchemeType(cnGHSDiscountDetails.getDiscountType());
		ghsBasicDetails.setPaymentCode(paymentDetailsDao.getPaymentCode());
		if (!CollectionUtil.isEmpty(cnGHSDiscountDetails.getProductGroupCodesRestricted())) {
			ghsBasicDetails.setGhsExcludeProductGroups(cnGHSDiscountDetails.getProductGroupCodesRestricted());
		}
		discountBillDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS", ghsBasicDetails));

		// check if system discount exists in the payment.
		CreditNotePaymentOtherDetailsDto otherD = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class).getData(),
				CreditNotePaymentOtherDetailsDto.class);
		if (!DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name().equals(otherD.getDiscountType())) {
			throw new ServiceException(SalesConstants.ERR_SALE_294, SalesConstants.INVALID_REQUEST,
					"GHS bonus is not present in the payment.",
					Map.of(SalesConstants.REMARKS, "GHS bonus is not present in the payment."));
		}

		return paymentDetailsDao;
	}

	private GhsExcludeProductGroupDetailsDto getValidItems(@Valid DiscountBillLevelItemDetailsDto discountBillDetail,
			List<SalesItemDetailsDto> salesItemList) {
		GhsExcludeProductGroupDetailsDto basinGhsDetails = MapperUtil.mapObjToClass(
				discountBillDetail.getDiscountValueDetails().getData(), GhsExcludeProductGroupDetailsDto.class);

		if (!CollectionUtil.isEmpty(basinGhsDetails.getGhsExcludeProductGroups())) {
			removeNonEligibleItems(salesItemList, basinGhsDetails.getGhsExcludeProductGroups());
		}

		if (CollectionUtils.isEmpty(salesItemList)) {
			throw new ServiceException(
					discountBillDetail.getDiscountCode() + " not eligible for apportion to any of the items",
					"ERR-DISC-007",
					"Discount Code: " + discountBillDetail.getDiscountCode()
							+ ", not eligible for apportion to any of the items.",
					Map.of("discountCode", discountBillDetail.getDiscountCode()));
		}

		return basinGhsDetails;
	}

	/**
	 * @param salesItemList
	 * @param cfaRestriction
	 */
	private void removeNonEligibleItems(List<SalesItemDetailsDto> salesItemList, List<String> cfaRestriction) {
		List<SalesItemDetailsDto> itemsToRemove = new ArrayList<>();

		// check if product group is restricted
		for (SalesItemDetailsDto salesItem : salesItemList) {
			if (cfaRestriction.contains(salesItem.getProductGroupCode())) {
				itemsToRemove.add(salesItem);
			}
		}

		// remove invalid items
		salesItemList.removeAll(itemsToRemove);
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		// to be confirmed by GHS payment only.
		if (discountTxnId == null) {
			throw new ServiceException(SalesConstants.ERR_SALE_294, SalesConstants.INVALID_REQUEST,
					"GHS bonus cannot be redeemed individually.",
					Map.of(SalesConstants.REMARKS, "GHS bonus cannot be redeemed individually."));
		}

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

		log.info("Discount apportioned item details - {}{}", discountDetailDao, apportionedItemDiscountDetails);

		// Apportion the GHS bonus to the eligible item Id's
		discountUtilService.reApportionBillLevelDiscountsToApplicableItems(discountDetailDao, salesTxn,
				apportionedItemDiscountDetails, isPriceUpdate);

	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		List<SalesItemDetailsDto> salesItemList = discountUtilService.getTransactionSpecificItemDetails(salesTxn, null);
		GhsExcludeProductGroupDetailsDto ghsExcludeProductGroupDetails = null;
		if (orderDiscountDetailDao.getDiscountConfig().getGhsExcludeProductGroupDetails() != null) {
			ghsExcludeProductGroupDetails = MapperUtil.mapObjToClass(
					orderDiscountDetailDao.getDiscountConfig().getGhsExcludeProductGroupDetails(),
					GhsExcludeProductGroupDetailsDto.class);
			// remove non eligible items
			if (!CollectionUtil.isEmpty(ghsExcludeProductGroupDetails.getGhsExcludeProductGroups())) {
			removeNonEligibleItems(salesItemList, ghsExcludeProductGroupDetails.getGhsExcludeProductGroups());
			}
		}

		// if no items are valid, then return
		if (CollectionUtil.isEmpty(salesItemList)) {
			return;
		}

		// Create discount
		DiscountDetailsDaoExt discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetailsForOrderToCM(
				orderDiscountDetailDao, salesTxn, DiscountSalesStatusEnum.CONFIRMED.name());

		// Map discount config details from Order to CM
		discountDetailsDaoExt.setDiscountConfig((DiscountConfigDetailsDaoExt) MapperUtil
				.getObjectMapping(orderDiscountDetailDao.getDiscountConfig(), new DiscountConfigDetailsDaoExt(), "id"));

		// Save the carry forwarded discount config details
		discountConfigDetailsRepository.save(discountDetailsDaoExt.getDiscountConfig());

		// Apportion the GHS bonus to the eligible item Id's
		discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
				salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()), null);// TODO:
																											// throw
																											// error if
																											// no
																											// items are
																											// allowed
																											// for
																											// clubbing?

		// TODO: how to check if discount is more than the total value for each item?

		discountDetailsRepository.save(discountDetailsDaoExt);

	}

	private GhsAccountDiscountDetailsDto getCreditNoteDiscountDetails(CreditNoteDaoExt creditNoteDao) {

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
		if (cnDiscountDetails.getGhsAccountDiscount() == null
				|| cnDiscountDetails.getGhsAccountDiscount().getDiscountValue() == null) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Credit note does not have GHS discount details to apply discount.");
		}

		return cnDiscountDetails.getGhsAccountDiscount();
	}

}
