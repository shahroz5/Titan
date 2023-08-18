package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryItemDtoExt extends BaseStockItemDto {
	private BigDecimal availableWeight;
	private BigDecimal availableValue;
	private Short availableQuantity;
	private Boolean isHallmarked;
	private Boolean isBinToBinAllowed;
	private Integer fileId;
}
