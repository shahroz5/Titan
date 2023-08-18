/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CutPieceMetalDetailsDto extends BaseFieldsValidator {

	@NotNull(message = "goldWeight cannot be null")
	@PositiveOrZero(message = "goldWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "goldWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal goldWeight;

	@NotNull(message = "platinumWeight cannot be null")
	@PositiveOrZero(message = "platinumWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "platinumWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal platinumWeight;

	@NotNull(message = "silverWeight cannot be null")
	@PositiveOrZero(message = "silverWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "silverWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal silverWeight;

	@NotNull(message = "stoneWeight cannot be null")
	@PositiveOrZero(message = "stoneWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "stoneWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal stoneWeight;

	@NotNull(message = "materialWeight cannot be null")
	@PositiveOrZero(message = "materialWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "materialWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal materialWeight;

	@NotNull(message = "diamondWeight cannot be null")
	@PositiveOrZero(message = "diamondWeight should be more than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "diamondWeight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal diamondWeight;
}
