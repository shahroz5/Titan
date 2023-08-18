/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.constants;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public enum PaymentCodeEnum {
	UNIPAY("UNIPAY"), AIRPAY("AIRPAY"), RAZORPAY("RAZOR PAY");

	String value;

	PaymentCodeEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}

	public static List<String> getPaymentTypeEnum() {
		List<String> strList = new ArrayList<>();
		strList.add(PaymentCodeEnum.UNIPAY.getValue());
		strList.add(PaymentCodeEnum.AIRPAY.getValue());
		strList.add(PaymentCodeEnum.RAZORPAY.getValue());
		return strList;
	}
}
