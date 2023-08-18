/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250;
import static com.titan.poss.core.domain.constant.RegExConstants.TAX_CLASS_CODE_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaxClassDto {

	@PatternCheck(regexp = TAX_CLASS_CODE_REGEX, nullCheck = true)
	private String taxClassCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String description;

	private Boolean isActive;
}
