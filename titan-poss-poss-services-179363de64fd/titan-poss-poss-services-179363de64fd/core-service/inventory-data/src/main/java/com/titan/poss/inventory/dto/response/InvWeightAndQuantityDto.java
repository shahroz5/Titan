/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to mainly get total quantity and inventory weight.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvWeightAndQuantityDto {

	private Long totalQuantity;
	private BigDecimal inventoryWeight;
	private Boolean isItemInStock;

	public InvWeightAndQuantityDto(Long totalQuantity, BigDecimal inventoryWeight) {
		this.totalQuantity = totalQuantity;
		this.inventoryWeight = inventoryWeight;
	}

}
