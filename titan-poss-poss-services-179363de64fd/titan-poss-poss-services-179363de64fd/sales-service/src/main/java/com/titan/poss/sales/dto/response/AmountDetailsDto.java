/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * Eligible amount for customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class AmountDetailsDto {

	// amount that can be paid based on payment mode.
	private BigDecimal eligibleAmount;

	// amount due from customer.
	private BigDecimal amountDue;

	// total bill amount of the transaction.
	private BigDecimal totalAmount;

	private BigDecimal pmlaEligibleAmount;

	// TCS amount if applied for the transaction
	private BigDecimal tcsAmount;

	// total weight of items added in transaction: CM, AB, CO
	private BigDecimal totalWeight;
	
	private BigDecimal totalGoldWeight;
}
