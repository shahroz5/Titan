/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for base OTP
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public abstract class BaseOtpDetails {

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true)
	private String empCode;

}
