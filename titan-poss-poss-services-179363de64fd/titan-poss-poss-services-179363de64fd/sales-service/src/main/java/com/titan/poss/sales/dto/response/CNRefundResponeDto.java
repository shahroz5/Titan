/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CNRefundResponeDto {

	private BigDecimal amount;

	private BigDecimal totalTax;

	private BigDecimal utilisedAmount;

	private String deductionPercentage;

	private BigDecimal refundDeductionAmount;

	private BigDecimal netRefundAmount;

	private List<String> paymentModeList;
	
	private String paymentCode;
	
	private String acquiredBank;

}
