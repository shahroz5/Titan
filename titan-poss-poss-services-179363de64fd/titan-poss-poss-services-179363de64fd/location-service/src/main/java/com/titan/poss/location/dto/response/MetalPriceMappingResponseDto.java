/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import java.math.BigDecimal;

import javax.validation.constraints.Pattern;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceMappingResponseDto extends MetalPriceMappingBaseDto {

//	@NotNull(message = "Please provide the addAmount")
	@Pattern(regexp = "^[0-9]+$", message = "Invalid addAmount")
	private BigDecimal addAmount;

//	@NotNull(message = "Please provide the deductAmount")
	@Pattern(regexp = "^[0-9]+$", message = "Invalid deductAmount")
	private BigDecimal deductAmount;

	private BigDecimal markupFactor;

}
