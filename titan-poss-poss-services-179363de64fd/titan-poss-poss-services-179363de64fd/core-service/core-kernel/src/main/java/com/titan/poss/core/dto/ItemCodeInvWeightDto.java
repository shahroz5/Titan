/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTo for item code and inv weight.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCodeInvWeightDto {

	private String itemCode;
	private BigDecimal inventoryWeight;

	@Override
	public boolean equals(Object obj) {

		if (obj == null)
			return false;

		if (!(obj instanceof ItemCodeInvWeightDto))
			return false;

		ItemCodeInvWeightDto other = (ItemCodeInvWeightDto) obj;

		if (other.itemCode != itemCode
				|| (other.itemCode != null && itemCode != null && !itemCode.equals(other.itemCode)))
			return false;

		return !(other.inventoryWeight != inventoryWeight || (other.inventoryWeight != null && inventoryWeight != null
				&& !inventoryWeight.equals(other.inventoryWeight)));

	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((inventoryWeight == null) ? 0 : inventoryWeight.hashCode());
		result = prime * result + ((itemCode == null) ? 0 : itemCode.hashCode());
		return result;
	}

}
