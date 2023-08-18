/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.TAX_CLASS_CODE_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class AddStateTaxDetailsDto {

	@PatternCheck(regexp = TAX_CLASS_CODE_REGEX, nullCheck = true)
	private String taxClassCode;

	private Object taxDetails;

}
