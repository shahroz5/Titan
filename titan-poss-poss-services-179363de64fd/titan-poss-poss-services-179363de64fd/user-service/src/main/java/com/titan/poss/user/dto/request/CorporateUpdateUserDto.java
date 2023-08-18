/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * DTO class for update a corporate employee details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CorporateUpdateUserDto extends BaseUpdateUserDto {

	// PENDING_TASK
//	Add location for supporting location change
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> updatedLocations;
	
	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;
}
