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
public class FocProductDto {
	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	String id;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	String schemeMasterId;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	String schemeDetailsId;

	String productGroupCode;

	String category;
	
	String itemType;
}
