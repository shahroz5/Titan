/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GHSOfflineRevenueDto {
	
	private BigDecimal netAmount;
	
	private BigDecimal cashAmount;
	private BigDecimal cashReversal;
	private BigDecimal cashRefund;
	
	private BigDecimal dDAmount;
	private BigDecimal dDReversal;
	
	private BigDecimal chequeAmount;
	private BigDecimal chequeReversal;

	private BigDecimal cCRevenue;
	private BigDecimal cCReversal;

	private BigDecimal cCCommission;

	private BigDecimal achAmount;
	private BigDecimal achReversal;

	private BigDecimal emplSalaryDeductionAmount;
	private BigDecimal emplSalaryDeductionAmountReversal;

	private BigDecimal roRefund;

	private BigDecimal airPayAmount;
	private BigDecimal airPayReversal;
	
	private BigDecimal paytmAmount;
	private BigDecimal paytmReversal;
	

}
