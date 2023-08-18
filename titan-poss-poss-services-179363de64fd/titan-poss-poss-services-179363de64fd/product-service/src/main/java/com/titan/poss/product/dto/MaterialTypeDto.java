/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MaterialTypeDto {

	@PatternCheck(regexp = RegExConstants.MATERIAL_TYPE_CODE_REGEX, nullCheck = true)
	private String materialTypeCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_250, nullCheck = true)
	private String description;

	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX)
	private String orgCode;

	private Boolean isActive;
}
