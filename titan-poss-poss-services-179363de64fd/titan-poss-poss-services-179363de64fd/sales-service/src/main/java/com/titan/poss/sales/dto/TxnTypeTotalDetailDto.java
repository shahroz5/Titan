/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TxnTypeTotalDetailDto {

	private BigDecimal totalGrossWeight;
	private BigDecimal totalStoneWeight;
	private BigDecimal totalMakingCharges;
	private Map<String, BigDecimal> totalTax;
	private BigDecimal totalProductValue;
	private BigDecimal totalPriceValue;
	private BigDecimal deductionAmount;
	private BigDecimal totalNetValue; // metal value
	private List<String> taxCodeList;
	private Map<String, BigDecimal> taxCodePercList;
	private String hmGst;
	private BigDecimal totalDiscountRecovered;
	private BigDecimal totalStoneValue;
	private BigDecimal exchangeValue;
	private BigDecimal fullValueExchangeValue;
	private BigDecimal deductionPercentage;
	private BigDecimal totalCarat;
	private short numberOfStones;
	private BigDecimal totalStoneDeductionPercentage;
	private BigDecimal totalStoneDeductionValue;
	private BigDecimal stoneValue;
	private BigDecimal cmUnavailableAmount;
	
	private BigDecimal totalMakingCharge;
	private BigDecimal totalWastagePct;
	private BigDecimal totalSgst;
	private BigDecimal totalCgst;
}
