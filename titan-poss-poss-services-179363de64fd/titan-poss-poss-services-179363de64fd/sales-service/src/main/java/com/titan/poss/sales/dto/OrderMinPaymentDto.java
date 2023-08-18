/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OrderMinPaymentDto {

	private BigDecimal nonFrozenMinPayment;

	private BigDecimal frozenMinPayment;

	private BigDecimal bestRateMinPayment;

}
