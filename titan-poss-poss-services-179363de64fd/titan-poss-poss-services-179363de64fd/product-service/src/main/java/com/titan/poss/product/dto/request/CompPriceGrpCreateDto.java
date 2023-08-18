/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CompPriceGrpCreateDto {

	@NotNull(message = "priceGroup can not be null")
	@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX)
	private String priceGroup;

	@NotNull(message = "complexityCode can not be null")
	@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)
	private String complexityCode;

	@PositiveOrZero
	private BigDecimal makingChargePunit;

	@PositiveOrZero
	private BigDecimal makingChargePgram;

	@PositiveOrZero
	private BigDecimal wastagePct;

	@PositiveOrZero
	private BigDecimal makingChargePct;
}
