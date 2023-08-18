/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.print;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GRNReturnHeaderInfo {

	private String id;
	private String locationCode;
	private Short fiscalYear;
	private Integer docNo;

	private BigDecimal totalValue;
	private BigDecimal grnValue;
	private BigDecimal focRecoveredAmt;
	private BigDecimal loyaltyReversed;

	private BigDecimal tcsValue;
}
