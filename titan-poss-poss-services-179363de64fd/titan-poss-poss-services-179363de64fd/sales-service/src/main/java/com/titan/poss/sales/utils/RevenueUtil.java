/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public final class RevenueUtil {

	private static final List<String> validPaymentCodes = new ArrayList<>();
	private static final List<String> validTxnType = new ArrayList<>();
	private static final List<String> validStatus = new ArrayList<>();
	private static final List<String> reversedStatus = new ArrayList<>();
	private static final List<String> paymentGroups = new ArrayList<>();
	private static final List<String> validTxnStatus = new ArrayList<>();
	private static final List<String> validPaymentCodesDayWiseRevenue = new ArrayList<>();
	private static final List<String> validPaymentCodesReversal = new ArrayList<>();

	private RevenueUtil() {
	}

	static {
		loadPaymentCodes();
		loadPaymentCodesDayWiseRevenue();
		loadPaymentCodesReversal();
		loadTxnType();
		loadValidStatus();
		loadReversedStatus();
		loadPaymentGroup();
		loadValidTxnstatus();
	}

	public static List<String> getValidPaymentCodesDayWiseRevenue() {
		return validPaymentCodesDayWiseRevenue;
	}

	public static List<String> getValidPaymentCodesReversal() {
		return validPaymentCodesReversal;
	}

	public static List<String> getValidPaymentCodes() {
		return validPaymentCodes;
	}

	public static List<String> getValidPaymentGroups() {
		return paymentGroups;
	}

	private static void loadPaymentGroup() {
		paymentGroups.add(PaymentGroupEnum.WALLET.name());
		paymentGroups.add(PaymentGroupEnum.BANK_LOAN.name());
	}

	public static List<String> getReversedStatus() {
		return reversedStatus;
	}

	public static List<String> getValidTxnTypes() {
		return validTxnType;
	}

	public static List<String> getValidStatus() {
		return validStatus;
	}

	public static List<String> getValidTxnStatus() {
		return validTxnStatus;
	}

	private static void loadReversedStatus() {
		reversedStatus.add(PaymentStatusEnum.REVERSED.name());
	}

	private static void loadValidTxnstatus() {
		validTxnStatus.add(TransactionStatusEnum.CONFIRMED.name());
		validTxnStatus.add(TransactionStatusEnum.CANCELLED.name());
		validTxnStatus.add(TransactionStatusEnum.DELETED.name());
		validTxnStatus.add(TransactionStatusEnum.DELIVERED.name());
		validTxnStatus.add(TransactionStatusEnum.PARTIAL_INVOICE.name());
		validTxnStatus.add(TransactionStatusEnum.RESIDUAL_CLOSURE.name());
	}

	/**
	 * 
	 */
	private static void loadValidStatus() {
		validStatus.add(PaymentStatusEnum.REVERSED.name());
		validStatus.add(PaymentStatusEnum.REVERSED_WITH_CN.name());
		validStatus.add(PaymentStatusEnum.COMPLETED.name());
	}

	/**
	 * 
	 */
	private static void loadPaymentCodes() {
		validPaymentCodes.add(PaymentCodeEnum.CASH.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.CARD.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.CHEQUE.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.DD.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.RTGS.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
		//validPaymentCodes.add(PaymentCodeEnum.UNIPAY.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.AIRPAY.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
		validPaymentCodes.add(PaymentCodeEnum.UPI.getPaymentcode());
		
	}

	/**
	 * 
	 */
	private static void loadPaymentCodesDayWiseRevenue() {
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.CASH.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.CARD.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.CHEQUE.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.DD.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.RTGS.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.RO_CHEQUE.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.RO_RTGS.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.AIRPAY.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.WALLET.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.EMPLOYEE_LOAN.getPaymentcode());
		validPaymentCodesDayWiseRevenue.add(PaymentCodeEnum.UPI.getPaymentcode());

	}

	/**
	 * 
	 */
	private static void loadTxnType() {
		validTxnType.add(TransactionTypeEnum.CM.name());
		validTxnType.add(TransactionTypeEnum.AB.name());
		validTxnType.add(TransactionTypeEnum.ADV.name());
		validTxnType.add(TransactionTypeEnum.GRF.name());
		validTxnType.add(TransactionTypeEnum.CO.name());
	}

	/**
	 * 
	 */
	private static void loadPaymentCodesReversal() {
		validPaymentCodesReversal.add(PaymentCodeEnum.CASH.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.CARD.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.CHEQUE.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.DD.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.RTGS.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.RO_PAYMENT.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.RO_CHEQUE.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.RO_RTGS.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.RAZOR_PAY.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.AIRPAY.getPaymentcode());
		validPaymentCodesReversal.add(PaymentCodeEnum.UPI.getPaymentcode());

	}
}
