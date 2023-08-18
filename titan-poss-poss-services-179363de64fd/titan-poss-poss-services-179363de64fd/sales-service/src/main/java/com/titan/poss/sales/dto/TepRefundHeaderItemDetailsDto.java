/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class TepRefundHeaderItemDetailsDto {

	private String itemCode;

	private Boolean isCmAvailable;

	private Boolean isSaleable;

	private Object priceDetails;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;
	
	private BigDecimal totalTax;
	
	private Object	 taxDetails;
	
	private BigDecimal finalValue;
}
