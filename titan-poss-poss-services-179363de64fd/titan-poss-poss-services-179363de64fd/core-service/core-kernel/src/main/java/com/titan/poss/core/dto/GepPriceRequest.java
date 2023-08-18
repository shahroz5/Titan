/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class GepPriceRequest extends PriceRequest {

	@PatternCheck(regexp = RegExConstants.METAL_TYPE_REGEX, nullCheck = true)
	private String metalType;

	@PatternCheck(regexp = RegExConstants.GEP_ITEM_TYPE_REGEX, nullCheck = true)
	private String itemType;

	@Positive(message = "measuredPurity should be more than 0")
	@NotNull(message = "measuredPurity cannot be null")
	@Digits(integer = 6, fraction = 7, message = "measuredPurity valid till 7 decimal places only")
	private BigDecimal measuredPurity;

}
