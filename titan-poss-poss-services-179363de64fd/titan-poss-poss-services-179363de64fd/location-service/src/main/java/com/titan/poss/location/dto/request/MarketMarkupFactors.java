/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.location.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MarketMarkupFactors {

	@ValueOfEnum(enumClass = MetalTypeCodeEnum.class)
	private String metalTypeCode;

	@NotNull(message = "Please provide the markupFactor")
	private BigDecimal markupFactor;

	@NotNull(message = "Please provide the addAmount")
	private BigDecimal addAmount;

	@NotNull(message = "Please provide the deductAmount")
	private BigDecimal deductAmount;

}
