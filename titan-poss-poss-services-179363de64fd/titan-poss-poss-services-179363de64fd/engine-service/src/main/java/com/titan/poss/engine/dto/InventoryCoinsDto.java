/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
public class InventoryCoinsDto {

	private String itemCode;
	private Long totalQuantity;
	private BigDecimal stdWeight;
	private BigDecimal unitWeight;
	private String weightUnit;
	private String totalWeightDetails;
	private BigDecimal stdValue;
	private String binGroupCode;
	private String binCode;

}
