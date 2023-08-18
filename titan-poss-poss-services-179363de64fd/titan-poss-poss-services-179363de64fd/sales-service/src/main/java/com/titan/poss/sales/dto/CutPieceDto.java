/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CutPieceDto {

	private String itemCode;
	private String lotNumber;
	private String inventoryId;
	private String binCode;
	private String binGroupCode;
	private BigDecimal totalValue;
	private Short totalQuantity;
	private BigDecimal grossWeight;
	private JsonData metalWeight;
}
