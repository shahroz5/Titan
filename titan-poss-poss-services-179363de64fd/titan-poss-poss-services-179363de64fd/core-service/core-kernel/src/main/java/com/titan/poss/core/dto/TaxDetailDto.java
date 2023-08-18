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
public class TaxDetailDto {

	@PatternCheck(regexp = RegExConstants.TAX_CODE_REGEX, message = "Please provide Tax code")
	private String taxCode;

	@PositiveOrZero(message = "Tax value must be greater than 0")
	private BigDecimal taxPercentage;

	@DecimalMin(value = "0", inclusive = true, message = "min value of Tax Percentage is 0")
	@DecimalMax(value = "100", inclusive = true, message = "max value of Tax Percentage is 100")
	@Digits(integer = 6, fraction = 3, message = "Tax Percentage valid till 3 decimal places only")
	private BigDecimal taxValue;

}
