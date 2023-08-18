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
public class StateUpdateDto {

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String description;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX)
	private String countryCode;

	@PatternCheck(regexp = STATE_CODE_REGEX)
	private String stateCode;

	private Object configDetails;

	private Boolean isActive;

	private Boolean isUnionTerritory;
}
