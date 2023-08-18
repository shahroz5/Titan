/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.Min;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.UserLimitCheck;

import lombok.Data;

/**
 * DTO class for role changing request body containing which role and how many
 * request for that role
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RoleLimitReqDto {

	@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true)
	private String roleCode;

	@Min(1)
	@UserLimitCheck
	private Short reqValue;

}
