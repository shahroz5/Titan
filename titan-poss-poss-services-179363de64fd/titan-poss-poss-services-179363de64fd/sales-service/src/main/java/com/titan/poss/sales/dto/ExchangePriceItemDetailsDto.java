/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class ExchangePriceItemDetailsDto extends GepItemDetailsDto {

	private GepPriceResponseDto gepPriceDetails;

	private TepPriceResponseDto tepPriceDetails;
	// TEP goes here private priceDetails
}
