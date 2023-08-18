/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnPriceDto {

	private BigDecimal totalItemsValue;
	private BigDecimal focDeductionValue;
	private BigDecimal finalValue;
	private Short totalReturnQuantity;
	private BigDecimal encriclePointValue;
	private BigDecimal tcsAmountToBeRefund;

}
