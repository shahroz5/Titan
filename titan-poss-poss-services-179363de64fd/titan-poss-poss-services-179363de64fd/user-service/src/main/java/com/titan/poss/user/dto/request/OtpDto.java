/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Base DTO class for Update Passwrod Details on OTP
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpDto {

	@Size(min = 1, max = 6, message = "OTP Length should be min {min} & max {max}")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, message = RegExConstants.REGEX_MSG, nullCheck = true)
	private String otp;

}
