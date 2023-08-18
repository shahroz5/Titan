/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.location.dto.constants.TaxSystemEnum;
import lombok.Data;

import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255;
import static com.titan.poss.core.domain.constant.RegExConstants.TAX_CODE_REGEX;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TaxDto {

	@PatternCheck(regexp = TAX_CODE_REGEX, nullCheck = true)
	private String taxCode;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true)
	private String description;

	private Boolean isActive;

	@ValueOfEnum(enumClass = TaxSystemEnum.class)
	private String taxSystem;

}
