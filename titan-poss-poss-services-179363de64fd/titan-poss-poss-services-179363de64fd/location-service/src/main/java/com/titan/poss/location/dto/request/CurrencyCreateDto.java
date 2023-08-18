/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CurrencyCreateDto {

	@PatternCheck(regexp = CURRENCY_CODE_REGEX, nullCheck = true)
	private String currencyCode;

	@NotBlank
	@Size(min = 1, max = 4)
	private String currencySymbol;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, nullCheck = true)
	private String description;

	private String image;

	private Boolean isActive;
}
