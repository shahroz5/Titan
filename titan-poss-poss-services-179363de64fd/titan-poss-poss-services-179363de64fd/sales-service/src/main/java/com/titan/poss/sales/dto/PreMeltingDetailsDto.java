/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreMeltingDetailsDto {

	@NotNull(message = "Please provide Weight")
	@Positive(message = "Measured Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Measured Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal weight;

	@NotNull(message = "Please provide Purity")
	@Positive(message = "Purity must be positive")
	@Digits(integer = 6, fraction = 7, message = "Purity valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal purity;

	@NotNull(message = "Please provide Karatage")
	@Positive(message = "Karatage must be positive")
	private BigDecimal karatage;
}
