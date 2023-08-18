/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AddItemStoneMappingDto {

	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX)
	private String stoneCode;

	private Short noOfStones;

	private Boolean isActive;
}
