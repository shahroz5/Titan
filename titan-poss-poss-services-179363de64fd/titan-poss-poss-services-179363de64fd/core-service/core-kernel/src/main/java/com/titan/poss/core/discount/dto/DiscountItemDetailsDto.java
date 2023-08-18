/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Request DTO class to fetch FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class DiscountItemDetailsDto extends CummulativeDiscountCheckDto {

	private Date mfgDate;

	private Date stockInwardDate;

	private String itemCode;

	private String lotNumber;

	private String productGroupCode;

	private String productCategoryCode;

	private BigDecimal makingChargePerGram;

	private BigDecimal complexityPercent;

	private BigDecimal totalWeight;

	private BigDecimal netWeight;

	private BigDecimal totalValue;

	private BigDecimal totalTax;

	private Boolean isUcp;

	private String itemId;

}
