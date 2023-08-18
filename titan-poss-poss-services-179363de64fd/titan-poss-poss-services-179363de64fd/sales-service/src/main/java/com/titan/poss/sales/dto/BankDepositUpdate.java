/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;


import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankDepositUpdate {
	
	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;
	
	private String bankName;
	
	@Positive(message = "Amount must be positive")
	private BigDecimal amount;
	
	@Positive(message = "Amount must be positive")
	private BigDecimal depositAmount;
	
	private JsonData approvalDetails;
	
	private Date collectionDate;
	
	private Date businessDate;

}
