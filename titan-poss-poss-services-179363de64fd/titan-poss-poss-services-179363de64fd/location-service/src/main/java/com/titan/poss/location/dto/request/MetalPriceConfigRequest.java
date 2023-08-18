/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceConfigRequest extends MetalPriceConfigRequestDto {

	@NotNull(message = "PriceType can not be null")
	private String priceType;

	@Positive
	private BigDecimal basePrice;

	@NotNull(message = "MetalTypeCode can not be null")
	private String metalTypeCode;

}
