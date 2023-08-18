/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ENUM class for Sales service payment codes
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum PaymentCodeEnum {

	AIRPAY("AIRPAY"), CARD("CARD"), CASH("CASH"), CHEQUE("CHEQUE"), DD("DD"), ENCIRCLE("ENCIRCLE"), QCGC("QCGC"),
	RO_PAYMENT("RO PAYMENT"), UNIPAY("UNIPAY"), WALLET("WALLET"), BANK_LOAN("BANK_LOAN"), RTGS("RTGS"),RO_RTGS("RO RTGS"),
	GIFT_VOUCHER("GIFT VOUCHER"), GHS_EVOUCHER("GHS EVOUCHER"), CREDIT_NOTE("CREDIT NOTE"), CASHBACK("CASHBACK"),
	GHS_ACCOUNT("GHS ACCOUNT"), RAZOR_PAY("RAZOR PAY"), DIGI_GOLD_TANISHQ("DIGI GOLD TANISHQ"),
	DIGI_GOLD_NON_TANISHQ("DIGI GOLD NON TANISHQ"), GEP_OFFER("GEP OFFER"),EMPLOYEE_LOAN("EMPLOYEE LOAN"),RO_CHEQUE("RO CHEQUE"),
	UPI("UPI"), VALUACCESS("VALUACCESS");

	// PENDING
	// TEP/ GEP Exchange offer (Not Sure)
	// TATA LOYALTY POINTS
	// EMPLOYEE LOAN
	// EMPLOYEE PAYMENT ADVANCE

	String paymentCode;

	PaymentCodeEnum(String paymentCode) {
		this.paymentCode = paymentCode;
	}

	public String getPaymentcode() {
		return this.paymentCode;
	}

	static final Map<String, PaymentCodeEnum> BY_PAYMENT_CODE = new HashMap<>();

	static {
		for (PaymentCodeEnum p : values()) {
			BY_PAYMENT_CODE.put(p.getPaymentcode().toUpperCase(), p);
		}
	}

	public static PaymentCodeEnum valueOfPaymentCode(String paymentCode) {
		return BY_PAYMENT_CODE.get(paymentCode.toUpperCase());
	}

	public static List<String> getPaymentsRestrictedForHold() {
		return List.of(PaymentCodeEnum.UNIPAY.getPaymentcode());
	}

	public static List<String> getPaymentsCodesWhichWillHaveCashElement() {
		return List.of(PaymentCodeEnum.CASH.getPaymentcode(), PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(),
				PaymentCodeEnum.GHS_ACCOUNT.getPaymentcode(), PaymentCodeEnum.QCGC.getPaymentcode());
	}
}
