/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class StockTransactionItemDto {

	private String itemCode;
	private String lotNumber;
	private String binCode;
	private String binGroupCode;
	private BigDecimal stdValue;
	private BigDecimal stdWeight;
	private Short quantity;
	private String weightUnit;
	private String currencyCode;
	private BigDecimal karat;
	private JsonData itemDetails;
	private String id;
	private String stockTransactionId;
	private Boolean isHallmarking;
	private BigDecimal finalValue;
	private BigDecimal totalWeight;
    private BigDecimal measuredWeight;
}
