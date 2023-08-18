/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class IssueStockTransferItemUpdateDto {
	@PositiveOrZero
	@NotNull
	private Short measuredQuantity;

	private String inventoryId;

}
