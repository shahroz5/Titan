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
 * DTO for qty and weight.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QtyAndWeightDto {
	private Short totalQuantity;
	private BigDecimal inventoryWeight;

}
