/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class UpdateItemsDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	private Boolean isExcluded;

	private Boolean isActive;

}
