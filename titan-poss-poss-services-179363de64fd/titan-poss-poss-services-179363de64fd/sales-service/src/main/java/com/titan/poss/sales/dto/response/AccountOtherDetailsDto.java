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
 * Other details DTO for account.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountOtherDetailsDto {

	private Integer noOfInstallmentPaid;
	private String schemeCode;
	private BigDecimal goldRate;
	private BigDecimal totalGhsAdvance;
	private BigDecimal accumulatedGoldWeight;
	private BigDecimal installmentAmount;
	private Integer discountMcPct;
	private Integer discountUcpPct;

}
