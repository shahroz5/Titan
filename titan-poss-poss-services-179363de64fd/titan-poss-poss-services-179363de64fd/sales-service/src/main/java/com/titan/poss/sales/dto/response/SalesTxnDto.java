/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SalesTxnDto implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String refTxnId;
	private String txnType;

	private String locationCode;
	private Integer docNo;
	private Short fiscalYear;

	private String employeeCode;

	private String status;

	private Integer customerId;

	private String metalRateDetails;

	private Date firstHoldTime;

	private Date lastHoldTime;

	private String refTxnType;

	private Date docDate;

	private String subTxnType;

	private String manualBillDetails;

	private String remarks;

	private Date confirmedTime;

	private Integer prints;

	private String printDetails;

	private Date lastInvokeTime;

	private String manualBillId;

	private String currencyCode;

	private String weightUnit;

	private String customerDocDetails;

}
