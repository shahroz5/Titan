/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class BaseStoneDetails {

	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX, nullCheck = true)
	private String stoneCode;

	@NotNull(message = "measuredNoOfStones should not be null")
	@PositiveOrZero(message = "measuredNoOfStones should be not less than 0")
	private Short measuredNoOfStones;

	private BigDecimal measuredStoneWeight;
}

