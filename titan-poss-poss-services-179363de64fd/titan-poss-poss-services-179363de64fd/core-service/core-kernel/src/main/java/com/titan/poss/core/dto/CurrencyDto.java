/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_50;

import java.util.Date;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CurrencyDto {

	@PatternCheck(regexp = CURRENCY_CODE_REGEX, nullCheck = true)
	private String currencyCode;

	@Size(min = 1, max = 4)
	private String currencySymbol;

	@PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_50, nullCheck = true)
	private String description;

	private String unicode;

	private String image;

	private Boolean isActive;

	private Date lastModifiedDate;
}
