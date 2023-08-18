/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class InventoryFocItemDto {

	private String itemCode;
	private String lotNumber;
	private Long totalQuantity;
	private BigDecimal stdWeight;
	private BigDecimal unitWeight;
	private String weightUnit;
	private String totalWeightDetails;
	private BigDecimal stdValue;
	private String binGroupCode;
	private String binCode;

}
