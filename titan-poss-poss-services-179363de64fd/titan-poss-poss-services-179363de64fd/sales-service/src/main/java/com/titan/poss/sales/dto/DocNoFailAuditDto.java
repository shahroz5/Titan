/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * DTO to get document number fail details on treansaction confirms.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DocNoFailAuditDto {

	private Integer docNo;
	private String txnType;
	private String subTxnType;
	private String locationCode;
	private Short fiscalYear;
	private String status;
//	private String id;
//	private String txnOrRefundId;
	private String failReason;

}
