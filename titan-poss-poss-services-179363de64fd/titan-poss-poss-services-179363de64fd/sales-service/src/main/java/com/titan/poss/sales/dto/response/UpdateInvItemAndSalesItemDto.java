/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.sales.dto.request.SalesItemDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInvItemAndSalesItemDto {

	private List<UpdateInventoryDto> updateInventoryDtoList;
	private List<SalesItemDto> itemDetailsListToUpdate;
}
