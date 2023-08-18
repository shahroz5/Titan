/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PriceRequest {

//	@NotNull(message = "measuredWeight cannot be null")
//	@Positive(message = "measuredWeight should be greater than 0")
	private BigDecimal measuredWeight;

	private Map<String, StandardPriceResponseDto> standardPrice;
	
	private JsonData tepExceptionDetails ;
}
