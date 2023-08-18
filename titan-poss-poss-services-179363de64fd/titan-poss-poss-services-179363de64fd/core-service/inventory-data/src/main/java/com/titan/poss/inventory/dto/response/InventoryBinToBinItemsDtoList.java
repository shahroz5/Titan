package com.titan.poss.inventory.dto.response;

import java.util.List;

import com.titan.poss.core.response.PagedRestResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryBinToBinItemsDtoList {
  
	private List<String> invalidItems;
	private List<String> notInStock;
	private PagedRestResponse<List<InventoryItemDtoExt>> items;
}
