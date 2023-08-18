/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InventoryBinUpdateDto {
	@NotEmpty(message = "bin transfer items cannot be empty")
	@Size(max = 50, message = "cannot transfer more than 50 items")
	private List<@Valid BinItemDto> binItems;
}
