/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dto.PriceDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class DiscountItemDetailsReqDto extends CummulativeDiscountCheckDto {

	private Date mfgDate;
	private Date stockInwardDate;
	private String itemId;
	private String itemCode;
	private String lotNumber;
	private String productGroupCode;
	private String productCategoryCode;
	private BigDecimal totalValue;
	private BigDecimal totalWeight;
	private BigDecimal inventoryWeight;
	private Short totalQuantity;
	private BigDecimal totalTax;
	private PriceDetailsDto priceDetails;

}
