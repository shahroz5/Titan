/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.PositiveOrZero;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CompPriceGrpUpdateDto {

	@PositiveOrZero
	private BigDecimal makingChargePunit;

	@PositiveOrZero
	private BigDecimal makingChargePgram;

	@PositiveOrZero
	private BigDecimal wastagePct;

	@PositiveOrZero
	private BigDecimal makingChargePct;
	
	private Boolean isActive;

}
