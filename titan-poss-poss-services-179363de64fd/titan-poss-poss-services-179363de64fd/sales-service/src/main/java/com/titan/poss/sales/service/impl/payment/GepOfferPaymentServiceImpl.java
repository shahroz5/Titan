/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.payment;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.discount.dto.GepPurityItemsDto;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationRequest;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationResponse;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.dto.validators.GepOfferPaymentFieldsDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.GepOfferPaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Service class for 'GEP OFFER' payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesGepOfferPaymentServiceImpl")
public class GepOfferPaymentServiceImpl implements GepOfferPaymentService {

	public GepOfferPaymentServiceImpl(PaymentFactory paymentFactory) {
		paymentFactory.registerPaymentService(PaymentCodeEnum.GEP_OFFER.getPaymentcode(), this);
	}

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CommonPaymentService paymentUtil;

	@Override
	public SalesPaymentDto validateInputFields(PaymentCreateDto paymentCreateDto) {

		(new GepOfferPaymentFieldsDto()).validateFields(paymentCreateDto);

		// set status to 'OPEN'
		return SalesUtil.mapDtoWithStatus(paymentCreateDto, PaymentStatusEnum.OPEN.name());
	}

	@Override
	public SalesPaymentDto locationConfigValidation(String paymentCode, String paymentGroup, SalesTxnDaoExt salesTxnDao,
			SalesPaymentDto salesPaymentDto) {
		// no location check
		return salesPaymentDto;
	}

	@Override
	public Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentConfigValidations(String paymentCode,
			String paymentGroup, BigDecimal dueAmount, BigDecimal totalTxnAmount,
			PaymentDetailsDaoExt paymentDetailsDao) {

		String locationCode = CommonUtil.getStoreCode();
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		// get payment
		PaymentDetailsDaoExt refPaymentDetailsDao = paymentDetailsRepository
				.findByIdAndSalesTxnDaoLocationCode(paymentDetailsDao.getReference3(), locationCode);
		if (!PaymentStatusEnum.OPEN.name().equals(refPaymentDetailsDao.getStatus())
				|| !PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(refPaymentDetailsDao.getPaymentCode())) {
			// if payment status is not 'OPEN', then discount is not applicable and only
			// 'CREDIT NOTE' payment is allowed.
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payment not valid to apply discount.");
		}

		// reference3 of refPayment is credit note id
		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(refPaymentDetailsDao.getReference3());
		// if gepConfigDetails id is not present then return
		if (creditNoteDao.getGepConfigDetailsDao() == null) {
			return Map.of();
		}

		// apply offer as payment
		Map<String, PaymentItemMappingDaoExt> paymentItemMapList = validateAndApportionOfferAmount(paymentDetailsDao,
				businessDate, refPaymentDetailsDao, creditNoteDao);

		// if eligible items map is empty? then return empty map
		if (paymentItemMapList.isEmpty()) {
			return Map.of();
		}

		// if any other discount is added for the same payment, pick the best
		// one and delete the other
		Map<Boolean, List<DiscountDetailsDaoExt>> isCurrentDiscountSave = discountUtilService.getBestDiscount(
				paymentDetailsDao.getAmount(), paymentDetailsDao.getSalesTxnDao(), refPaymentDetailsDao);

		// if not best discount, then return empty map?
		if (isCurrentDiscountSave.containsKey(false)) {
			return Map.of();
		}

		// if best discount, only then saved

		// delete already added discounts, if exists
		if (!CollectionUtil.isEmpty(isCurrentDiscountSave.get(true))) {
			isCurrentDiscountSave.get(true).forEach(existingDiscount -> discountUtilService
					.deleteHeaderDiscountByDiscountDetails(paymentDetailsDao.getSalesTxnDao(), existingDiscount));
		}

		// pending: check if payment exceeds for any item

		// set instrumentType same as paymentCode
		paymentDetailsDao.setInstrumentType(paymentCode);// GEP OFFER

		return Map.of(paymentDetailsDao, new ArrayList<>(paymentItemMapList.values()));
	}

	private Map<String, PaymentItemMappingDaoExt> validateAndApportionOfferAmount(PaymentDetailsDaoExt paymentDetailsDao,
			Date businessDate, PaymentDetailsDaoExt refPaymentDetailsDao, CreditNoteDaoExt creditNoteDao) {
		// discount details
		CreditNoteDiscountDetailsDto cnDiscountDetails = getCreditNoteDiscountDetails(creditNoteDao);

		// get utilization %
		BigDecimal utilzPct = getUtilzPct(refPaymentDetailsDao, creditNoteDao);

		// get all items
		List<SalesItemDetailsDto> salesItemList = discountUtilService
				.getTransactionSpecificItemDetails(paymentDetailsDao.getSalesTxnDao(), null);

		// map of item id and item details
		Map<String, SalesItemDetailsDto> salesItemMap = salesItemList.stream()
				.collect(Collectors.toMap(SalesItemDetailsDto::getId, Function.identity()));

		List<GepPurityItemsDto> itemforGepPurityList = salesItemList.stream()
				.map(salesItem -> new GepPurityItemsDto(salesItem.getItemCode(), salesItem.getId(),
						salesItem.getLotNumber(), salesItem.getProductGroupCode(), null))
				.collect(Collectors.toList());

		// map of purity and total discount value w.r.t to it.
		Map<BigDecimal, BigDecimal> purityDiscountMap = getPurityAmountMap(cnDiscountDetails);

		GepPurityScemeValidationRequest gepPurityScemeValidationRequest = new GepPurityScemeValidationRequest();
		gepPurityScemeValidationRequest.setBusinessDate(CalendarUtils.addOffSetTimeZone(businessDate));
		gepPurityScemeValidationRequest.setGepConfigDetailsId(creditNoteDao.getGepConfigDetailsDao().getId());
		gepPurityScemeValidationRequest.setTxnType(paymentDetailsDao.getSalesTxnDao().getTxnType());
		gepPurityScemeValidationRequest.setItemDetails(itemforGepPurityList);

		Map<String, PaymentItemMappingDaoExt> paymentItemMapList = new HashMap<>();
		BigDecimal totalPayment = BigDecimal.ZERO;// total amount applied

		for (Map.Entry<BigDecimal, BigDecimal> purityEntry : purityDiscountMap.entrySet()) {
			// call GEP config based on each purity
			gepPurityScemeValidationRequest.setGepPurity(purityEntry.getKey());
			GepPurityScemeValidationResponse gepPurityScemeValidationResponse = engineService
					.validateGepPurityScheme(Boolean.FALSE, gepPurityScemeValidationRequest);

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
					utilzPct, businessDate, creditNoteDao, false, paymentDetailsDao.getSalesTxnDao());
			if (!isConfigValid) {
				return Map.of();// if config not valid, then return empty map.
			}

			// discount applied based on utilize pct.
			BigDecimal amountApplicable = purityEntry.getValue().multiply(utilzPct).divide(BigDecimal.valueOf(100),
					DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			List<GepPurityItemsDto> eligibleSalesItemList = gepPurityScemeValidationResponse.getEligibleItemDetails()
					.get(0).getGepConfigDetails().get(0).getItemDetails();

			totalPayment = apportionAmountToItems(paymentDetailsDao, salesItemMap, paymentItemMapList, amountApplicable,
					eligibleSalesItemList, totalPayment);
		}

		// set total discount
		paymentDetailsDao.setAmount(totalPayment);

		return paymentItemMapList;
	}

	@Override
	public PaymentDetailsDaoExt triggerPayment(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {
		// no trigger payment
		return paymentDetailsDao;
	}

	@Override
	public SalesPaymentDto validatePayment(PaymentDetailsDaoExt paymentDetailsDao, String otp) {
		// no validate payment
		return null;
	}

	@Override
	public SalesPaymentDto validateAndUpdatePaymentDetails(String paymentCode, String status,
			PaymentUpdateDto paymentUpdateDto, PaymentDetailsDaoExt paymentDetailsDao) {
		// no validate and update payment
		return null;
	}

	@Override
	public void deletePayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao = paymentUtil.deletePaymentOpenDeleteElseReverse(paymentDetailsDao, false);
		paymentDetailsRepository.save(paymentDetailsDao);

	}

	@Override
	public PaymentDetailsDaoExt confirmPayment(PaymentDetailsDaoExt paymentDetailsDao, String status) {

		// if payment status is not OPEN do not allow
		// redemption.
		if (!SalesUtil.paymentStatusCheckForRedemption(paymentDetailsDao.getStatus())) {
			return paymentDetailsDao;
		}
		paymentDetailsDao.setStatus(PaymentStatusEnum.COMPLETED.name());
		// save will be done at PaymentFacadeService

		return paymentDetailsDao;
	}

	@Override
	public Map<String, Integer> cancelPayment(List<PaymentDetailsDaoExt> paymentDetails, CancelDaoExt cancel,
			SalesTxnDaoExt salesTxn, CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		// TODO :Which discount amount to be given back? original discount? or the one
		// which was obtained after applying % based on GEP item purity and product
		// group code?
		return Collections.emptyMap();
	}

	@Override
	public InstrumentCashAmountDto getEligibleAmount(Integer customerId, String paymentCode, SalesTxnDaoExt salesTxnDao,
			BigDecimal dueAmount) {
		return new InstrumentCashAmountDto(dueAmount, null, null, null);
	}

	private CreditNoteDiscountDetailsDto getCreditNoteDiscountDetails(CreditNoteDaoExt creditNoteDao) {

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

	private BigDecimal getUtilzPct(PaymentDetailsDaoExt paymentDetailsDao, CreditNoteDaoExt creditNoteDao) {
		// % of CN amount utilized as payment
		return paymentDetailsDao.getAmount()
				.divide(creditNoteDao.getAmount(), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
				.multiply(BigDecimal.valueOf(100));
	}

	private Map<BigDecimal, BigDecimal> getPurityAmountMap(CreditNoteDiscountDetailsDto cnDiscountDetails) {
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

	private BigDecimal apportionAmountToItems(PaymentDetailsDaoExt paymentDetailsDao,
			Map<String, SalesItemDetailsDto> salesItemMap, Map<String, PaymentItemMappingDaoExt> paymentItemMapList,
			BigDecimal amountApplicable, List<GepPurityItemsDto> eligibleSalesItemList, BigDecimal totalAmount) {

		// Sum up the total items value to calculate the each eligible itemValue
		// contribution as percentage
		BigDecimal eligibleItemsTotalValue = eligibleSalesItemList.stream()
				.map(eligibleItem -> salesItemMap.get(eligibleItem.getItemId()).getTotalValue())
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		// split amountApplicable between all items
		for (GepPurityItemsDto eligibleItem : eligibleSalesItemList) {

			// if applicable pct is 'null' or 'ZERO', then skip to next item
			if (eligibleItem.getApplicablePct() == null
					|| eligibleItem.getApplicablePct().compareTo(BigDecimal.ZERO) <= 0) {
				continue;
			}

			// Calculate the each eligible item value contribution out of all eligible items
			// total value as percentage
			BigDecimal itemValuePercentage = salesItemMap.get(eligibleItem.getItemId()).getTotalValue()
					.divide(eligibleItemsTotalValue, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));

			// Apply purity discount value on each items percentage, to get exact
			// apportioned value
			BigDecimal discountApportionedValue = amountApplicable.multiply(itemValuePercentage)
					.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// apply applicable pct from GEP Purity config on each item
			discountApportionedValue = discountApportionedValue
					.multiply(eligibleItem.getApplicablePct().divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			if (paymentItemMapList.containsKey(eligibleItem.getItemId())) {
				PaymentItemMappingDaoExt apportionedAmountItemDetails = paymentItemMapList.get(eligibleItem.getItemId());
				apportionedAmountItemDetails
						.setAmount(apportionedAmountItemDetails.getAmount().add(discountApportionedValue));
				paymentItemMapList.put(eligibleItem.getItemId(), apportionedAmountItemDetails);
			} else {
				// create new entry in item payment details with newly apportioned record.
				PaymentItemMappingDaoExt newApportionedAmountItemDetails = new PaymentItemMappingDaoExt();
				newApportionedAmountItemDetails.setPaymentDetailsDao(paymentDetailsDao);
				newApportionedAmountItemDetails.setItemId(eligibleItem.getItemId());
				newApportionedAmountItemDetails
						.setProductGroupCode(salesItemMap.get(eligibleItem.getItemId()).getProductGroupCode());
				newApportionedAmountItemDetails.setAmount(discountApportionedValue);

				// add item payment details to map
				paymentItemMapList.put(eligibleItem.getItemId(), newApportionedAmountItemDetails);
			}

			// total amount applied
			totalAmount = totalAmount.add(discountApportionedValue);

		}

		return totalAmount;
	}

	@Override
	public void deleteTempPayment(PaymentDetailsDaoExt paymentDetailsDao) {

		paymentDetailsDao.setStatus(PaymentStatusEnum.DELETED.name());
		paymentDetailsRepository.save(paymentDetailsDao);

	}
}
