/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.util.Set;


import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BinLocationDto {

	private Set<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCodes;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;

}

