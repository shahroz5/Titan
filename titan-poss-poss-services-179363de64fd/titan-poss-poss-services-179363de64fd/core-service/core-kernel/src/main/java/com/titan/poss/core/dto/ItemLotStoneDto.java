/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemLotStoneDto extends ItemLotStoneBaseDto {

	// Stone value after applying deduction
	private BigDecimal finalStoneValue;

	private BigDecimal deductionValue;

	private Short measuredNoOfStones;

	// Before Deduction Stone Value
	private BigDecimal stdValue;

	// used for measured number of stones.
	private BigDecimal measuredValue;

	private BigDecimal totalStoneWeight;

	private BigDecimal stoneDeductionPercentage;

}
