/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StockIssueStockConfirmDto extends IssueConfirmDto {

	@NotNull(message = "carrier detail cannot be null")
	private JsonData carrierDetails;

}
