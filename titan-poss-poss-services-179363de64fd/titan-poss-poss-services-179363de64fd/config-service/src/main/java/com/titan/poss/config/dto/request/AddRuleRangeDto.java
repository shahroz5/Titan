/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

@Data
public class AddRuleRangeDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String rangeId; 
	
	private String metalType;

	private JsonData rangeDetails;
	
	private Integer rowId;

}
