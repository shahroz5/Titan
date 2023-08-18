/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ConfigLocationResponseDto {
	
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> overwriteLocations;
	
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;

}
