/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Stock Details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class StockItemDto extends BaseStockItemDto {
	private Short availableQuantity; // inventory total quantity
	private BigDecimal availableWeight; // inventory total weight
	private BigDecimal availableValue; // inventory total value
	private Short measuredQuantity; // details total quantity
	private BigDecimal measuredWeight; // details total weight
	private BigDecimal measuredValue; // details total value
	private BigDecimal stdValue; // inventory item value == inventory std value
	private BigDecimal stdWeight;// inventory item weight == inventory std weight
	private String orderType;
	private Boolean isHallmarked;
}
