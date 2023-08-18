/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for inventory weight details/ measured weight details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvWeightDetailDto {

	private BigDecimal goldWeight;
	private BigDecimal platinumWeight;
	private BigDecimal silverWeight;
	private BigDecimal stoneWeight;
	private BigDecimal materialWeight;
	private BigDecimal diamondWeight;

}
