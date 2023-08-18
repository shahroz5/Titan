/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.FieldDetailDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.PaymentConfigDetails;
import com.titan.poss.core.dto.PaymentDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.constants.TxnTypeRevenueEnum;
import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentItemMappingDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashPaymentDetailsDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.PaymentCodeAndCount;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.PaymentUpdateDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.request.CreditNoteRedeemDto;
import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.response.AmountDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.dto.response.LinkedPaymentResponseDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.AdvanceRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentItemMappingRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.PaymentService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Primary
@Service("salesPaymentFacadeService")
public class PaymentFacadeServiceImpl implements PaymentFacadeService {

	@Autowired
	private PaymentFactory paymentFactory;

	@Autowired
	private EngineService engineService;

	@Autowired
	private AdvanceRepositoryExt advanceRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepositoryExt;

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private PaymentItemMappingRepositoryExt paymentItemMappingRepository;

	@Autowired
	private PaymentFacadeServiceImpl paymentFacadeService;

	@Autowired
	private CreditNoteService creditNoteService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepository;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepositoryExt;
	
	private static final String ERR_SALE_043 = "ERR-SALE-043";
	private static final String AMOUNT_CANNOT_BE_UPDATED_FOR_THIS_PAYMENT_CODE = "Amount cannot be updated for this payment code.";

	private static final String ERR_CORE_019 = "ERR-CORE-019";
	private static final String ERROR_WHILE_CALLING_ENGINE_SERVICE = "Error while calling engine service";
	
	private void checkSalesTranscationStatusForPayment(String status, String txnType) {
		businessDayService.getBusinessDay().getBusinessDate(); // to show EOD/BOD in progress

		if (BooleanUtils.isFalse(SalesUtil.checkTranscationStatusForPayment(status, txnType))) {
			throw new ServiceException(SalesConstants.TRANSACTION_IS_CLOSED_SO_STATUS,
					SalesConstants.ERR_SALE_452,Map.of("status",status));
		}
	}

	/**
	 * This method will map payment details from Dao to Dto.
	 * 
	 * @param paymentDetailsDao
	 * @param salesPaymentDto
	 * @return SalesPaymentDto
	 */
	private SalesPaymentDto mapPaymentDetailsDaoToDto(PaymentDetailsDaoExt paymentDetailsDao,
			SalesPaymentDto salesPaymentDto) {

		if (salesPaymentDto == null) {
			salesPaymentDto = new SalesPaymentDto();
		}

		salesPaymentDto = (SalesPaymentDto) MapperUtil.getObjectMapping(paymentDetailsDao, salesPaymentDto);

		if (!StringUtil.isBlankJsonStr(paymentDetailsDao.getOtherDetails())) {
			JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
			salesPaymentDto.setOtherDetails(jsonData);

			if (!StringUtil.isBlankJsonData(jsonData)) {
				// get refundAmount if exists in other details and set to main DTO
				// NOTE: maintain same field name in all otherDetails DTOs related to payment
				// which will have refund amount (as part of CN generation).
				BigDecimal refundAmount = JsonUtils.getValueFromJson(jsonData.getData(), "refundAmount",
						BigDecimal.class);
				salesPaymentDto.setRefundAmount(refundAmount);
			}

		}

		if (!StringUtils.isEmpty(paymentDetailsDao.getCreditNoteDao())) {
			salesPaymentDto.setCreditNoteId(paymentDetailsDao.getCreditNoteDao().getId());
		}
		salesPaymentDto.setPaymentMode(returnPaymentMode(paymentDetailsDao));
		return salesPaymentDto;
	}

	private String returnPaymentMode(PaymentDetailsDaoExt paymentDetailsDao) {
		String paymentMode;
		PaymentCodeEnum paymentCode;
		if (PaymentGroupEnum.REGULAR.name().equals(paymentDetailsDao.getPaymentGroup())) {
			paymentCode = PaymentCodeEnum.valueOfPaymentCode(paymentDetailsDao.getPaymentCode().toUpperCase());
		} else {
			paymentCode = PaymentCodeEnum.valueOfPaymentCode(paymentDetailsDao.getPaymentGroup().toUpperCase());
		}

		String instrumentType = paymentDetailsDao.getInstrumentType();
		switch(paymentCode) {
		case CREDIT_NOTE:
			paymentMode = "CN - "+(null!= instrumentType && instrumentType.equalsIgnoreCase(TxnTypeRevenueEnum.ADV.name()) ? "Advance" : instrumentType);
			break;
		default:
			paymentMode = instrumentType;
			break;
		}			
		return paymentMode;
	}

	/**
	 * This method will validate if payment code is eligible for location or not.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param transactionType
	 * @param paymentCreateDto
	 * @param tcsPayment
	 */
	private void isPaymentCodeValid(String paymentCode, String paymentGroup, String transactionType, String subTxnType,
			PaymentCreateDto paymentCreateDto, Boolean isTcsPayment) {

		// different for GRF
		String txnTypeToConsider = transactionType;
		if (TransactionTypeEnum.ADV.name().equals(transactionType)
				&& SubTxnTypeEnum.FROZEN_RATES.name().equals(subTxnType)) {
			txnTypeToConsider = TransactionTypeEnum.GRF.name();
		}

		// if paymentCode is GHS ACCOUNT, then check from location master ghs details
		// (for CM, AB and CO only), instead of checking payment config.
		// NAP-2319 & NAP-4407
		if (PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentCode)) {
			checkIfGHSRedemtionAllowedForLocation(paymentCode, txnTypeToConsider, CommonUtil.getStoreCode());
			return;
		}

		ConfigDetailsLocationMappingDto configDetailsLocationMappingDto = engineService
				.getValidPaymentCodes(txnTypeToConsider, ConfigTypeEnum.PAYMENT_CONFIG.name());

		if (configDetailsLocationMappingDto == null) {

			throw new ServiceException(ERROR_WHILE_CALLING_ENGINE_SERVICE, ERR_CORE_019,
					ERROR_WHILE_CALLING_ENGINE_SERVICE);
		}

		boolean paymentGroupAndCodeFound = false;
		// get field details of respective payment code
		List<FieldDetailDto> fieldDetailDtoList = new ArrayList<>();

		for (PaymentDto paymentDto : configDetailsLocationMappingDto.getPaymentCodeDetails()) {
			if (paymentGroup.equalsIgnoreCase(paymentDto.getPaymentGroup())
					&& paymentCode.equalsIgnoreCase(paymentDto.getPaymentCode())) {

				paymentGroupAndCodeFound = checkPaymentCode(isTcsPayment, paymentGroupAndCodeFound, paymentDto);
				fieldDetailDtoList = CollectionUtils.isEmpty(paymentDto.getFields()) ? List.of()
						: paymentDto.getFields();
				break;
			}
		}

		if (!paymentGroupAndCodeFound) {
			if (BooleanUtils.isTrue(isTcsPayment)) {
				throw new ServiceException(
						SalesConstants.DYNAMIC_PAYMENT_CODE_CANNOT_BE_USED_FOR_TCS_PAYMENT_AS_IT_IS_NOT_CONFIGURED,
						SalesConstants.ERR_SALE_382, "Invalid payment code  - " + paymentCode + " for TCS payment.",
						Map.of(SalesConstants.PAYMENT_CODE, paymentCode));
			}
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Invalid payment code - " + paymentCode + " for " + txnTypeToConsider);
		}

		// reference mandatory check.
		if (!CollectionUtils.isEmpty(fieldDetailDtoList) && !StringUtils.isEmpty(paymentCreateDto)) {
			referenceMandatoryCheck(paymentCreateDto, fieldDetailDtoList);
		}

	}

	private boolean checkPaymentCode(Boolean isTcsPayment, boolean paymentGroupAndCodeFound, PaymentDto paymentDto) {
		if (BooleanUtils.isTrue(isTcsPayment)) {
			JsonData jsonData = MapperUtil.mapObjToClass(paymentDto.getConfigDetails(), JsonData.class);
			if (!StringUtil.isBlankJsonData(jsonData) && jsonData.getData() != null) {
				PaymentConfigDetails paymentConfigDetails = MapperUtil.mapObjToClass(jsonData.getData(),
						PaymentConfigDetails.class);
				if (BooleanUtils.isTrue(paymentConfigDetails.getIsTCSPaymentEnabled())) {
					paymentGroupAndCodeFound = true;
				}
			}

		} else {
			paymentGroupAndCodeFound = true;
		}
		return paymentGroupAndCodeFound;
	}

	public void checkIfGHSRedemtionAllowedForLocation(String paymentCode, String txnTypeToConsider,
			String locationCode) {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(locationCode);

		if (locationCacheDto.getGhsDetails() == null
				|| locationCacheDto.getGhsDetails().getIsGHSRedemptionAllowed() == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"GHS details are not present for the location " + locationCacheDto.getLocationCode());
		}

		if (!BooleanUtils.isTrue(locationCacheDto.getGhsDetails().getIsGHSRedemptionAllowed())) {
			throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
					"Invalid payment code - '" + paymentCode + "', for " + txnTypeToConsider + " transaction.");
		}
	}

	/**
	 * This method will check if reference is mandatory of not.
	 * 
	 * @param paymentCreateDto
	 * @param fieldDetailDtoList
	 */
	private void referenceMandatoryCheck(PaymentCreateDto paymentCreateDto, List<FieldDetailDto> fieldDetailDtoList) {

		// pending: regex check required?

		Map<String, String> referenceFieldAndValue = new HashMap<>();
		referenceFieldAndValue.put("reference1", paymentCreateDto.getReference1());
		referenceFieldAndValue.put("reference2", paymentCreateDto.getReference2());
		referenceFieldAndValue.put("reference3", paymentCreateDto.getReference3());

		for (Map.Entry<String, String> entryValue : referenceFieldAndValue.entrySet()) {
			for (FieldDetailDto fieldDetailDto : fieldDetailDtoList) {
				if (entryValue.getKey().equalsIgnoreCase(fieldDetailDto.getFieldName())
						&& BooleanUtils.isTrue(fieldDetailDto.getIsMandatory())
						&& StringUtils.isEmpty(entryValue.getValue())) {
					throw new ServiceException(SalesConstants.PLEASE_PROVIDE_VALID_DATA_DYNAMIC_REASON,
							SalesConstants.ERR_SALE_018,
							"Please provide data for mandatory field: " + entryValue.getKey(),
							Map.of("reason", "Data is missing for - " + entryValue.getKey()));
				}
			}
		}

	}

	private BigDecimal totalAmountPaid(String transactionId) {
		return paymentDetailsRepositoryExt.getPaidAmountByTransactionIdAndPaymentCode(transactionId, null,
				CommonUtil.getLocationCode(), null);

	}

	private void updateHeaderPaidAmount(SalesTxnDaoExt salesTxnDao) {

		BigDecimal totalAmountPaid = totalAmountPaid(salesTxnDao.getId());

		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {

			CashMemoDaoExt cashMemoDao = getCashMemoIfExists(salesTxnDao.getId());
			cashMemoDao.setPaidValue(totalAmountPaid);
			cashMemoRepositoryExt.save(cashMemoDao);
		} else if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
				|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())) {
			OrderDaoExt orderDao = getOrderExistsByOrderId(salesTxnDao.getId());
			orderDao.setPaidValue(totalAmountPaid);
			orderRepository.save(orderDao);
		}

	}

	private void checkOtherDetailsTypeIfExists(String paymentCode, JsonData otherDetails) {

		if (!StringUtil.isBlankJsonData(otherDetails) && otherDetails.getType() != null
				&& !paymentCode.equals(otherDetails.getType())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Invalid inputs. Other details: expected - " + paymentCode + " found - " + otherDetails.getType());
		}

	}

	private void checkIfCashbackPaymentIsComplete(String paymentCode, BigDecimal inputAmount, String inputPayerBankName,
			SalesTxnDaoExt salesTxnDao) {

		List<PaymentDetailsDaoExt> cashBackPaymentList = paymentDetailsRepositoryExt
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxnDao.getId(),
						PaymentCodeEnum.CASHBACK.getPaymentcode(), PaymentGroupEnum.REGULAR.name(), null,
						CommonUtil.getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));

		// return if no 'CASHBACK' payment is present
		if (CollectionUtil.isEmpty(cashBackPaymentList)) {
			return;
		}

		// only one 'CASHBACK' payment allowed for a transaction, hence picking the
		// first item from list
		PaymentDetailsDaoExt cashbackPaymentDetailsDao = cashBackPaymentList.get(0);

		// if reference3 (reference to 'CARD' payment) is present, then return, no check
		// required.
		if (!StringUtils.isEmpty(cashbackPaymentDetailsDao.getReference3())) {
			return;
		}

		// check if
		// 1. Input Payment code is 'CARD' (pending - should 'UNIPAY' be allowed?)
		// 2. payerBanName matches for both input & 'CASHBACK' payment
		// 3. 'CASHBACK' swipeAmount(reference2) should match input amount
		BigDecimal swipeAmount = BigDecimal.valueOf(Long.valueOf(cashbackPaymentDetailsDao.getReference2()));
		if (!PaymentCodeEnum.CARD.getPaymentcode().equals(paymentCode)
				|| !cashbackPaymentDetailsDao.getBankName().equals(inputPayerBankName)
				|| swipeAmount.compareTo(inputAmount) != 0) {
			throw new ServiceException(SalesConstants.PLEASE_ADD_VALID_CARD_PAYMENT_TO_AVAIL_CASHBACK,
					SalesConstants.ERR_SALE_182, SalesConstants.PLEASE_ADD_VALID_CARD_PAYMENT_TO_AVAIL_CASHBACK);
		}

	}

	public void checkForPaymentRestriction(String txnType, String subTxnType, SalesTxnDaoExt salesTxnDao,
			String paymentCode) {

		List<String> unfailedPaymentStatus = List.of(PaymentStatusEnum.OPEN.name(),
				PaymentStatusEnum.IN_PROGRESS.name(), PaymentStatusEnum.COMPLETED.name());
		List<SalesTxnDaoExt> invokedDetails = salesTxnRepositoryExt.findAllByRefTxnIdIdAndLocationCodeAndStatusIn(
				salesTxnDao.getId(), salesTxnDao.getLocationCode(),
				List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name()));
		if (txnType.equals(TransactionTypeEnum.ADV.name())) {

			List<PaymentCodeAndCount> positivePayments = paymentDetailsRepositoryExt
					.getUnFailedPaymentModeCount(salesTxnDao.getId(), CommonUtil.getStoreCode(), unfailedPaymentStatus);
			if (positivePayments.isEmpty())
				return;

			// test when list is empty
			// @formatter:off
			Map<String, Integer> paymentCodeCountMap = positivePayments.stream().collect(
					Collectors.toMap(PaymentCodeAndCount::getPaymentCode, payment -> (int) payment.getCount()));
			// @formatter:on

			int countForNewAddition = paymentCodeCountMap.containsKey(paymentCode)
					? paymentCodeCountMap.get(paymentCode)
					: 0;
			paymentCodeCountMap.put(paymentCode, countForNewAddition + 1);

			// ACCEPT ADVANCE
			if (subTxnType.equals(SubTxnTypeEnum.NON_FROZEN_RATES.name()))
				checkAcceptAdvanceRestriction(paymentCodeCountMap);
			// GOLD RATE FREEZE
			else if (subTxnType.equals(SubTxnTypeEnum.FROZEN_RATES.name()))
				checkGoldRateFreezeRestriction(paymentCodeCountMap);

		}

		else if ((TransactionTypeEnum.AB.name().equals(txnType) || TransactionTypeEnum.CO.name().equals(txnType))
				&& TransactionStatusEnum.CONFIRMED.name().equals(salesTxnDao.getStatus())
				&& !CollectionUtil.isEmpty(invokedDetails)) {
			// check if AB/CO is used(HOLD/OPEN) in any CM
			Map<String, String> errorMessage = Map.of("ABDocNo", salesTxnDao.getDocNo().toString(), "status",
					invokedDetails.get(0).getStatus(), "txnType", invokedDetails.get(0).getTxnType(), "docNo",
					invokedDetails.get(0).getDocNo().toString());
			throw new ServiceException(SalesConstants.AB_NO_ALREADY_INVOKED_FOR_BILLING, SalesConstants.ERR_SALE_395,
					txnType + " is used in other transaction.", errorMessage);
		}
	}

	public void checkAcceptAdvanceRestriction(Map<String, Integer> paymentCodeCountMap) {

		// credit note restriction
		Integer cnCount = paymentCodeCountMap.get(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode());
		if (cnCount != null && paymentCodeCountMap.size() > 1)
			throw new ServiceException("CN as a payment option, no other payment option can be clubbed.",
					SalesConstants.ERR_SALE_186,
					"CN can't be clubbed with other payment code. Payment codes:" + paymentCodeCountMap.keySet());

		// cheque restriction
		Integer chequeCount = paymentCodeCountMap.get(PaymentCodeEnum.CHEQUE.getPaymentcode());
		if (chequeCount != null && paymentCodeCountMap.size() > 1)
			throw new ServiceException("Cheque as a payment option, no other payment option can be clubbed.",
					SalesConstants.ERR_SALE_186,
					"Cheque can't be clubbed with other payment code. Payment codes:" + paymentCodeCountMap.keySet());
	}

	public void checkGoldRateFreezeRestriction(Map<String, Integer> paymentCodeCountMap) {

		// cheque restriction
		Integer chequeCount = paymentCodeCountMap.get(PaymentCodeEnum.CHEQUE.getPaymentcode());

		if (chequeCount != null) {

			if (paymentCodeCountMap.size() > 1)
				throw new ServiceException(
						"If Cheque is used as a payment option, then no other payment option can be used.",
						SalesConstants.ERR_SALE_186,
						"If Cheque is used as a payment option, then no other payment option can be used.");

			if (chequeCount > 1) {
				throw new ServiceException("Cheque cannot be selected multiple times.", SalesConstants.ERR_SALE_186,
						"Multiple Cheuqe not allowed. Count:" + chequeCount);
			}
		}

	}

	/**
	 * This method return payment details once payment is processed based on payment
	 * code.
	 * 
	 * @param paymentCode
	 * @param paymentGroup
	 * @param txnType
	 * @param txnId
	 * @param paymentCreateDto
	 * @return SalesPaymentDto
	 */
	@Transactional
	@Override
	public SalesPaymentDto savePayment(String paymentCode, String paymentGroup, String txnType, String subTxnType,
			String txnId, PaymentCreateDto paymentCreateDto, Boolean isPaymentFromAbtoCM, Boolean isTcsPayment) {

		log.info(
				"Add payment details to txn:- {}, payment code: {}, payment group: {}, instrument no.: {}, amount: {}, isTcsPayment: {}",
				txnId, paymentCode, paymentGroup, paymentCreateDto.getInstrumentNo(), paymentCreateDto.getAmount(),
				isTcsPayment);
		isTcsPayment = isTcsPayment == null ? Boolean.FALSE : isTcsPayment;

		// validate paymentCode and paymentGroup w.r.t transactionType and location.
		isPaymentCodeValid(paymentCode, paymentGroup, txnType, subTxnType, paymentCreateDto, isTcsPayment);

		// check if customer name and a product is selected
		SalesTxnDaoExt salesTxnDao = checkCustomerIdAndItems(paymentCode, txnId, txnType, isPaymentFromAbtoCM,
				paymentCreateDto.getOtherDetails());
		if (TxnSourceType.LEGACY.name().equals(salesTxnDao.getTxnSource())
				&& TransactionTypeEnum.notAllowedTxnForPaymentAfterMigration().contains(txnType)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "payment not allowed for migrated txn",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Payment not allowed for current transaction"));
		}

		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(salesTxnDao.getStatus(), salesTxnDao.getTxnType());

		// payment code restriction based on each type of transaction
		checkForPaymentRestriction(txnType, subTxnType, salesTxnDao, paymentCode);

		// check - if 'CASHBACK' payment is added and is not mapped to any 'CARD'
		// payment, then only valid 'CARD' payment to be done first
		// allow no other payments till then.
		// pending - should 'UNIPAY' be allowed?
		checkIfCashbackPaymentIsComplete(paymentCode, paymentCreateDto.getAmount(), paymentCreateDto.getReference1(),
				salesTxnDao);

		// check other details type
		checkOtherDetailsTypeIfExists(paymentCode, paymentCreateDto.getOtherDetails());

		// check if payment exceeds amount due from customer.
		AmountDetailsDto amountDetailsDto = checkIfAmountExceedsDueAmount(salesTxnDao, paymentCreateDto.getAmount(),
				paymentCode, paymentCreateDto.getOtherDetails(), isTcsPayment);

		// call factory service to invoke appropriate service implementation w.r.t
		// paymentCode.
		PaymentService paymentService = paymentFactory.getPaymentService(paymentCode, paymentGroup);

		// -----------------Payment validation start-----------------------
		SalesPaymentDto paymentDto = paymentService.validateInputFields(paymentCreateDto);
		paymentDto = paymentService.locationConfigValidation(paymentCode, paymentGroup, salesTxnDao, paymentDto);

		PaymentDetailsDaoExt paymentDetailsDao = (PaymentDetailsDaoExt) MapperUtil.getObjectMapping(paymentDto,
				new PaymentDetailsDaoExt());

		if (!StringUtils.isEmpty(paymentDto.getOtherDetails()) && paymentDto.getOtherDetails() != null) {
			paymentDetailsDao.setOtherDetails(MapperUtil.getStringFromJson(paymentDto.getOtherDetails()));
		}

		paymentDetailsDao.setPaymentCode(paymentCode);
		paymentDetailsDao.setPaymentGroup(paymentGroup);
		paymentDetailsDao.setHostName(CommonUtil.getAuthUser().getHostName());
		paymentDetailsDao.setSalesTxnType(txnType);
		paymentDetailsDao.setIsTcsPayment(isTcsPayment);
		paymentDetailsDao.setSalesTxnDao(salesTxnDao);

		Map<PaymentDetailsDaoExt, List<PaymentItemMappingDaoExt>> paymentMap = paymentService.paymentConfigValidations(
				paymentCode, paymentGroup, amountDetailsDto.getAmountDue(), amountDetailsDto.getTotalAmount(),
				paymentDetailsDao);
		// -----------------Payment validation end-------------------------

		// if CASHBACK payment, then clear card no from paymentDto, so that number will
		// be seen at UI
		if (PaymentCodeEnum.CASHBACK.getPaymentcode().equals(paymentCode)) {
			paymentDto.setInstrumentNo(null);
		}

		// if map is empty then return null, this can happen in 'GEP OFFER' (as of now)
		if (CollectionUtils.isEmpty(paymentMap)) {
			return null;
		}

		// get paymentDa from map
		paymentDetailsDao = new ArrayList<>(paymentMap.keySet()).get(0);

		// get currency code from engine
		paymentDetailsDao.setCurrencyCode(engineService.getCountryDetails().getCurrencyCode());

		// for rowId
		Integer paymentCount = paymentDetailsRepositoryExt.countBySalesTxnDaoId(txnId);
		paymentDetailsDao.setRowId(paymentCount + 1);

		// new step for payment details validation?

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());
		}

		// sync fileds
		paymentDetailsDao.setSrcSyncId(0);
		paymentDetailsDao.setDestSyncId(0);

		paymentDetailsDao = savePaymentAndItemMap(paymentDetailsDao, paymentMap.get(paymentDetailsDao));

		// trigger payment -- requires separate transaction.
		paymentDetailsDao = paymentFacadeService.triggerPayment(paymentService, paymentDto, paymentDetailsDao);

		updateHeaderPaidAmount(salesTxnDao);

		return mapPaymentDetailsDaoToDto(paymentDetailsDao, paymentDto);

	}

	/**
	 * @param paymentService
	 * @param paymentDto
	 * @param paymentDetailsDao
	 * @return
	 */
	public PaymentDetailsDaoExt triggerPayment(PaymentService paymentService, SalesPaymentDto paymentDto,
			PaymentDetailsDaoExt paymentDetailsDao) {
		paymentDetailsDao = paymentService.triggerPayment(paymentDetailsDao, paymentDto);
		return paymentDetailsDao;
	}

	/**
	 * @param paymentDetailsDao
	 * @return
	 */
	@Transactional
	public PaymentDetailsDaoExt savePaymentAndItemMap(PaymentDetailsDaoExt paymentDetailsDao,
			List<PaymentItemMappingDaoExt> paymentItemMap) {
		paymentDetailsDao = paymentDetailsRepositoryExt.save(paymentDetailsDao);

		// if paymentItemMap is not empty then save
		if (!CollectionUtil.isEmpty(paymentItemMap)) {
			paymentItemMappingRepository.saveAll(paymentItemMap);
		}

		return paymentDetailsDao;
	}

	private SalesTxnDaoExt checkCustomerIdAndItems(String paymentCode, String transactionId, String transactionType,
			Boolean isPaymentFromAbtoCM, JsonData otherDetails) {
		SalesTxnDaoExt salesTxnDao = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				transactionType);

		if (StringUtils.isEmpty(salesTxnDao.getCustomerId())) {
			throw new ServiceException(SalesConstants.PLEASE_SELECT_CUSTOMER_DETAILS, SalesConstants.ERR_SALE_110,
					"Customer details not found for transaction id: " + transactionId);
		}

		Boolean isErrorToBeIgnored = isPaymentFromAbtoCM;
		if (PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentCode)
				&& !StringUtil.isBlankJsonData(otherDetails)) {
			Boolean isRateProtectedCN = JsonUtils.getValueFromJson(otherDetails.getData(),
					SalesConstants.IS_RATE_PROTECTED_CN, Boolean.class);
			if (BooleanUtils.isTrue(isRateProtectedCN)) {
				isErrorToBeIgnored = isRateProtectedCN;
			}
		}

		// pending - other transactions
		if (TransactionTypeEnum.CM.name().equals(transactionType)) {

			if (SubTxnTypeEnum.GIFT_SALE.name().equals(salesTxnDao.getSubTxnType())) {
				commonCashMemoService.getGiftDetailsIfExists(salesTxnDao.getId());
			} else {
				List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = commonCashMemoService
						.getCashMemoDetailsIfExists(salesTxnDao.getId(), isErrorToBeIgnored);
				// check if items are in stock.
				commonCashMemoService.checkIfItemsInStock(cashMemoDetailsDaoList);

			}

		} else if (TransactionTypeEnum.AB.name().equals(transactionType)
				|| TransactionTypeEnum.CO.name().equals(transactionType)) {
			orderUtilService.getOrderDetailsIfExists(salesTxnDao.getId(), isErrorToBeIgnored);

		}

		// RSO check removed

		return salesTxnDao;
	}

	/**
	 * This method will return payment details based on sales transaction id.
	 * 
	 * @param transactionId
	 * @param paymentCode
	 * @param instrumentType
	 * @return ListResponse<SalesPaymentDto>
	 */
	@Override
	public ListResponse<SalesPaymentDto> getPaymentDetails(String transactionId, String paymentCode,
			String paymentGroup, String instrumentType) {

		// pageable added to sort list by rowId
		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("rowId").ascending());

		Page<PaymentDetailsDaoExt> paymentDetailsDaoList = paymentDetailsRepositoryExt
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(transactionId, paymentCode,
						paymentGroup, instrumentType, CommonUtil.getLocationCode(),
						PaymentStatusEnum.getPaidPaymentStatus(), pageable);

		List<SalesPaymentDto> paymentDtoList = new ArrayList<>();

		int count = 1;
		for (PaymentDetailsDaoExt paymentDetailsDao : paymentDetailsDaoList) {
			SalesPaymentDto paymentDto = new SalesPaymentDto();

			paymentDto = mapPaymentDetailsDaoToDto(paymentDetailsDao, paymentDto);
			paymentDto.setRowId(count++);
			paymentDtoList.add(paymentDto);
		}

		return new ListResponse<>(paymentDtoList);
	}

	/**
	 * This method will delete(cancel) payment details based on payment id.
	 * 
	 * @param id
	 */
	@Transactional
	@Override
	public SalesPaymentDto deletePaymentDetails(String id) {
		// NOTE: one more payment delete function is present in discount service.
		log.info("Delete payment :- " + id);

		PaymentDetailsDaoExt paymentDetailsDao = checkIfPaymentIdExists(id);
		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(paymentDetailsDao.getSalesTxnDao().getStatus(),
				paymentDetailsDao.getSalesTxnDao().getTxnType());

		// check payment status before deleting
		if (PaymentStatusEnum.getStatusNotAllowedForDelete().contains(paymentDetailsDao.getStatus())) {
			return mapPaymentDetailsDaoToDto(paymentDetailsDao, new SalesPaymentDto());
		}

		// check if payment is deleted or not.
		if (BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_035,
					paymentDetailsDao.getPaymentCode() + " payment cannot be deleted for the transaction.");
		}

		// make payment non-editable after deletion
		paymentDetailsDao.setIsEditable(false);
		PaymentService paymentSerive = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
				paymentDetailsDao.getPaymentGroup());

		paymentSerive.deletePayment(paymentDetailsDao);

		if (PaymentStatusEnum.REVERSED.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.REVERSED_WITH_CN.name().equals(paymentDetailsDao.getStatus())) {
			Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
			paymentDetailsDao.setPaymentDate(businessDate);
			paymentDetailsDao.setReversalDate(businessDate);
			paymentDetailsRepositoryExt.save(paymentDetailsDao);
		}

		// delete from payment item mapping
		List<PaymentItemMappingDaoExt> paymentItemMapping = paymentItemMappingRepository.findByPaymentDetailsDaoId(id);
		if (!CollectionUtil.isEmpty(paymentItemMapping)) {
			paymentItemMappingRepository.deleteAll(paymentItemMapping);
		}

		updateHeaderPaidAmount(paymentDetailsDao.getSalesTxnDao());

		return mapPaymentDetailsDaoToDto(paymentDetailsDao, new SalesPaymentDto());
	}

	/**
	 * This method will update payment details based on payment id, status and
	 * payment update dto.
	 * 
	 * @param id
	 * @param status
	 * @param paymentUpdateDto
	 * @return SalesPaymentDto
	 */
	@Override
	public SalesPaymentDto updatePaymentDetails(String id, String status, PaymentUpdateDto paymentUpdateDto) {

		log.info("Update payment :- " + id);
		// doubt: payment item mapping check?
		PaymentDetailsDaoExt paymentDetailsDao = checkIfPaymentIdExists(id);
		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(paymentDetailsDao.getSalesTxnDao().getStatus(),
				paymentDetailsDao.getSalesTxnDao().getTxnType());

		// check - if 'CASHBACK' payment is added and is not mapped to any 'CARD'
		// payment, then only valid 'CARD' payment to be done first
		// allow no other payments till then.
		// pending - should 'UNIPAY' be allowed?
		checkIfCashbackPaymentIsComplete(paymentDetailsDao.getPaymentCode(),
				paymentUpdateDto.getAmount() == null ? BigDecimal.ZERO : paymentUpdateDto.getAmount(),
				paymentUpdateDto.getReference1(), paymentDetailsDao.getSalesTxnDao());

		// check payment status before updating
		// 'COMPLETED' status allowed only for only for CASH, if payment code is other
		// than 'CASH', then return
		if (PaymentStatusEnum.getStatusNotAllowedForConfirmOrUpdate().contains(paymentDetailsDao.getStatus())
				&& (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())
						&& !PaymentCodeEnum.CASH.getPaymentcode().equals(paymentDetailsDao.getPaymentCode()))) {

			return mapPaymentDetailsDaoToDto(paymentDetailsDao, null);

		}

		// check if payment is editable or not.
		if (BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_223,
					paymentDetailsDao.getPaymentCode() + " payment cannot be update for the transaction.");
		}

		// check if items are in stock.
		checkIfItemsAreInStockBasedOnTxnType(paymentDetailsDao.getSalesTxnDao());

		// check other details type
		checkOtherDetailsTypeIfExists(paymentDetailsDao.getPaymentCode(), paymentUpdateDto.getOtherDetails());

		// amount update is allowed only for CASH paymentMode, if not then throw error
		if (!PaymentCodeEnum.CASH.getPaymentcode().equalsIgnoreCase(paymentDetailsDao.getPaymentCode())
				&& (!StringUtils.isEmpty(paymentUpdateDto.getAmount())
						&& paymentDetailsDao.getAmount().compareTo(paymentUpdateDto.getAmount()) != 0)) {
			throw new ServiceException(AMOUNT_CANNOT_BE_UPDATED_FOR_THIS_PAYMENT_CODE, ERR_SALE_043,
					"Amount cannot be updated for this payment code: " + paymentDetailsDao.getPaymentCode());
		}

		BigDecimal paymentDetailsAmount = paymentDetailsDao.getAmount() == null ? BigDecimal.ZERO
				: paymentDetailsDao.getAmount();
		// amount validation with final value - (pass difference between update and
		// original amount)
		checkIfAmountExceedsDueAmount(paymentDetailsDao.getSalesTxnDao(),
				paymentUpdateDto.getAmount() == null ? BigDecimal.ZERO
						: paymentUpdateDto.getAmount().subtract(paymentDetailsAmount),
				paymentDetailsDao.getPaymentCode(), paymentUpdateDto.getOtherDetails(),
				paymentDetailsDao.getIsTcsPayment());

		// payment group to come
		PaymentService paymentService = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
				paymentDetailsDao.getPaymentGroup());

		SalesPaymentDto paymentDto = paymentService.validateAndUpdatePaymentDetails(paymentDetailsDao.getPaymentCode(),
				status, paymentUpdateDto, paymentDetailsDao);

		paymentDetailsDao = (PaymentDetailsDaoExt) MapperUtil.getObjectMapping(paymentDto, paymentDetailsDao);
		if (!StringUtils.isEmpty(paymentDto.getOtherDetails()) && paymentDto.getOtherDetails() != null) {
			paymentDetailsDao.setOtherDetails(MapperUtil.getStringFromJson(paymentDto.getOtherDetails()));
		}

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());
		}

		paymentDetailsDao = paymentFacadeService.savePaymentAndItemMap(paymentDetailsDao, new ArrayList<>());

		updateHeaderPaidAmount(paymentDetailsDao.getSalesTxnDao());

		return mapPaymentDetailsDaoToDto(paymentDetailsDao, paymentDto);
	}

	/**
	 * This method will return the eligibility details based on cutsomerId and
	 * paymentCode.
	 * 
	 * @param customerId
	 * @param paymentCode
	 * @param transactionId
	 * @return EligibleAmountDto
	 */
	@Override
	public AmountDetailsDto checkCustomerEligibilityForPaymentCode(Integer customerId, String paymentCode,
			String paymentGroup, String transactionId, String txnType) {

		// can be order details also...how to get total amount? (one solution - total
		// amount can be saved in sales txn table or call respective repo based on
		// txnType)

		SalesTxnDaoExt salesTxnDao = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		AmountDetailsDto amountDetailsDto = commonPaymentService.getTxnValueAndDueAmount(salesTxnDao, null);

		PaymentService paymentService = paymentFactory.getPaymentService(paymentCode, paymentGroup);
		// pending - eligible amount implementation
		InstrumentCashAmountDto instrumentCashAmountDto = paymentService.getEligibleAmount(customerId, paymentCode,
				salesTxnDao, amountDetailsDto.getAmountDue());
		amountDetailsDto.setEligibleAmount(instrumentCashAmountDto.getTotalCashAmount());
		amountDetailsDto.setPmlaEligibleAmount(instrumentCashAmountDto.getTotalPmlaCashAmount());

		return amountDetailsDto;
	}

	/**
	 * @param transactionId
	 * @param salesTxnDao
	 * @param amountDetailsDto
	 * @return
	 */

	/**
	 * This method will return payment details if payment id exists, else will throw
	 * error.
	 * 
	 * @param id
	 * @return PaymentDetailsDao
	 */
	private PaymentDetailsDaoExt checkIfPaymentIdExists(String id) {
		PaymentDetailsDaoExt paymentDetailsDao = paymentDetailsRepositoryExt.findByIdAndSalesTxnDaoLocationCode(id,
				CommonUtil.getLocationCode());

		if (paymentDetailsDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid payment id: " + id, Map.of("type", "payment"));
		}

		return paymentDetailsDao;
	}

	private CashMemoDaoExt getCashMemoIfExists(String transactionId) {
		CashMemoDaoExt cashMemoDao = cashMemoRepositoryExt.findOneByIdAndSalesTxnDaoLocationCode(transactionId,
				CommonUtil.getLocationCode());

		if (StringUtils.isEmpty(cashMemoDao)) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid CM is: " + transactionId, Map.of("type", "cash memo"));
		}

		return cashMemoDao;
	}

	public OrderDaoExt getOrderExistsByOrderId(String orderId) {
		OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCode(orderId,
				CommonUtil.getLocationCode());

		if (StringUtils.isEmpty(orderDao)) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo id: " + orderId, Map.of("type", "order"));
		}

		return orderDao;
	}

	/**
	 * This method will validate payment by id and otp.
	 * 
	 * @param id
	 * @param otp
	 * @return SalesPaymentDto
	 */
	@Transactional
	@Override
	public SalesPaymentDto validatePayment(String id, String otp) {

		log.info("Validate payment :- " + id);

		PaymentDetailsDaoExt paymentDetailsDao = checkIfPaymentIdExists(id);
		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(paymentDetailsDao.getSalesTxnDao().getStatus(),
				paymentDetailsDao.getSalesTxnDao().getTxnType());

		// check payment status before validate
		if (PaymentStatusEnum.getStatusNotAllowedForDelete().contains(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			return mapPaymentDetailsDaoToDto(paymentDetailsDao, null);
		}

		// check if payment is editable or not.
		if (BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_223,
					paymentDetailsDao.getPaymentCode() + " payment cannot be validated for the transaction.");
		}

		PaymentService paymentService = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
				paymentDetailsDao.getPaymentGroup());

		SalesPaymentDto salesPaymentDto = paymentService.validatePayment(paymentDetailsDao, otp);

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());
			paymentDetailsRepositoryExt.save(paymentDetailsDao);
		}

		updateHeaderPaidAmount(paymentDetailsDao.getSalesTxnDao());

		return mapPaymentDetailsDaoToDto(paymentDetailsDao, salesPaymentDto);
	}

	/**
	 * This method will confirm payment based on payment id and status.
	 * 
	 * @param id
	 * @param status
	 */
	@Override
	public SalesPaymentDto confirmPayment(String id, String status) {

		log.info("Confirm payment :- " + id);
		// pending: metal rate check is required?

		// later - for Encircle, QCGC and GV
		PaymentDetailsDaoExt paymentDetailsDao = checkIfPaymentIdExists(id);

		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(paymentDetailsDao.getSalesTxnDao().getStatus(),
				paymentDetailsDao.getSalesTxnDao().getTxnType());

		checkManualBillValues(paymentDetailsDao.getSalesTxnDao());

		// check payment status before confirm
		if (PaymentStatusEnum.getStatusNotAllowedForConfirmOrUpdate().contains(paymentDetailsDao.getStatus())) {
			return mapPaymentDetailsDaoToDto(paymentDetailsDao, null);
		}

		// check if payment is editable or not. - not required? as payments would have
		// already been closed.
		if (BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_223,
					paymentDetailsDao.getPaymentCode() + " payment cannot be confirmed for the transaction.");
		}

		// check if items are in stock.
		checkIfItemsAreInStockBasedOnTxnType(paymentDetailsDao.getSalesTxnDao());

		// check cash limit
		checkCashLimit(paymentDetailsDao.getSalesTxnDao());

		Boolean isRateProtectedCN = null;
		// check for rate freezed CN configurations
		if (!StringUtil.isBlankJsonStr(paymentDetailsDao.getOtherDetails())) {
			JsonData cnOtherDetails = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
			isRateProtectedCN = JsonUtils.getValueFromJson(cnOtherDetails.getData(),
					SalesConstants.IS_RATE_PROTECTED_CN, Boolean.class);
		}
		// if current payment is not rate protected, then check for validations
		if (!BooleanUtils.isTrue(isRateProtectedCN)) {
			PaymentDetailsDaoExt rateFreezedPayment = commonPaymentService
					.getMetalRateProtectedCNIfExists(paymentDetailsDao.getSalesTxnDao());
			commonPaymentService.validTxnForRateFreezedCN(paymentDetailsDao.getSalesTxnDao(), rateFreezedPayment);
		}

		PaymentService paymentService = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
				paymentDetailsDao.getPaymentGroup());

		paymentDetailsDao = paymentService.confirmPayment(paymentDetailsDao, status); // why status is required?

		if (PaymentStatusEnum.COMPLETED.name().equals(paymentDetailsDao.getStatus())) {
			paymentDetailsDao.setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());
			paymentDetailsRepositoryExt.save(paymentDetailsDao);
		}

		updateHeaderPaidAmount(paymentDetailsDao.getSalesTxnDao());

		return mapPaymentDetailsDaoToDto(paymentDetailsDao, new SalesPaymentDto());

	}

	private void checkManualBillValues(SalesTxnDaoExt salesTxnDao) {

		BigDecimal finalValue = BigDecimal.ZERO;

		if (SubTxnTypeEnum.getManualSubTxnTypes().contains(salesTxnDao.getSubTxnType())) {
			if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {

				CashMemoDaoExt cashMemoDao = cashMemoRepositoryExt
						.findOneByIdAndSalesTxnDaoLocationCode(salesTxnDao.getId(), salesTxnDao.getLocationCode());
				finalValue = cashMemoDao.getFinalValue();
				commonCashMemoService.validateManualBillValues(cashMemoDao, null, true);
			} else if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())
					|| TransactionTypeEnum.CO.name().equals(salesTxnDao.getTxnType())) {

				OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCodeAndTxnTypeAndSubTxnType(
						salesTxnDao.getId(), CommonUtil.getLocationCode(), salesTxnDao.getTxnType(),
						salesTxnDao.getSubTxnType());
				finalValue = orderDao.getFinalValue();
				orderUtilService.validateManualBillDetails(orderDao, null, true);
			} else if (TransactionTypeEnum.ADV.name().equals(salesTxnDao.getTxnType())) {
				AdvanceDaoExt adv = advanceRepository.getOne(salesTxnDao.getId());
				finalValue = adv.getFinalValue();
			}
		}

		// check final value
		commonTransactionService.customerDetailsCheckForFinalValue(finalValue, salesTxnDao);
	}

	private void checkIfItemsAreInStockBasedOnTxnType(SalesTxnDaoExt salesTxnDao) {
		// check if items are in stock.
		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {

			commonCashMemoService.checkIfItemsInStock(commonCashMemoService.getCashMemoDetails(salesTxnDao.getId()));

		} else if (TransactionTypeEnum.AB.name().equals(salesTxnDao.getTxnType())) {
			// pending- check if items are in stock.
		}

	}

	private AmountDetailsDto checkIfAmountExceedsDueAmount(SalesTxnDaoExt salesTxnDao, BigDecimal amount,
			String paymentCode, JsonData otherDetails, Boolean isTcsPayment) {

		AmountDetailsDto amountDetailsDto = commonPaymentService.getTxnValueAndDueAmount(salesTxnDao, isTcsPayment);
		Boolean isLinkedCn = false;
		Boolean isRateProtectedCN = false;
		if (!StringUtil.isBlankJsonData(otherDetails)) {
			// get 'isLinkedCn' if exists in other details and set to main DTO
			// NOTE: if present do not throw error if payment exceeds
			isLinkedCn = JsonUtils.getValueFromJson(otherDetails.getData(), "isLinkedCn", Boolean.class);
			isRateProtectedCN = JsonUtils.getValueFromJson(otherDetails.getData(), SalesConstants.IS_RATE_PROTECTED_CN,
					Boolean.class);

		}

		// check if payment is for TCS.
		if (BooleanUtils.isTrue(isTcsPayment)) {
			validateTcsPayment(amount, amountDetailsDto, isLinkedCn);
			return amountDetailsDto;
		}

		// if payment code is 'CREDIT NOTE' and 'isLinkedCn' is true
		// or payment code is 'CREDIT NOTE' and 'isRateProtectedCN' is true
		// or payment code is 'GHS ACCOUNT', then skip amount check
		if (((BooleanUtils.isTrue(isLinkedCn) || BooleanUtils.isTrue(isRateProtectedCN))
				&& PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(paymentCode))
				|| PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode().equals(paymentCode)) {
			return amountDetailsDto;
		}

		// check if payment exceeds amount due from customer.
		// check will be skipped for 'UNIPAY' and 'GEP OFFER'
		if ((amount != null && amount.compareTo(amountDetailsDto.getAmountDue()) > 0)) {
			throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
					SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
		}

		return amountDetailsDto;
	}

	/**
	 * @param amount
	 * @param amountDetailsDto
	 * @param isLinkedCn
	 */
	private void validateTcsPayment(BigDecimal amount, AmountDetailsDto amountDetailsDto, Boolean isLinkedCn) {
		if (BooleanUtils.isTrue(isLinkedCn)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Linked CNs are not allowed as payment for TCS.",
					Map.of(SalesConstants.REMARKS, "Linked CN not allowed as TCS"));
		}

		// due amount should be <= tcsAmount, only then TCS amount is allowed.
		if (amountDetailsDto.getAmountDue().compareTo(amountDetailsDto.getTcsAmount()) <= 0) {
			// input amount should be less than due amount
			// check will be skipped for 'UNIPAY' and 'GEP OFFER'
			if ((amount != null && amount.compareTo(amountDetailsDto.getAmountDue()) > 0)) {
				throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
						SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
			}
		} else {
			// else throw error
			throw new ServiceException(SalesConstants.TCS_PAYMENT_NOT_VALID, SalesConstants.ERR_SALE_359,
					"TCS payment cannot be done before adding payment related to transaction..");
		}
	}

	@Transactional
	@Override
	public LinkedPaymentResponseDto confirmLinkedPayments(String transactionId, String transactionType,
			String subTransactionType) {

		log.info("Confirm linked payment(Credit Notes) for transaction id :- " + transactionId);

		// pending: metal rate check is required?

		SalesTxnDaoExt salesTxnDao = checkCustomerIdAndItems(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(),
				transactionId, transactionType, null, null);
		String locationCode = salesTxnDao.getLocationCode();
		// check sales txn status and type.
		checkSalesTranscationStatusForPayment(salesTxnDao.getStatus(), salesTxnDao.getTxnType());

		PaymentDetailsDaoExt rateFreezedPayment = commonPaymentService.getMetalRateProtectedCNIfExists(salesTxnDao);

		checkMetalRateForCm(salesTxnDao, rateFreezedPayment);

		// check for rate freezed CN configurations
		commonPaymentService.validTxnForRateFreezedCN(salesTxnDao, rateFreezedPayment);

		checkManualBillValues(salesTxnDao);

		// TCS payment should be completed
		AmountDetailsDto amountDetailsDto = commonPaymentService.getTxnFinalValue(salesTxnDao);
		checkTcsPaymentCompletion(transactionId, locationCode, amountDetailsDto);

		// check if Credit note payments are present in current txn.
		List<PaymentDetailsDaoExt> paymentDetailsList = paymentDetailsRepositoryExt.getAllPaymentCodePayments(
				PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), transactionId, List.of(PaymentStatusEnum.OPEN.name()),
				locationCode);

		if (CollectionUtil.isEmpty(paymentDetailsList)) {
			return new LinkedPaymentResponseDto(transactionId, PaymentStatusEnum.COMPLETED.name());
		}

		// filter by isLinkedCn true and isEditable true
		List<PaymentDetailsDaoExt> paymentDetailsToBeRedeemed = filterToGetLinkedCN(paymentDetailsList);

		// if no linked CN are present then return payment list
		if (CollectionUtil.isEmpty(paymentDetailsToBeRedeemed)) {
			return new LinkedPaymentResponseDto(transactionId, PaymentStatusEnum.COMPLETED.name());
		}

		// check if items are in stock.
		checkIfItemsAreInStockBasedOnTxnType(salesTxnDao);

		// map of payment and CN
		Map<PaymentDetailsDaoExt, CreditNoteDaoExt> paymentCNMap = getValidCreditNotes(paymentDetailsToBeRedeemed,
				rateFreezedPayment);

		// cash limit check
		checkCashLimit(salesTxnDao);

		// get final amount
		BigDecimal finalValue = amountDetailsDto.getTotalAmount();
		// get paid value - currently 'COMPLETED' payments
		BigDecimal paidValue = commonTransactionService.paidValue(transactionId, null,
				PaymentStatusEnum.COMPLETED.name());
		// pending amount to be paid by customer
		BigDecimal dueAmount = finalValue.subtract(paidValue);

		// if due amount is zero, de-link CNs and delete payments.
		for (Map.Entry<PaymentDetailsDaoExt, CreditNoteDaoExt> paymentAndCn : paymentCNMap.entrySet()) {

			if (BigDecimal.ZERO.compareTo(dueAmount) > 0) {
				// if dueAmount is -ve throw error
				throw new ServiceException(SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER,
						SalesConstants.ERR_SALE_030, SalesConstants.PAYMENT_EXCEEDS_DUE_AMOUNT_FROM_CUSTOMER);
			} else if (BigDecimal.ZERO.compareTo(dueAmount) == 0) {
				// if due amount is zero, removed de-link CN
				// delete payment from txn
				// make payment non-editable after deletion
				paymentAndCn.getKey().setIsEditable(false);
				paymentAndCn.getKey().setStatus(PaymentStatusEnum.DELETED.name());
			}
			// check if payment amount is less than dueAmount
			else if (dueAmount.compareTo(paymentAndCn.getKey().getAmount()) >= 0) {
				// if payment is less than due then full redemption of CN
				redeeemLinkedCN(paymentAndCn, paymentAndCn.getValue().getAmount());
				// update dueAmount
				dueAmount = dueAmount.subtract(paymentAndCn.getKey().getAmount());

			} else if (dueAmount.compareTo(paymentAndCn.getKey().getAmount()) < 0) {
				// if payment is more than due then partial redemption of CN
				redeeemLinkedCN(paymentAndCn, dueAmount);
				// update payment amount and cash collected
				paymentAndCn.getKey().setAmount(dueAmount);
				if (paymentAndCn.getKey().getCashCollected() != null
						&& paymentAndCn.getKey().getCashCollected().compareTo(paymentAndCn.getKey().getAmount()) > 0) {
					// if cash collected is more than paynt amount, then updated cash collected
					paymentAndCn.getKey().setCashCollected(paymentAndCn.getKey().getAmount());
				}
				// update dueAmount
				dueAmount = BigDecimal.ZERO;
			}
			
		}

		
		// save payments
		paymentDetailsRepositoryExt.saveAll(paymentCNMap.keySet());
		// update header
		updateHeaderPaidAmount(salesTxnDao);

		return new LinkedPaymentResponseDto(transactionId, PaymentStatusEnum.COMPLETED.name());
	}

	private void checkMetalRateForCm(SalesTxnDaoExt salesTxnDao, PaymentDetailsDaoExt rateFreezedPayment) {
		if (TransactionTypeEnum.CM.name().equals(salesTxnDao.getTxnType())) {
			Boolean isAvoidMetalRateCheck = rateFreezedPayment != null;
			Set<String> metalToBeIgnoredForRateCheck = null;
			if (salesTxnDao.getRefTxnId() != null) {
				OrderDaoExt orderDao = commonCashMemoService.checkIfPreOrderExistsByRefTxn(salesTxnDao.getRefTxnId());
				if (BooleanUtils.isFalse(isAvoidMetalRateCheck)) {
					isAvoidMetalRateCheck = commonCashMemoService.checkIfFrozenRatePreOrder(salesTxnDao);
				}
				// get best rate if exists
				metalToBeIgnoredForRateCheck = commonCashMemoService.getBestRate(salesTxnDao, orderDao, false, true);
			}

			// metal rate check
			// hold time - pick from location
			commonTransactionService.checkMetalRate(salesTxnDao,
					commonTransactionService.mapMetalRateJsonToDto(salesTxnDao.getMetalRateDetails()),
					TransactionStatusEnum.CONFIRMED, true, commonCashMemoService.getHoldTimeInMinutesForCm(),
					isAvoidMetalRateCheck, metalToBeIgnoredForRateCheck);
		}
	}

	/**
	 * @param transactionId
	 * @param locationCode
	 * @param amountDetailsDto
	 */
	private void checkTcsPaymentCompletion(String transactionId, String locationCode,
			AmountDetailsDto amountDetailsDto) {
		if (BigDecimal.ZERO.compareTo(amountDetailsDto.getTcsAmount()) < 0) {
			// TCS payment should be completed.
			List<PaymentDetailsDaoExt> tcsPayments = paymentDetailsRepositoryExt
					.findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(transactionId, locationCode,
							List.of(PaymentStatusEnum.COMPLETED.name()), true);
			BigDecimal tcsAmountPaid = tcsPayments.stream().map(PaymentDetailsDaoExt::getAmount).reduce(BigDecimal.ZERO,
					BigDecimal::add);
			if (amountDetailsDto.getTcsAmount().compareTo(tcsAmountPaid) != 0) {
				throw new ServiceException(SalesConstants.PAYMENT_FAILED_BASED_ON_BUSINESS_RESTRICTION,
						SalesConstants.ERR_SALE_186,
						"TCS payments should be completed before redeeming linked Credit notes.");
			}
		}
	}

	/**
	 * @param paymentDetailsList
	 * @return
	 */
	public List<PaymentDetailsDaoExt> filterToGetLinkedCN(List<PaymentDetailsDaoExt> paymentDetailsList) {
		List<PaymentDetailsDaoExt> paymentDetailsToBeRedeemed = new ArrayList<>();

		paymentDetailsList.forEach(paymentDetailsDao -> {
			Boolean isLinkedCn = false;
			JsonData otherDetails = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
			if (!StringUtil.isBlankJsonData(otherDetails)) {
				// get 'isLinkedCn' if exists in other details and set to main DTO
				// NOTE: if present do not throw error if payment exceeds
				isLinkedCn = JsonUtils.getValueFromJson(otherDetails.getData(), "isLinkedCn", Boolean.class);
			}
			// if payment code in 'CREDIT NOTE' and 'isLinkedCn' is true, then add to linked
			// CN list
			if (BooleanUtils.isTrue(isLinkedCn) && !BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
				paymentDetailsToBeRedeemed.add(paymentDetailsDao);
			}
		});
		return paymentDetailsToBeRedeemed;
	}

	/**
	 * This method will redeem credit notes.
	 * 
	 * @param paymentAndCn
	 */
	public void redeeemLinkedCN(Map.Entry<PaymentDetailsDaoExt, CreditNoteDaoExt> paymentAndCn,
			BigDecimal amountToBeRedeemed) {
		CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(paymentAndCn.getKey().getOtherDetails(), JsonData.class).getData(),
				CreditNotePaymentOtherDetailsDto.class);

		FrozenRatesDetails frozenRatesDetails = null;
		// if 'isRateProtectedCN', then amount to be checked for redemption
		if (BooleanUtils.isTrue(cnOtherDetails.getIsRateProtectedCN())) {
			AmountDetailsDto amountDetailsDto = commonPaymentService.validPaymentForRateFreezedCN(paymentAndCn.getKey(),
					paymentAndCn.getValue(), cnOtherDetails, true);
			if (cnOtherDetails.getFrozenRateDetails().getWeight().compareTo(amountDetailsDto.getTotalWeight()) > 0) {
				BigDecimal remainingWeight = cnOtherDetails.getFrozenRateDetails().getWeight()
						.subtract(amountDetailsDto.getTotalWeight());
				// Update payment frozen weight with proper weight used.
				cnOtherDetails.getFrozenRateDetails().setWeight(amountDetailsDto.getTotalWeight());
				// frozen rate details for child CN
				frozenRatesDetails = new FrozenRatesDetails(cnOtherDetails.getFrozenRateDetails().getMetal(),
						cnOtherDetails.getFrozenRateDetails().getRatePerUnit(), remainingWeight);
			}
		}

		CreditNoteRedeemDto cnRedeemDto = new CreditNoteRedeemDto();
		cnRedeemDto.setId(paymentAndCn.getValue().getId());
		// pending - is it necessary to set customer id?
		cnRedeemDto.setCustomerId(paymentAndCn.getValue().getCustomerId());
		cnRedeemDto.setUtilizedAmount(amountToBeRedeemed);
		// setting salesTxn also, else CN redemption is failing
		cnRedeemDto.setSalesTxn(paymentAndCn.getKey().getSalesTxnDao());
		cnRedeemDto.setFrozenRatesDetails(frozenRatesDetails);

		CreditNoteResponse newCn = creditNoteService.redeemCreditNote(cnRedeemDto);
		if (newCn != null) {
			// with residual amount check
			if (CNStatus.CANCELLED.name().equals(newCn.getStatus())) {
				cnOtherDetails.setRefundAmount(newCn.getAmount());
			} else {
				cnOtherDetails.setNewCNNumber(newCn.getDocNo());
				cnOtherDetails.setRemainingAmount(paymentAndCn.getValue().getAmount().subtract(amountToBeRedeemed));
			}
		}

		// set status
		paymentAndCn.getKey().setStatus(PaymentStatusEnum.COMPLETED.name());
		// set CN other details
		paymentAndCn.getKey().setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentAndCn.getKey().getPaymentCode(), cnOtherDetails)));
		// update payment date
		paymentAndCn.getKey().setPaymentDate(businessDayService.getBusinessDay().getBusinessDate());

	}

	/**
	 * This method will get valid Credit notes.
	 * 
	 * @param paymentDetailsToBeRedeemed
	 */
	private Map<PaymentDetailsDaoExt, CreditNoteDaoExt> getValidCreditNotes(
			List<PaymentDetailsDaoExt> paymentDetailsToBeRedeemed, PaymentDetailsDaoExt rateFreezedPayment) {

		Map<PaymentDetailsDaoExt, CreditNoteDaoExt> paymentCNMap = new LinkedHashMap<>();

		// sort by priority & amount in ascending order
		Collections.sort(paymentDetailsToBeRedeemed, Comparator
				.comparing((PaymentDetailsDaoExt payment) -> MapperUtil
						.mapObjToClass(MapperUtil.mapObjToClass(payment.getOtherDetails(), JsonData.class).getData(),
								CreditNotePaymentOtherDetailsDto.class)
						.getCnPriority())
				.thenComparing(PaymentDetailsDaoExt::getAmount));

		// 'rateFreezedCn' is highest priority
		if (rateFreezedPayment != null) {
			paymentDetailsToBeRedeemed.remove(rateFreezedPayment);
			paymentDetailsToBeRedeemed.add(0, rateFreezedPayment);
		}

		// check CN status.
		paymentDetailsToBeRedeemed.forEach(paymentDetailsDao -> {
			// get CN
			CreditNoteDaoExt creditNoteDaoExt = creditNoteRepository
					.findByIdAndLocationCode(paymentDetailsDao.getReference3(), CommonUtil.getLocationCode());

			// check if CN is still in OPEN status.
			// pending - status update to failed is required?
			if (!CNStatus.OPEN.name().equals(creditNoteDaoExt.getStatus())) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_SHOULD_BE_IN_OPEN_STATUS,
						SalesConstants.ERR_SALE_157, "Credit note is used in other txn",
						Map.of("docNo", creditNoteDaoExt.getDocNo().toString()));
			}

			// workflow status check - workflow status should be null, if not
			// such CN is not allowed as payment.
			if (creditNoteDaoExt.getWorkflowStatus() != null) {
				throw new ServiceException(SalesConstants.CREDIT_NOTE_DYNAMIC_NUMBER_IS_REQUESTED_FOR_APPROVAL,
						SalesConstants.ERR_SALE_158,
						"Request is raised for the Credit Note no. -" + creditNoteDaoExt.getDocNo()
								+ ". Cannot be used as payment. CN approval status: "
								+ creditNoteDaoExt.getWorkflowStatus(),
						Map.of("docNo", creditNoteDaoExt.getDocNo().toString()));
			}
			paymentCNMap.put(paymentDetailsDao, creditNoteDaoExt);

		});

		return paymentCNMap;
	}

	private void checkCashLimit(SalesTxnDaoExt salesTxnDao) {
		// cash limit check:
		// get all cash paid for current transaction.
		BigDecimal totalCashPaid = BigDecimal.ZERO;
		BigDecimal totalPmlaCashAmount = BigDecimal.ZERO;
		List<PaymentDetailsDaoExt> paymentDetails = paymentDetailsRepositoryExt
				.getCashCollectedByTransactionIdAndPaymentCodes(salesTxnDao.getId(),
						PaymentCodeEnum.getPaymentsCodesWhichWillHaveCashElement(), salesTxnDao.getLocationCode(),
						null);
		CashPaymentDetailsDto cashPaymentDetails = commonPaymentService.getPaymentDetailsAndCheckCNAndQCGCPayment(paymentDetails);
	    totalCashPaid=totalCashPaid.add(cashPaymentDetails.getTotalCashPaid());
	    totalPmlaCashAmount = totalPmlaCashAmount.add(cashPaymentDetails.getTotalPmlaCashAmount());

		if (totalCashPaid == null || BigDecimal.ZERO.compareTo(totalCashPaid) == 0) {
			return;
		}

		InstrumentCashAmountDto instrumentCashAmountDto = new InstrumentCashAmountDto(totalCashPaid, null,
				totalCashPaid, totalPmlaCashAmount);
		customerPaymentService.cashLimitCheck(instrumentCashAmountDto, null, null, salesTxnDao,
				salesTxnDao.getCustomerId(), false);
	}

	@Transactional
	@Override
	public void deleteTempPayment(String id, Boolean isSingle) {
		// NOTE: this function to be called when get is done for when AB/CO is
		// CONFIRMED( for all editable payments only) and on EOD job
		log.info("Delete temp payment :- " + id);

		PaymentDetailsDaoExt paymentDetailsDao = checkIfPaymentIdExists(id);

		if (!(TransactionTypeEnum.AB.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType())
				|| TransactionTypeEnum.CO.name().equals(paymentDetailsDao.getSalesTxnDao().getTxnType()))
				&& (TransactionStatusEnum.CONFIRMED.name().equals(paymentDetailsDao.getSalesTxnDao().getStatus()))) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Payment cannot be deleted for current transaction",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Payment cannot be deleted for current transaction."));
		}

		// check transaction status
		checkSalesTranscationStatusForPayment(paymentDetailsDao.getSalesTxnDao().getStatus(),
				paymentDetailsDao.getSalesTxnDao().getTxnType());

		// check payment status before deleting
		if (PaymentStatusEnum.getStatusNotAllowedForDelete().contains(paymentDetailsDao.getStatus())) {
			return;
		}

		if (BooleanUtils.isFalse(paymentDetailsDao.getIsEditable())) {
			throw new ServiceException(SalesConstants.PAYMENT_CANNOT_BE_EDITED, SalesConstants.ERR_SALE_223,
					paymentDetailsDao.getPaymentCode() + " payment cannot be confirmed for the transaction.");
		}

		// make payment non-editable after deletion
		paymentDetailsDao.setIsEditable(false);
		PaymentService paymentSerive = paymentFactory.getPaymentService(paymentDetailsDao.getPaymentCode(),
				paymentDetailsDao.getPaymentGroup());

		paymentSerive.deleteTempPayment(paymentDetailsDao);

		if (PaymentStatusEnum.REVERSED.name().equals(paymentDetailsDao.getStatus())
				|| PaymentStatusEnum.REVERSED_WITH_CN.name().equals(paymentDetailsDao.getStatus())) {
			Date bussinessDate = businessDayService.getBusinessDay().getBusinessDate();
			paymentDetailsDao.setPaymentDate(bussinessDate);
			paymentDetailsDao.setReversalDate(bussinessDate);
			paymentDetailsRepositoryExt.save(paymentDetailsDao);
		}

		// delete from payment item mapping
		List<PaymentItemMappingDaoExt> paymentItemMapping = paymentItemMappingRepository.findByPaymentDetailsDaoId(id);
		if (!CollectionUtil.isEmpty(paymentItemMapping)) {
			paymentItemMappingRepository.deleteAll(paymentItemMapping);
		}

		if (BooleanUtils.isTrue(isSingle))
			updateHeaderPaidAmount(paymentDetailsDao.getSalesTxnDao());

	}

	@Override
	public void voidPaymentUpdate(String transactionId, String transactionType, String subTransactionType,
			Set<String> paymentIds) {

		if (CollectionUtil.isEmpty(paymentIds)) {
			return;
		}

		SalesTxnDaoExt salesTxnDao = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				transactionType);

		if (!List.of(TransactionStatusEnum.CONFIRMED.name(), TransactionStatusEnum.APPROVAL_PENDING.name())
				.contains(salesTxnDao.getStatus())) 
		{

			throw new ServiceException(SalesConstants.TRANSACTION_IS_IN + salesTxnDao.getStatus() + " status.", SalesConstants.ERR_SALE_445);
		}

		List<PaymentDetailsDaoExt> paymentsToVoid = paymentDetailsRepositoryExt
				.findAllBySalesTxnDaoIdAndIdInAndStatus(transactionId, paymentIds, PaymentStatusEnum.COMPLETED.name());
		if (!CollectionUtil.isEmpty(paymentsToVoid)) {
			// filter on
			// i. UNIPAY. Reason: currently void from UI done for UNIPAY only
			// ii. 'IsVoid'. Reason: to insert records payment_refunds. If for a payment
			// 'is_void' is already true, then for such payments no need to insert records
			// into payment_refunds table.
			paymentsToVoid = paymentsToVoid.stream()
					.filter(payment -> PaymentCodeEnum.UNIPAY.name().equals(payment.getPaymentCode())
							&& BooleanUtils.isNotTrue(payment.getIsVoid()))
					.collect(Collectors.toList());
		}
		if (CollectionUtil.isEmpty(paymentsToVoid)) {
			return;
		}

		// update is_void to 'true' if void is done at UI and this API is called
		paymentsToVoid.forEach(payment -> payment.setIsVoid(true));
		paymentDetailsRepositoryExt.saveAll(paymentsToVoid);

		// TODO: for the updated payments, insert record in <payment_refunds> table -
		// this will help in valid revenue calculation.
		
		//CONVERT PAYMENT DETAILS TO PAYMENT REFUND 
		for (PaymentDetailsDaoExt paymentDetailObj : paymentsToVoid) {
			commonPaymentService.createPaymentReversal(List.of(paymentDetailObj), null);
		}
		
		

		// TODO: sync data to payment_details & payment_refunds data to EPOSS

		// points to note:
		// 1. in bill cancellation API: for voided payments no need to create new
		// records in payment_refunds.
		// 2. For the new records inserted to payment_refunds in current API, cancel if
		// update has to be done.
	}
}
