/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class BaseGepItemDetailsDto {

	@PatternCheck(regexp = RegExConstants.METAL_TYPE_REGEX, nullCheck = true)
	private String metalType;

	@PatternCheck(regexp = RegExConstants.GEP_ITEM_TYPE_REGEX, nullCheck = true)
	private String itemType;

	@NotNull(message = "Please provide Measured Weight")
	@Positive(message = "Measured Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Measured Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal measuredWeight;

	@NotNull(message = "Please provide Measured Purity")
	@Positive(message = "Measured Purity must be positive")
	@Digits(integer = 6, fraction = 7, message = "Measured Purity valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal measuredPurity;

	@NotNull(message = "Please provide Value")
	@Positive(message = "Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal unitValue;

	private PreMeltingDetailsDto preMeltingDetails;

	@NotNull(message = "Please provide karat")
	@DecimalMin(value = "0", inclusive = true, message = "min value of karat is 0")
	@DecimalMax(value = "24", inclusive = true, message = "max value of karat is 24")
	@Digits(integer = 6, fraction = 3, message = "Karat valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal karat;
}
