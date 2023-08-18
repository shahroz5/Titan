/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.integration.service.PaymentService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationPaymentController")
@RequestMapping(value = "integration/v2/payment")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	// @formatter:off
	@ApiOperation(value = "Create payment link using third party", notes = "This API will create payment link and send it to the customer using third party."
			 + "<br>" + "Payment link will be sent to the mobile number and email id of the customer if provided."
			 + "<br>" + "NOTE:"
			 		+ "<ul>"
			 		+ " <li>If the transaction id is present in the request body, it will be considered as resend otherwise it is a fresh transaction(transactionId = null).</li>" 
			 		+ " <li>Payment id should be UUID</li>"
			 		+ " </ul><br>" )
		
	// @formatter:on
	@PostMapping(value = "")
	public PaymentCreateResponseDto createPaymentLink(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAYMENT_AIRPAY, PAYMENT_RAZORPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "paymentId", value = "paymentId", required = true) @RequestParam(name = "paymentId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid payment id", nullCheck = true) String paymentId,
			@ApiParam(name = "body", value = "Payment request dto", required = true) @RequestBody @Valid PaymentRequestDto paymentRequestDto) {

		return paymentService.createPayment(vendorCode, paymentId, paymentRequestDto);
	}

	// @formatter:off
	@ApiOperation(value = "Verify payment status with third party", notes = "This API will verify the payment status with third party"
            + "<br>" + "Different response codes are:"
            + "<ul>"
            + "<li>Success - 200</li>"
            + "<li>Transaction in Process - 211</li>"
            + "<li>Failed - 400</li>"
            + "<li>Dropped - 401</li>"
            + "<li>Cancel - 402</li>"
            + "<li>Incomplete - 403</li>"
            + "<li>Bounced - 405</li>"
            + "<li>No Records - 503</li>"
            + "</ul><br>" )
	// @formatter:on
	@GetMapping
	public PaymentVerifyResponseDto verifyPaymentStatus(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAYMENT_AIRPAY, PAYMENT_RAZORPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "transactionId", value = "Transaction Id", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {

		return paymentService.verifyPaymentStatus(vendorCode, transactionId);
	}

	@ApiOperation(value = "Resend payment link", notes = "This API will resend the payment link from third party by sma or email")
	@GetMapping("/resend")
	public boolean resendPaymentLink(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAYMENT_RAZORPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "transactionId", value = "Transaction Id", required = true) @RequestParam(name = "transactionId", required = true) String transactionId,
			@ApiParam(name = "notifyBy", value = "Notify By", allowableValues = "email, sms", required = true) @RequestParam(name = "notifyBy", required = true) String notifyBy) {

		return paymentService.resendPaymentRequest(vendorCode, transactionId, notifyBy);
	}
}
