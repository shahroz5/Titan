/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;
	
	@NotNull(message = "Please provide Weight")
	@Positive(message = "Measured Weight must be positive")
	@Digits(integer = 6, fraction = 3, message = "Measured Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal stdWeight;

	@NotNull(message = "Please provide Karatage")
	@Positive(message = "Karatage must be positive")
	private BigDecimal karatage;
	
}
