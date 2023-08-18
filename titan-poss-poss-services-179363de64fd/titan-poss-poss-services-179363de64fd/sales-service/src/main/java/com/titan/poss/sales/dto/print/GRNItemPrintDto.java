/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;

import com.titan.poss.core.dto.PriceDetailsDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GRNItemPrintDto {

	private String itemCode;
	private String description;
	private String hsnCode;

	private Short totalQuantity;
	private BigDecimal totalValue;

	// gross weight, stone weight
	private PriceDetailsDto priceDetails;

	private BigDecimal cgstTax = BigDecimal.ZERO;
	private BigDecimal sgstTax = BigDecimal.ZERO;

	private BigDecimal finalValue;
	
	private BigDecimal totalDiscount;

}
