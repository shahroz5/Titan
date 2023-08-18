/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto.response;

import java.util.List;

import com.titan.poss.location.dto.request.MarketMarkupFactors;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MarketMarkupMappingResponseDto {

	List<MarketMarkupFactors> marketMarkupFactors;

	String marketCode;
}
