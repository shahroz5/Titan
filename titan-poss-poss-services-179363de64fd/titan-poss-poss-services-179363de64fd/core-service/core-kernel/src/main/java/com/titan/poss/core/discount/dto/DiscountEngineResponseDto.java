/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountEngineResponseDto {

	private String clubbingId;

	private List<DiscountDetailsResponseDto> discountDetailsResponseDto;

	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;
}
