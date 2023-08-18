/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Data
public class RuleMasterDto {

	@NotNull
	@Size(min = 1, max = 100)
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	private Boolean isActive;
	
	private JsonData ruleDetails;


}

