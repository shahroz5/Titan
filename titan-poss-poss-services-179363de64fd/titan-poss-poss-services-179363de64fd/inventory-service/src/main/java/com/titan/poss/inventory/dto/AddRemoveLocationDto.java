/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto;

import java.util.List;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AddRemoveLocationDto {
	
	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;
}
