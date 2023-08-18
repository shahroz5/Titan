/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryItemDto extends BaseStockItemDto {
	private BigDecimal availableWeight;
	private BigDecimal availableValue;
	private Short availableQuantity;
}
