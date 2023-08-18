/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentService {

	PaymentCreateResponseDto createPayment(String vendorCode, String paymentId, PaymentRequestDto paymentRequestDto);

	PaymentVerifyResponseDto verifyPaymentStatus(String vendorCode, String transactionId);

	boolean resendPaymentRequest(String vendorCode, String transactionId, String notifyBy);

}
