/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ItemLotGrnDto extends ItemLotDto {

	private BigDecimal unitValue;

	public ItemLotGrnDto(String itemCode, String lotNumber, BigDecimal unitValue) {
		super(itemCode, lotNumber);
		this.unitValue = unitValue;
	}

}
