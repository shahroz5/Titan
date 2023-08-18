/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.user.validator.CheckLocationConstraint;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * DTO class for add a corporate employee details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@CheckLocationConstraint
@ToString(callSuper = true)
public class CorporateAddUserDto extends BaseAddUserDto {

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false)
	private String locationCode;

	@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX, nullCheck = false)
	private String regionCode;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> addLocations;

}
