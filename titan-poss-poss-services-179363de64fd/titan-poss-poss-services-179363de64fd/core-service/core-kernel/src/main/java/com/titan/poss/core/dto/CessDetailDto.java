/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

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
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CessDetailDto {

	@PatternCheck(regexp = RegExConstants.TAX_CODE_REGEX, message = "Please provide Cess code")
	private String cessCode;

	@DecimalMin(value = "0", inclusive = true, message = "min value of Cess Percentage is 0")
	@DecimalMax(value = "100", inclusive = true, message = "max value of Cess Percentage is 100")
	@Digits(integer = 6, fraction = 3, message = "Cess Percentage valid till 3 decimal places only")
	private BigDecimal cessPercentage;

	@PositiveOrZero(message = "Cess value must be greater than 0")
	private BigDecimal cessValue;

	private Boolean cessOnTax;

}
