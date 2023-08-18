/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.location.dto.constants.TaxSystemEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaxUpdateDto {

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String description;

	@ValueOfEnum(enumClass = TaxSystemEnum.class)
	private String taxSystem;

	private Boolean isActive;
}
