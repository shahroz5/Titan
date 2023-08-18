package com.titan.poss.inventory.dto;

import lombok.Data;

@Data
public class InventoryItemsToRemove {
	private String itemCode;
	private String lotNumber;
	private Short quantity;

}
