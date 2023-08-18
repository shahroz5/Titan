/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class SlabConfig {

	private String id;
	private BigDecimal minValue;
	private BigDecimal maxValue;
	private RegularCategoryDetails regularDiscountComponent;
	private RegularCategoryDetails previewDiscountComponent;
	private RegularCategoryDetails abDiscountComponent;
	private RegularCategoryDetails coDiscountComponent;
}
