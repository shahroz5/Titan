/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.report.dto.request.UserTemplatesRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class UserTemplatesDto extends UserTemplatesRequestDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String reportMasterId;
}
