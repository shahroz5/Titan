/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WeightDTO {
	private BigDecimal goldWeight;

	private BigDecimal platinumWeight;

	private BigDecimal silverWeight;

	private BigDecimal stoneWeight;
	private BigDecimal diamondWeight;
	private BigDecimal materialWeight;
}
