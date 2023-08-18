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
@AllArgsConstructor
@NoArgsConstructor
public class GRNBaseItemDetailsDto {

	private String id;
	private Integer rowId;

	private String itemCode;
	private String lotNumber;
	private String productGroupCode;
	private String productCategoryCode;

	private BigDecimal inventoryWeight;
	private BigDecimal totalWeight;
	private Short totalQuantity;
	private String employeeCode;
	private BigDecimal unitValue;
	private BigDecimal totalValue;

	private BigDecimal finalValue;

}
