/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.EmailIdValidationResponseDto;
import com.titan.poss.core.enums.EmailIdVerificationEnum;
import com.titan.poss.integration.service.EmailIdValidationService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("IntegrationEmailIdValidationController")
@RequestMapping("integration/v2/email-validation")
public class EmaiIdValidationController {
	
	@Autowired
	private EmailIdValidationService emailIdValidationService;
	
	@ApiOperation(value = "EmailId Validation", notes = "This API will send details to Email service to validate EmailId")
	@PostMapping(value = "")
	public EmailIdValidationResponseDto verifyEmailId (
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used" , allowableValues = "EMAIL_VALIDATION_TITAN", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "verificationType", value = "type of the verification", allowableValues = "EMAIL", required = true) @RequestParam(name = "verificationType", required = true) @ValueOfEnum(enumClass = EmailIdVerificationEnum.class) String verificationType,
			@ApiParam(name = "emailId", value = "EmailId to verify", required = false) @RequestParam(name = "emailId", required = false) String emailId) {

		return emailIdValidationService.verifyEmailId(vendorCode, verificationType, emailId);
	}

}
