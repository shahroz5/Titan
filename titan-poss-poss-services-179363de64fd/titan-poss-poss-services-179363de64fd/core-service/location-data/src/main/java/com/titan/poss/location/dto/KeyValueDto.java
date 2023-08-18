/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.location.dto;


import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_VALUE_REGEX;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class KeyValueDto {

	@PatternCheck(regexp = LOCATION_LOV_CODE_REGEX)
	private String code;

	@PatternCheck(regexp = LOCATION_LOV_VALUE_REGEX)
	private String value;

	@NotNull(message = "Please provide the isActive")
	private Boolean isActive;

}
