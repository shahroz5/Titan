/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.response;

import com.titan.poss.config.dto.constants.LovTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

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
public class LovCreateDto {

	@ValueOfEnum(enumClass = LovTypeEnum.class)
	private String lovType;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50, nullCheck = true)
	private String code;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50, nullCheck = true)
	private String value;

}
