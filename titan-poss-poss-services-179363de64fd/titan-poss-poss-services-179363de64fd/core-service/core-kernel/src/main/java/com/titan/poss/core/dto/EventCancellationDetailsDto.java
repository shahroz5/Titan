/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EventCancellationDetailsDto {

	private String status;

	private String locationCode;

	private BigDecimal totalValue;

	private String cancellationType;

	private String remarks;

	private String reasonForCancellation;

	private String employeeCode;

	private Date cancelledTime;

	private Short prints;

	private BigDecimal totalWeight;

	private Short totalQuantity;

	private String txnType;

	private String subTxnType;

	private Integer customerId;

	private Integer docNo;

	private Short fiscalYear;

	private Date docDate;

	private String cancellationDetails;

	private String currencyCode;

	private String weightUnit;
	
	private String id;
	
	private String refSalesTxn;

}
