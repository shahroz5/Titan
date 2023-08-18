/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250;
import static com.titan.poss.core.domain.constant.RegExConstants.ORG_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RegionDto {

	@PatternCheck(regexp = REGION_CODE_REGEX, nullCheck = true)
	private String regionCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	private Object configDetails;

	@PatternCheck(regexp = REGION_CODE_REGEX)
	private String parentRegionCode;

	@PatternCheck(regexp = ORG_CODE_REGEX, nullCheck = true)
	private String orgCode;

	private Boolean isActive;
}
