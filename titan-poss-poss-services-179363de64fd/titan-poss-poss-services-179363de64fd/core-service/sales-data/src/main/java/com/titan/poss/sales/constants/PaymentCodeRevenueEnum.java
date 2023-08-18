/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.constants;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum PaymentCodeRevenueEnum {

	CASH("CASH"), CARD ("CARD"), CHEQUE ("CHEQUE"), DD ("DD"), ROPAYMENT ("RO PAYMENT"), WALLET("WALLET"), AIRPAY("AIRPAY"), RTGS("RTGS"), EMPLOYEE_LOAN("EMPLOYEE_LOAN"), SALARY_ADVANCE("SALARY_ADVANCE"), UPI("UPI"),RAZORPAY("RAZORPAY");
	
	
	private String paymentCode;
	PaymentCodeRevenueEnum(String paymentCode) {
		this.paymentCode = paymentCode;

	}
	public String getPaymentcode() {
		return this.paymentCode;
	}
	
}
