/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class FocItemMappingDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String schemeId;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String itemCode;
}
