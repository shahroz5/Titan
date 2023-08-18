/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250;
import static com.titan.poss.core.domain.constant.RegExConstants.STATE_CODE_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StateCreateDto {

	@PatternCheck(regexp = STATE_CODE_REGEX, nullCheck = true)
	private String stateCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX, nullCheck = true)
	private String countryCode;

	private Object configDetails;

	private Boolean isActive;

	private Boolean isUnionTerritory;
}
