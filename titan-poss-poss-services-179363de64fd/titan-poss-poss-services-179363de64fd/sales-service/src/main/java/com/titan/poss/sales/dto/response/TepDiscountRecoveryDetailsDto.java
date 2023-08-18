/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TepDiscountRecoveryDetailsDto {

	private CashMemoResponseDto cashMemo;
	private String itemCode;
	private String discountDetails;
	private BigDecimal discountValue;
	private BigDecimal discountRecovered;

}
