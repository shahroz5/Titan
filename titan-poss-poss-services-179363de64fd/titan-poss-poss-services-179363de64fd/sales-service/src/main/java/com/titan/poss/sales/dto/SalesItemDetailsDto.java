/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dto.PriceDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SalesItemDetailsDto {

	private String id;

	private String itemCode;

	private String lotNumber;

	private BigDecimal unitValue;

	private Short totalQuantity;

	private BigDecimal totalValue;

	private BigDecimal totalWeight;

	private BigDecimal totalDiscount;

	private String productGroupCode;

	private String productCategoryCode;

	private PriceDetailsDto priceDetails;

	private Date mfgDate;

	private Date stockInwardDate;

	private BigDecimal finalValue;

	private BigDecimal totalTax;

	private BigDecimal complexityPercent;

	private BigDecimal makingChargePerGram;

	private String orderItemId;

	private BigDecimal inventoryWeight;
}
