/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;

import javax.validation.Valid;
import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RuleRangeDto {

	@Valid
	private List<AddRuleRangeDto> addRangeConfigs;
	
	@Valid
	private List<UpdateRuleRangeDto> updateRangeConfigs;

	@Valid
	private List< @PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeRangeConfigs;
}
