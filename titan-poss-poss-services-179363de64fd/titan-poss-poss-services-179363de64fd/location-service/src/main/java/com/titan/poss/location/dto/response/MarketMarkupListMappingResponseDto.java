/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MarketMarkupListMappingResponseDto {

	String metalTypeCode;

	String market;

	BigDecimal markupFactor;

	@NotNull(message = "Please provide the marketCode")
	@Pattern(regexp = "^[0-9]+$", message = "Invalid addAmount")
	BigDecimal addAmount;

	@NotNull(message = "Please provide the marketCode")
	@Pattern(regexp = "^[0-9]+$", message = "Invalid deductAmount")
	BigDecimal deductAmount;
}
