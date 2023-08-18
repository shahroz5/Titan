/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import org.springframework.lang.Nullable;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountAddRulesDto {

	@Nullable
	private String type1DiscountCode;

	@Nullable
	private String type2DiscountCode;

	@Nullable
	private String type3DiscountCode;
}
