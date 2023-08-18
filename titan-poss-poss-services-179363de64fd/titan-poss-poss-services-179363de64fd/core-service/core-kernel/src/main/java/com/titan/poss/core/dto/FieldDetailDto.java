/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import com.titan.poss.core.domain.constant.RegExConstants;
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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class FieldDetailDto {

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_30)
	private String fieldName;

	private String fieldType;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_30)
	private String fieldCode;

	private String fieldRegex;

	private Boolean isMandatory;

}
