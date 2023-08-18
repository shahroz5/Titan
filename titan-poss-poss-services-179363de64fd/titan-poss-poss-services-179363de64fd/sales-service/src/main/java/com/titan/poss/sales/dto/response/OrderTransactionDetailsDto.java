/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for Search Order
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderTransactionDetailsDto {

	private String id;
	private String txnType;
	private Integer docNo;
	private Short fiscalYear;
	private Integer customerId;
	private String customerName;
	private String status;
	private String locationCode;
	private Date docDate;
	private String subTxnType;
	private String mobileNumber;
	private Boolean isFrozenRate;
	private Boolean isBestRate;
	private BigDecimal finalValue;
}
