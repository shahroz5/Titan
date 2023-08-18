/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.dto.constants.SalesOtpTypeEnum;
import com.titan.poss.sales.service.OtpService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@PreAuthorize(IS_STORE_USER)
@RestController("salesOTPController")
@RequestMapping(value = "sales/v2/otp")
@Validated
public class OtpController {

	@Autowired
	private OtpService otpService;

	// @formatter:off
	private static final String OTP_PERMISSION = 
			   "hasPermission(#otpType,'CN')" + AND + START + SalesAccessControls.GRF_MERGE + END 
			 + OR 
			 + "hasPermission(#otpType,'GHS')" + OR + "hasPermission(#otpType,'CUSTOMER')" + OR + "hasPermission(#otpType,'PAN')" + OR + "hasPermission(#otpType,'CUST_SIGNATURE_OTP')" + OR + "hasPermission(#otpType,'EMPLOYEELOAN')" + AND + " ( " 
			 + START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_ADD_EDIT + END + OR 
			 + START + SalesAccessControls.CASH_MEMO_PAYMENT_ADD_EDIT + END + OR 
			 + START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END + ")";// pending: ADV and GRF
	// @formatter:on

	@PostMapping
	// @formatter:off
	@ApiOperation(value = "API to send OTP to customer of the note/ account", notes = "<span style=\"font-weight: bold;font-size:14px;\">OTP Type:</span><br>"
			+ "<ul>" 
			+ "	<li>CN</li>" 
			+ "	<li>GHS</li>" 
			+ "	<li>CUSTOMER</li>" 
			+ "	<li>PAN</li>" 
			+ "	<li>CUST_SIGNATURE_OTP</li>" 
			+ "	<li>EMPLOYEELOAN</li>" 
			+ "</ul>")
	// @formatter:on
	@PreAuthorize(OTP_PERMISSION)
	public void sendOTP(
			@RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(name = "fileType", required = false) String fileType,
			@ApiParam(name = "otpType", value = "Provide 'otpType' for the otp generation", allowableValues = "CN, GHS,CUSTOMER, PAN,CUST_SIGNATURE_OTP,EMPLOYEELOAN", required = true) @RequestParam(name = "otpType", required = true) @ValueOfEnum(enumClass = SalesOtpTypeEnum.class) String otpType) {
		otpService.sendOTP(id, fileType, otpType);
	}

	@PutMapping
	// @formatter:off
	@ApiOperation(value = "API to valdate OTP sent to customer of the note/ account", notes = " This API takes token as input & verify if OTP provided is correct or not.<br>"
			+ "If success this API will return 200 without any response.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">OTP Type:</span><br>" 
			+ "<ul>" 
			+ "	<li>CN</li>"
			+ "	<li>GHS</li>" 
			+ "	<li>CUSTOMER</li>" 
			+ "	<li>PAN</li>" 
			+ "	<li>CUST_SIGNATURE_OTP</li>" 
			+ "	<li>EMPLOYEELOAN</li>" 
			+ "</ul>")
	// @formatter:on
	@PreAuthorize(OTP_PERMISSION)
	public void validateOTP(
			@RequestParam(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "otpType", value = "Provide 'otpType' for the otp validation", allowableValues = "CN, GHS,CUSTOMER, PAN,CUST_SIGNATURE_OTP,EMPLOYEELOAN", required = true) @RequestParam(name = "otpType", required = true) @ValueOfEnum(enumClass = SalesOtpTypeEnum.class) String otpType,
			@RequestParam(name = "token", required = true) String token) {

		otpService.validateOTP(id, otpType, token);
	}

}
