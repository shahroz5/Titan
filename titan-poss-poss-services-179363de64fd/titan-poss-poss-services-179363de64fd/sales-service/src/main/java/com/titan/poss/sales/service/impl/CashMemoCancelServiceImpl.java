/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import static com.titan.poss.sales.constants.PaymentCodeEnum.AIRPAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.CARD;
import static com.titan.poss.sales.constants.PaymentCodeEnum.CASH;
import static com.titan.poss.sales.constants.PaymentCodeEnum.DD;
import static com.titan.poss.sales.constants.PaymentCodeEnum.RAZOR_PAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.RTGS;
import static com.titan.poss.sales.constants.PaymentCodeEnum.UPI;
import static com.titan.poss.sales.constants.PaymentCodeEnum.UNIPAY;
import static com.titan.poss.sales.constants.PaymentCodeEnum.WALLET;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.PaymentCodeAndGroup;
import com.titan.poss.sales.dto.PaymentCodeWithList;
import com.titan.poss.sales.dto.PaymentDetailsForUnipayDto;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CNPaymentDetailsDto;
import com.titan.poss.sales.dto.request.CreditNoteIndvCreateDto;
import com.titan.poss.sales.factory.PaymentFactory;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.CashMemoCancelService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.service.PaymentService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("SalesCashMemoCancelService")
public class CashMemoCancelServiceImpl implements CashMemoCancelService {

	@Autowired
	PaymentFacadeService paymentFacade;

	@Autowired
	PaymentFactory paymentFactory;

	@Autowired
	CommonPaymentService paymentUtil;

	@Autowired
	CashMemoRepository cashMemoRepository;

	@Autowired
	EngineService engineService;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	// 3838 with Return
	// 2023 with CN

	// @formatter:off
	// <<AIRPAY, AIRPAY, Gift voucher, Gift Card Qwikcilver>> not allowed for return
	// PENDING Gift voucher, Gift Card Qwikcilver
	private static final List<String> PAYMENT_CODE_NOT_ALLOWED_IN_RETURN = List.of(AIRPAY.getPaymentcode(),
			PaymentCodeEnum.GIFT_VOUCHER.getPaymentcode());
	private static final List<String> DIGI_GOLD_PAYMENT_CODE_NOT_ALLOWED_IN_RETURN = List.of(
			PaymentCodeEnum.DIGI_GOLD_TANISHQ.getPaymentcode(), PaymentCodeEnum.DIGI_GOLD_NON_TANISHQ.getPaymentcode());
	private static final List<String> PAYMENT_GRP_NOT_ALLOWED_IN_RETURN = List.of(WALLET.getPaymentcode());

	// remove cash, cards (w & w/o unipay), DD, Airpay, RTGS, wallet
	// PENDING
	/*
	 * private static final List<String> PAYMENT_CODE_COMBINATION_IN_CN =
	 * List.of(CASH.getPaymentcode(), CARD.getPaymentcode(),
	 * UNIPAY.getPaymentcode(), DD.getPaymentcode(), AIRPAY.getPaymentcode(),
	 * RTGS.getPaymentcode(), RAZOR_PAY.getPaymentcode());
	 */
	private static final List<String> PAYMENT_CODE_COMBINATION_IN_CN = List.of(CASH.getPaymentcode(),
			CARD.getPaymentcode(), RTGS.getPaymentcode(), UPI.getPaymentcode());
	private static final List<String> PAYMENT_CODE_OTHER_MODE_IN_CN = List.of(UNIPAY.getPaymentcode(),
			AIRPAY.getPaymentcode(), RAZOR_PAY.getPaymentcode());
	private static final List<String> PAYMENT_GRP_COMBINATION_IN_CN = List.of(WALLET.getPaymentcode());
	// @formatter:on

	private static final PaymentCodeAndGroup LOYALTY_PAYMENT_MODE = new PaymentCodeAndGroup(
			PaymentCodeEnum.ENCIRCLE.getPaymentcode(), null);

	// if TCS payment is present, then CANCEL_WITH_RETURN not allowed(NAP-7928)
	// for TCS amount, separate CN to be created
	private static final PaymentCodeAndGroup TCS_PAYMENT = new PaymentCodeAndGroup("TCS", "TCS");

	@Override
	public List<CancellationTypeEnum> allowedCancelTypeByTxnId(SalesTxnDaoExt salesTxn, BigDecimal tcsAmount) {

		Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap = getPaymentMapDetailsByTxnId(salesTxn);
		Set<PaymentCodeAndGroup> paymentCodeAndGrps = paymentsMap.keySet();

		List<CancellationTypeEnum> cancelTypesAllowed = new ArrayList<>();
		cancelTypesAllowed.add(CancellationTypeEnum.CANCEL_WITH_CN);

		if (salesTxn.getTxnType().equals(TransactionTypeEnum.CM.name())
				&& !salesTxn.getSubTxnType().equals(SubTxnTypeEnum.GIFT_SALE.name())) {

			if (tcsAmount == null) {
				tcsAmount = cashMemoRepository.getOne(salesTxn.getId()).getTcsAmount();
			}
			Set<PaymentCodeAndGroup> paymentCodeGroupNotAllowed = checkCancelTypeNotAllowedInCancelWIthReturn(
					paymentCodeAndGrps);
			// UAT_1889 resolved
			if (paymentCodeGroupNotAllowed.size() != paymentCodeAndGrps.size()
					&& Collections.disjoint(PaymentCodeAndGroup.getPaymentCodes(paymentCodeAndGrps),
							DIGI_GOLD_PAYMENT_CODE_NOT_ALLOWED_IN_RETURN)
					&& (tcsAmount == null || BigDecimal.ZERO.compareTo(tcsAmount) == 0))// if TCS is present, then
																						// CANCEL_WITH_RETURN is not
																						// allowed
				cancelTypesAllowed.add(CancellationTypeEnum.CANCEL_WITH_RETURN);

		} else if (salesTxn.getSubTxnType().equals(SubTxnTypeEnum.GIFT_SALE.name())) {

			cancelTypesAllowed.add(CancellationTypeEnum.CANCEL_WITH_RETURN);
		}

		return cancelTypesAllowed;
	}

	@Override
	@Transactional
	public Map<String, Integer> cancelPaymentWise(SalesTxnDaoExt salesTxn, CancelDaoExt cancel,
			CancellationTypeEnum cancelType, CNType cnType, Date docDate) {
		log.info("inside cancel payment wise");
		Map<String, Integer> cnDocNos = new HashMap<>();

		Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap = getPaymentMapDetailsByTxnId(salesTxn, true);

		if (paymentsMap.isEmpty()) {
			return Map.of();
		}

		Set<PaymentCodeAndGroup> paymentCodeAndGrps = paymentsMap.keySet();

		// business logic to allow cancel type based on payment code or payment group
		verifyIfCancelTypeAllowed(cancelType, paymentCodeAndGrps);

		// remove TCS payment for normal CN generation
		paymentsMap.remove(TCS_PAYMENT);
		paymentCodeAndGrps.remove(TCS_PAYMENT);

		// for cancel with CN, some payment code/modes need to be combined
		// to create one CN. For this one only no payment factory
		// for this do w/o payment factory
		checkForCNCombination(salesTxn, cancel, cancelType, cnDocNos, paymentsMap, cnType, docDate);

		PaymentService paymentService = null;
		// (may be blank map, if all got consumed at above steps)
		for (Map.Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
			PaymentCodeAndGroup pcg = entry.getKey();
			paymentService = paymentFactory.getPaymentService(pcg.getPaymentCode(), pcg.getPaymentGroup());

			if (entry.getValue() != null || !entry.getValue().isEmpty()) {
				Map<String, Integer> cancelPaymentmap = paymentService.cancelPayment(entry.getValue(), cancel, salesTxn,
						cancelType, cnType, docDate);
				if (cancelPaymentmap != null)
					cnDocNos.putAll(cancelPaymentmap);
			}
		}

		return cnDocNos;

	}

	private Map<String, Integer> checkForCNCombination(SalesTxnDaoExt salesTxn, CancelDaoExt cancel,
			CancellationTypeEnum cancelType, Map<String, Integer> cnDocs,
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap, CNType cnType, Date docDate) {
		log.info("payment map in check for cn comb---{}", paymentsMap);
		List<PaymentCodeAndGroup> removePaymentCodes = new ArrayList<>();
		BigDecimal totalCombinationAmt = BigDecimal.ZERO;
		BigDecimal totalCombinationCashCollected = BigDecimal.ZERO;
		Map<String, List<PaymentDetailsForUnipayDto>> paymentsByMode = new HashMap<String, List<PaymentDetailsForUnipayDto>>();
		CNPaymentDetailsDto cnPaymentDetails = new CNPaymentDetailsDto();
		if (cancelType == CancellationTypeEnum.CANCEL_WITH_CN) {
			Map<String, Boolean> integrationConfigMap = new HashMap<>();
			LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
			integrationConfigMap.put(PaymentCodeEnum.UNIPAY.getPaymentcode(),
					locationCacheDto.getPaymentDetails().getRtgs().getIsEnableUnipayForIntegration());
			integrationConfigMap.put(PaymentCodeEnum.AIRPAY.getPaymentcode(),
					locationCacheDto.getPaymentDetails().getRtgs().getIsEnableAirpayForIntegration());
			integrationConfigMap.put(PaymentCodeEnum.RAZOR_PAY.getPaymentcode(),
					locationCacheDto.getPaymentDetails().getIsRazorPayEnabled());

			for (Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
				PaymentCodeAndGroup paymentCG = entry.getKey();
				List<PaymentDetailsDaoExt> payments = entry.getValue();

				// TODO: If CASHBACK is present as payment and cancelType is 'CANCEL_WITH_CN',
				// then separate CN should be created for that CARD with Cashback details.

				if (PAYMENT_CODE_COMBINATION_IN_CN.contains(paymentCG.getPaymentCode())
						|| PAYMENT_GRP_COMBINATION_IN_CN.contains(paymentCG.getPaymentGroup())) {

					// add allowed in this one, remove from payemtsMap
					removePaymentCodes.add(paymentCG);
					BigDecimal amtCodeGrpWise = paymentUtil.getTotalAmtFromPaymentDetails(payments);
					BigDecimal cashCollectedCodeGrpWise = paymentUtil.getTotalCashCollectedFromPaymentDetails(payments);
					totalCombinationAmt = totalCombinationAmt.add(amtCodeGrpWise);
					totalCombinationCashCollected = totalCombinationCashCollected.add(cashCollectedCodeGrpWise);
					cnPaymentDetails = paymentUtil.getPaymentDetailsForCNGeneration(payments, cnPaymentDetails);
				}
				// add airpay and razorpay amount to totalCombinationAmt when there is no
				// integration.

				// ignore, as we will make changes in respective impl

//				if ( integrationConfigMap.get(paymentCG.getPaymentCode())) {
//					if (PAYMENT_CODE_OTHER_MODE_IN_CN.contains(paymentCG.getPaymentCode())) {
//						removePaymentCodes.add(paymentCG);
//						List<PaymentDetailsForUnipayDto> paymentsByPaymentCodeWise = paymentUtil
//								.getPaymentsByPaymentCode(payments);
//						paymentsByMode.put(paymentCG.getPaymentCode(), paymentsByPaymentCodeWise);
//						log.info("paymentsByPaymentCodeWise", paymentsByPaymentCodeWise);
//					}
//				} else if (true) {
//					if (PAYMENT_CODE_OTHER_MODE_IN_CN.contains(paymentCG.getPaymentCode())) {
//						removePaymentCodes.add(paymentCG);
//						List<PaymentDetailsForUnipayDto> paymentsByPaymentCodeWise = paymentUtil
//								.getPaymentsByPaymentCode(payments);
//						paymentsByMode.put(paymentCG.getPaymentCode(), paymentsByPaymentCodeWise);
//						log.info("paymentsByPaymentCodeWise", paymentsByPaymentCodeWise);
//					}
//				}

			}
		}
		
		// remove which are already processed
		removePaymentCodes.forEach(paymentsMap::remove);

//		// means some combination were there, create CN for this amount
		if (totalCombinationAmt.signum() > 0) {
			cnDocs.putAll(
					paymentUtil.createCN(cnType,
							List.of(new CreditNoteIndvCreateDto(totalCombinationAmt, totalCombinationCashCollected,
									new JsonData("CN_PAYMENT_DETAILS", cnPaymentDetails))),
							salesTxn, cancel, docDate, null));
//			cnDocs.putAll(paymentUtil.createCN(cnType,
//					List.of(new CreditNoteIndvCreateDto(totalCombinationAmt, totalCombinationCashCollected, new JsonData("CN_PAYMENT_DETAILS", cnPaymentDetails))), salesTxn,
//					cancel, docDate));
		}
//		// CN for Unipay/AIRPAY/RAZORPAY
//		if (paymentsByMode.size() > 0) {
//			paymentsByMode.entrySet().forEach(paymentsAmountByMode -> {
//				Optional.ofNullable(paymentsAmountByMode.getValue()).ifPresent(paymentAmounts -> {
//					paymentAmounts.stream().forEach(paymentAmount -> {
//						if (paymentAmount.getAmount().signum() > 0) {
//							cnDocs.putAll(paymentUtil.createCN(cnType,
//									List.of(new CreditNoteIndvCreateDto(paymentAmount.getAmount(),
//											paymentAmount.getAmount())),
//									salesTxn, cancel, docDate, paymentAmount.getPaymentId()));
//						}
//					});
//				});
//			});
//		}

		Optional<CashMemoDao> cashMemoDao = cashMemoRepository.findById(salesTxn.getId());
		cashMemoDao.ifPresent(cashmemo -> {
			if (cashmemo.getTcsAmount() != null && cashmemo.getTcsAmount().compareTo(BigDecimal.ZERO) > 0) {
				cnDocs.putAll(paymentUtil.createCN(CNType.TCS_CREDIT_NOTE,
						List.of(new CreditNoteIndvCreateDto(cashmemo.getTcsAmount(), cashmemo.getTcsAmount())),
						salesTxn, cancel, docDate, null));
			}
		});

		// TODO: remove TCS payments

		return cnDocs;
	}

	private void verifyIfCancelTypeAllowed(CancellationTypeEnum cancelType,
			Set<PaymentCodeAndGroup> paymentCodeAndGrps) {

		if (cancelType == CancellationTypeEnum.CANCEL_WITH_RETURN) {

			Set<PaymentCodeAndGroup> paymentCodeGroupNotAllowed = checkCancelTypeNotAllowedInCancelWIthReturn(
					paymentCodeAndGrps);
			if (paymentCodeGroupNotAllowed.size() == paymentCodeAndGrps.size())
				throw new ServiceException("Provided cancel type is not allowed for this transaction", "ERR-SALE-077",
						paymentCodeGroupNotAllowed.stream().map(PaymentCodeAndGroup::getPaymentCode)
								.collect(Collectors.toList()));
			// // Check for Digi Gold Payment Code
			paymentCodeAndGrps.forEach(pcg -> {
				// Check for Digi Gold Payment Code
				if (DIGI_GOLD_PAYMENT_CODE_NOT_ALLOWED_IN_RETURN.contains(pcg.getPaymentCode()))
					throw new ServiceException("Provided cancel type is not allowed for this transaction",
							"ERR-SALE-077", DIGI_GOLD_PAYMENT_CODE_NOT_ALLOWED_IN_RETURN);
			});
		}
	}

	private Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> getPaymentMapDetailsByTxnId(SalesTxnDaoExt salesTxn) {

		return getPaymentMapDetailsByTxnId(salesTxn, false);
	}

	private Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> getPaymentMapDetailsByTxnId(SalesTxnDaoExt salesTxn,
			boolean isIntgAtTop) {

		List<PaymentDetailsDaoExt> payments = paymentDetailsRepositoryExt
				.getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(salesTxn.getId(), null, null, null,
						CommonUtil.getLocationCode(), List.of(PaymentStatusEnum.COMPLETED.name()));

		// for payment group singularity considered,
		// make payment code same as payment group code
		payments.forEach(paymentDetail -> {

			if (SalesUtil.isPaymentGroupToBeConsidered(paymentDetail.getPaymentGroup()))
				paymentDetail.setPaymentCode(paymentDetail.getPaymentGroup());
		});

		// TCS payments
		List<PaymentDetailsDaoExt> tcsPayments = payments.stream()
				.filter(paymentDao -> BooleanUtils.isTrue(paymentDao.getIsTcsPayment())).collect(Collectors.toList());
		// non TCS payments
		Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap = payments.stream()
				.filter(paymentDao -> !BooleanUtils.isTrue(paymentDao.getIsTcsPayment()))
				.collect(Collectors.groupingBy(PaymentDetailsDaoExt::getPaymentCodeAndGroup));

		if (isIntgAtTop) {
			// 1st check if loyalty payment is there (1st priority)
			PaymentCodeWithList pcl = findKeyValueByKey(paymentsMap, LOYALTY_PAYMENT_MODE);

			// if loyalty payment is there, keep it at top
			if (pcl != null) {
				List<PaymentDetailsDaoExt> loyaltyPayments = pcl.getVal();
				Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> tempMap = new HashMap<>();
				tempMap.putAll(paymentsMap);
				tempMap.remove(pcl.getPcgroup());
				paymentsMap.clear();
				paymentsMap = new LinkedHashMap<>();
				paymentsMap.put(pcl.getPcgroup(), loyaltyPayments);
				paymentsMap.putAll(tempMap);
			}

		}

		// if TCS payments exists, add it to payments map.
		if (!CollectionUtil.isEmpty(tcsPayments)) {
			paymentsMap.put(TCS_PAYMENT, tcsPayments);
		}

		return paymentsMap;
	}

	private static PaymentCodeWithList findKeyValueByKey(
			Map<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> paymentsMap, PaymentCodeAndGroup pcg) {

		PaymentCodeWithList payment = new PaymentCodeWithList();

		for (Map.Entry<PaymentCodeAndGroup, List<PaymentDetailsDaoExt>> entry : paymentsMap.entrySet()) {
			PaymentCodeAndGroup temp = entry.getKey();

			boolean isCodeNull = (pcg.getPaymentCode() == null);
			boolean isGroupNull = (pcg.getPaymentGroup() == null);

			if ((!isCodeNull && !isGroupNull) || (isCodeNull && temp.getPaymentGroup().equals(pcg.getPaymentGroup()))
					|| (isGroupNull && temp.getPaymentCode().equals(pcg.getPaymentCode()))
					|| (temp.getPaymentCode().equals(pcg.getPaymentCode())
							&& temp.getPaymentGroup().equals(pcg.getPaymentGroup()))) {
				payment = new PaymentCodeWithList(entry.getKey(), entry.getValue());
				break;
			}
		}
		if (payment.getPcgroup() == null)
			payment = null;
		return payment;
	}

	// only cancel with return needs to be verify, other cancel types are allowed
	// based on business logic
	private Set<PaymentCodeAndGroup> checkCancelTypeNotAllowedInCancelWIthReturn(
			Set<PaymentCodeAndGroup> paymentCodeAndGrps) {

		Set<PaymentCodeAndGroup> paymentCodeGroupNotAllowed = new HashSet<>();

		// check for CANCEL_WITH_RETURN
		paymentCodeAndGrps.forEach(pcg -> {

			if (PAYMENT_CODE_NOT_ALLOWED_IN_RETURN.contains(pcg.getPaymentCode())
					|| PAYMENT_GRP_NOT_ALLOWED_IN_RETURN.contains(pcg.getPaymentGroup()) || TCS_PAYMENT.equals(pcg))
				paymentCodeGroupNotAllowed.add(pcg);
		});

		return paymentCodeGroupNotAllowed;
	}

}
