/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO Class for other request item details response
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OtherRequestItemDto extends StockItemDto {
	private String remarks;
	private String inventoryId;
	private BigDecimal totalTax;
	private BigDecimal finalValue;
}
