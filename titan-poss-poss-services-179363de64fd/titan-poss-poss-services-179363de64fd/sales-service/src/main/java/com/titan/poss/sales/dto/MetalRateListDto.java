/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.Map;

import javax.validation.Valid;

import com.titan.poss.core.dto.StandardPriceResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetalRateListDto {

	Map<String, @Valid StandardPriceResponseDto> metalRates;
}
