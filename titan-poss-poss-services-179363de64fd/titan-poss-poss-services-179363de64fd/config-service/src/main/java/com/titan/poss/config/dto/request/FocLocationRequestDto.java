/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.Set;

import javax.validation.Valid;

import com.titan.poss.config.dto.FocValidityDto;
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
public class FocLocationRequestDto {

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	@Valid
	private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> updateLocations;
	
	private String mobileNo;

	private FocValidityDto validity;
	
	private JsonData configDetails;
	
	private Set<String> removeLocations;
	
}
