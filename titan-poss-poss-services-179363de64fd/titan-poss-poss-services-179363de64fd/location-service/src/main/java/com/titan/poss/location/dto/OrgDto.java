/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class OrgDto {

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX, nullCheck = true)
	private String orgCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String parentOrgCode;

	private Boolean isActive;

}
