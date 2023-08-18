/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO Class for approval request item details response
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ApprovalRequestItemDto extends BaseStockItemDto {
	private Short requestedQuantity;
	private BigDecimal requestedWeight;
	private Short acceptedQuantity;
	private Short approvedQuantity;
	private Short availableQuantity;
	private String inventoryId;
	private Short totalApprovedQuantity;

}
