package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryItemDtoList {

	private List<InventoryItemDto> items;
	private List<String> invalidItems;
	private List<String> notInStock;
	private Long totalQuantity;
	private BigDecimal totalValue;
	private Long binToBinAllowedtotalQuantity;
	private BigDecimal binToBinAllowedtotalValue;
	private Long binToBinAllowedtotalItems;

	public InventoryItemDtoList(Long quan, BigDecimal val,Long prod) {
		this.totalQuantity = quan;
		this.totalValue = val;
		this.binToBinAllowedtotalItems=prod;
	}

}
