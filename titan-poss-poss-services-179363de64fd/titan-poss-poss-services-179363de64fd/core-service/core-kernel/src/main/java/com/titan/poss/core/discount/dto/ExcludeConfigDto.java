/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ExcludeConfigDto {

	private List<String> itemCodes;
	
	private List<String> themeCodes;
	
	private List<DiscountExcludeComplexityPercentDto> complexityPercent;
	
	private List<DiscountExcludeMcPerGramDto> makingChargePerGram;
}
