/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class MarketRate {
	@NotNull(message = "marketCode can not be null")
	String marketCode;

	@PositiveOrZero
	BigDecimal addAmount;

	@PositiveOrZero
	BigDecimal deductAmount;

}
