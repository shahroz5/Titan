/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.TOWN_NAME_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.STATE_NAME_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.PIN_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.CATCHMENT_NAME_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PincodeCreateDto {

	@PatternCheck(regexp = PIN_CODE_REGEX, nullCheck = true)
	private String pinCode;

	@PatternCheck(regexp = CATCHMENT_NAME_REGEX, nullCheck = true)
	private String cachementArea;

	@PatternCheck(regexp = TOWN_NAME_REGEX, nullCheck = true)
	private String townName;

	@PatternCheck(regexp = STATE_NAME_REGEX, nullCheck = true)
	private String stateName;

	@PatternCheck(regexp = COUNTRY_CODE_REGEX, nullCheck = true)
	private String countryCode;

	private Boolean isActive;
}
