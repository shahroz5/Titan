/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO Class for stock request item details response
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class StockRequestItemDto extends BaseStockItemDto {
	private Short requestedQuantity;
	private BigDecimal requestedWeight;
	private Short acceptedQuantity;
	private Short approvedQuantity;
	private Short availableQuantity;
	private String inventoryId;
	private Short totalAcceptedQuantity;

}
