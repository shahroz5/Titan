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
public class EventCashMemoDetailsDto {
	
	private String itemCode;

	private Short totalQuantity;

	private BigDecimal unitValue;

	private BigDecimal totalValue;

	private String taxDetails;

	private BigDecimal totalDiscount;

	private String productGroupCode;


}
