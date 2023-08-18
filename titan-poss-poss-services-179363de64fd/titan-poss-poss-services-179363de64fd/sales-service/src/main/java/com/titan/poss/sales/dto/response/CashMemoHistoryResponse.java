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
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CashMemoHistoryResponse {
	
	
	private String id;
	private Integer docNo;
	private Date docDate;
	private Short fiscalYear;
	private String customerName;
	private BigDecimal netAmount;
	private String createdBy;
	private Date createdDate;
	private String status;
	private Short totalQuantity;
}
