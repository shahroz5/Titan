/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CancellationListDto {

	private Integer refDocNo;
	private String customerName;
	private Date refTxnTime;
	private String refTxnId;
	private String txnType;
	private String subTxnType;
	private Date refDocDate;
	private BigDecimal totalValue;
	private String currencyCode;

}
