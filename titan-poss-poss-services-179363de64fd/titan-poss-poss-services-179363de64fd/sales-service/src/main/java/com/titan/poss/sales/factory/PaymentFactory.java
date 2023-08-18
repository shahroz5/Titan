/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.service.PaymentService;
import com.titan.poss.sales.utils.SalesUtil;

/**
 * Factory for different payment implementations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentFactory {

	private Map<String, PaymentService> paymentServiceBeans;

	public PaymentFactory() {
		paymentServiceBeans = new HashMap<>();
	}

	public void registerPaymentService(String paymentCode, PaymentService paymentService) {
		paymentServiceBeans.put(paymentCode, paymentService);
	}

	/**
	 * This method returns respective service for implementation based on
	 * paymentCode. NOTE :- register respective payment services in constructors of
	 * respective impl classes.
	 * 
	 * @param paymentCode
	 * @return PaymentService
	 */
	public PaymentService getPaymentService(String paymentCode, String paymentGroup) {

		String paymentCodeToCallService = paymentCode;

		// if WALLET or BANK_LOAN is the payment group then, assign WALLET or BANK_LOAN
		// to paymentCodeToCallService variable to call wallet or bank loan service
		if (SalesUtil.isPaymentGroupToBeConsidered(paymentGroup))
			paymentCodeToCallService = paymentGroup;

		if (paymentServiceBeans.containsKey(paymentCodeToCallService)
				&& paymentServiceBeans.get(paymentCodeToCallService) != null)

		{
			return paymentServiceBeans.get(paymentCodeToCallService);
		}

		throw new ServiceException(SalesConstants.INVALID_PAYMENT_CODE, SalesConstants.ERR_SALE_015,
				"Payment code: " + paymentCode + ", not found");

	}

}
