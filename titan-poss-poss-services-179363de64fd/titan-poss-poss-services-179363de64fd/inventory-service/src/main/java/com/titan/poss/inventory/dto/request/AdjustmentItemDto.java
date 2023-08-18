/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AdjustmentItemDto {
	private String inventoryId;
	private Short totalQuantity;
	private BigDecimal totalValue;
	private BigDecimal totalWeight;
}
