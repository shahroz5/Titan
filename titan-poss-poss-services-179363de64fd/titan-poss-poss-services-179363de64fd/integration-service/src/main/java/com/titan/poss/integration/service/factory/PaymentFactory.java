/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.factory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.service.PaymentService;
import com.titan.poss.integration.service.impl.AirpayServiceImpl;
import com.titan.poss.integration.service.impl.RazorpayServiceImpl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PaymentFactory {

	@Autowired
	private AirpayServiceImpl airpayServiceImpl;

	@Autowired
	private RazorpayServiceImpl razorpayServiceImpl;

	public PaymentService getPaymentService(String paymentName) {

		VendorCodeEnum paymentCode = VendorCodeEnum.valueOf(paymentName);
		switch (paymentCode) {
		case PAYMENT_AIRPAY:
			return airpayServiceImpl;
		case PAYMENT_RAZORPAY:
			return razorpayServiceImpl;
		default:
			throw new ServiceException("Type is not registered", "ERR-INT-001", paymentName);

		}
	}

}
