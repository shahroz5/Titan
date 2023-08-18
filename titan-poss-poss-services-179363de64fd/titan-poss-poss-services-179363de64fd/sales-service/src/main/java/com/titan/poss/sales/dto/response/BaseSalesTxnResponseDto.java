/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * Response Dto class for Common Sales Txn attributes across the Module
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class BaseSalesTxnResponseDto {

	private String txnType;

	private String subTxnType;

	private String status;

	private Integer docNo;

	private Date docDate;

	private Short fiscalYear;

	private String locationCode;

	private String employeeCode;

	private Integer customerId;

	private Date firstHoldTime;

	private Date lastHoldTime;

	private Date lastInvokeTime;

	private Date confirmedTime;

	private String remarks;

	private String currencyCode;

	private String weightUnit;

}
