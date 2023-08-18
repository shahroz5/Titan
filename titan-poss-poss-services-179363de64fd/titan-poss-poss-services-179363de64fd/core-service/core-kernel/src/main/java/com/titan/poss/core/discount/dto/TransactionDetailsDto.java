/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.Data;

/**
 * Request DTO class to fetch FOC items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class TransactionDetailsDto {

	private String transactionType;
	private String subTransactionType;
	private Boolean isFrozenRate;
	private String refTxnType;

}
