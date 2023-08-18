/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_LOV_VALUE_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.location.dto.constants.LovTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LovCreateDto {

    @ValueOfEnum(enumClass = LovTypeEnum.class)
	private String lovType;

    @PatternCheck(regexp = LOCATION_LOV_CODE_REGEX, nullCheck = true)
	private String code;

    @PatternCheck(regexp = LOCATION_LOV_VALUE_REGEX, nullCheck = true)
	private String value;

}
