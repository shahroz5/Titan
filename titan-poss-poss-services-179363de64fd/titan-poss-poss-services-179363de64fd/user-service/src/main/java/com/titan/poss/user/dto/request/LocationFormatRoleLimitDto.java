/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.dto.constants.LocationFormatEnum;
import com.titan.poss.user.validator.UserLimitCheck;

import lombok.Data;

/**
 * DTO class to assign user limit for role creation request body containing
 * which location format and how many request for that location format
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationFormatRoleLimitDto {

	@NotNull
	@ValueOfEnum(enumClass = LocationFormatEnum.class)
	private String locationFormat;

	@UserLimitCheck
	private Short userLimit;

}
