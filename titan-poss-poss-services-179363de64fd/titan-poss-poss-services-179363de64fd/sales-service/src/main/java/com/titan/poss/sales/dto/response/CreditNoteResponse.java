/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CreditNoteResponse {

	// first time cn creation
	String id;
	Integer docNo;
	Short fiscalYear;

	// cn creation at redeem
	Integer redeemCNDocNo;
	String redeemCNId;

	// cn creation at residual stage
	Integer residualCNDocNo;
	String residualCNId;

	private String status;
	private BigDecimal amount;
}
