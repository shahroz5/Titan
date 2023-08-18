/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * DTO class for common attributes of CM /AB
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class SalesInvoiceDetailsDto {

	private BigDecimal totalValue;

	private BigDecimal totalTax;

	private BigDecimal finalValue;

	private BigDecimal totalDiscount;

	private BigDecimal paidValue;

}
