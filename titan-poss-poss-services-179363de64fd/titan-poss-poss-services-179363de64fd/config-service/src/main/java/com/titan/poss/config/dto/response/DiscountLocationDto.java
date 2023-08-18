/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.config.dto.request.DiscountLocationValidityDto;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountLocationDto {
	
	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;
	
	private Boolean status;
	
	private DiscountLocationValidityDto validity;

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = false) String> updateLocations;

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = false) String> removeLocations;
	
	private JsonData configDetails;

}
