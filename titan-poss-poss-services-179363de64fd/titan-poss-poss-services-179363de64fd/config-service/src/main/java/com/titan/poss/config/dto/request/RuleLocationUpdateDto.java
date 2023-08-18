/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.constant.RegExConstants;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
public class RuleLocationUpdateDto {

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> overwriteLocations;
	
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;
	
	private RuleLocationValidityDto validity;

}
