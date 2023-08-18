/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class InventoryBinDto {
	String name;
	Long products;
	BigDecimal totalValue;
	BigDecimal totalWeight;
	String currencyCode;
	String weightUnit;
	String description;

	public InventoryBinDto(String name, Long products, BigDecimal totalValue, BigDecimal totalWeight,
			String currencyCode) {
		super();
		this.name = name;
		this.products = products;
		this.totalValue = totalValue;
		this.totalWeight = totalWeight;
		this.currencyCode = currencyCode;
	}
}
