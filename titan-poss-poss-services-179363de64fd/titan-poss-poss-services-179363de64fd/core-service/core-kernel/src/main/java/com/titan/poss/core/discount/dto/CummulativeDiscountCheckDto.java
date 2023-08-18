/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for cummulative discounts validation...................................
 * <b>NOTE: </b> In the map 'discountTypeAndIdAppliedOnItem' keep Slab/High
 * Value/Best deal discount only.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CummulativeDiscountCheckDto {

	private BigDecimal totalDiscount;
	private Map<String, String> discountTypeAndIdAppliedOnItem; // keep Slab/High Value/Best deal discount only in this
																// field
	private Boolean isExclude;
}