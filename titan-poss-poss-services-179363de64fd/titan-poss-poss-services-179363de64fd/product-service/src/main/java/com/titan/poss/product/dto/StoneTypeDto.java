/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StoneTypeDto {

	@NotNull(message = "Please provide the stoneTypeCode")
	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String description;

	private Object configDetails;

	private Boolean isActive;
}
