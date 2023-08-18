/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller.test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.integration.controller.PaymentController;
import com.titan.poss.integration.service.PaymentService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RunWith(MockitoJUnitRunner.class)
@DisplayName("PaymentController Test cases")
public class PaymentControllerTest {

	@InjectMocks
	private PaymentController paymentController;

	@Mock
	private PaymentService paymentService;

	@Test
	@DisplayName("(PaymentControllerTest) create payment link succesfully")
	public void testCreatePaymentLink() {

		when(paymentService.createPayment(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123", getTestPaymentRequestDto()))
				.thenReturn(getTestPaymentCreateResponseDto());

		PaymentCreateResponseDto createPaymentLink = paymentController
				.createPaymentLink(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123", getTestPaymentRequestDto());
		assertEquals("success", createPaymentLink.getStatus());
	}

	/**
	 * @return
	 */
	private PaymentCreateResponseDto getTestPaymentCreateResponseDto() {
		PaymentCreateResponseDto paymentCreateResponseDto = new PaymentCreateResponseDto();
		paymentCreateResponseDto.setStatus("success");
		return paymentCreateResponseDto;
	}

	@Test
	@DisplayName("(PaymentControllerTest) verify Payment Test succesfully")
	public void testVerifyPayment() {
		when(paymentService.verifyPaymentStatus(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123"))
				.thenReturn(getTestPaymentverifyResponseDto());

		PaymentVerifyResponseDto verifyPaymentStatus = paymentController
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123");
		assertEquals("100", verifyPaymentStatus.getAmount());
	}

	@Test
	@DisplayName("(PaymentControllerTest) resend Payment Test succesfully")
	public void testResendPayment() {
		String testTransactionId = "plink_H4cTsgy166eDsi";
		when(paymentService.resendPaymentRequest(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), testTransactionId, "email")).thenReturn(true);

		Boolean resendPaymentStatus = paymentController
				.resendPaymentLink(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), testTransactionId, "email");
		assertEquals(true, resendPaymentStatus);
	}

	/**
	 * @return
	 */
	private PaymentVerifyResponseDto getTestPaymentverifyResponseDto() {
		PaymentVerifyResponseDto paymentVerifyResponseDto = new PaymentVerifyResponseDto();
		paymentVerifyResponseDto.setAmount("100");
		return paymentVerifyResponseDto;
	}

	private PaymentRequestDto getTestPaymentRequestDto() {
		PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
		paymentRequestDto.setAmount("100");
		return paymentRequestDto;
	}
}
