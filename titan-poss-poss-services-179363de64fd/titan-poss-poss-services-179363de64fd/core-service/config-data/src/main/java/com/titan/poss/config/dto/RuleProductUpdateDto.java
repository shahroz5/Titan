/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.Set;

import com.titan.poss.core.domain.validator.PatternCheck;
import javax.validation.Valid;
import com.titan.poss.core.domain.constant.RegExConstants;
import lombok.Data;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RuleProductUpdateDto {
	
	@Valid
	private Set<AddRuleProductDto> addProducts;
	
	@Valid
	private Set<UpdateRuleProductDto> updateProducts;

	@Valid
	private Set< @PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeProducts;
	
}
