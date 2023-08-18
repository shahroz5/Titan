/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.user.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class KeyValueDto {

	@PatternCheck(regexp = RegExConstants.USER_LOV_CODE_REGEX, nullCheck = true)
	private String code;

	@PatternCheck(regexp = RegExConstants.USER_LOV_VALUE_REGEX, nullCheck = true)
	private String value;

	@NotNull(message = "Please provide the isActive")
	private Boolean isActive;
}
