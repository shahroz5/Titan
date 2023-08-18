/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data

public class CreditNoteHeaderDto {

	private String id;

	private String salesTxnId;

	private String linkedTxnId;

	private String parentCnId;

	private String originalCnId;

	private String cancelTxnId;

	private String creditNoteType;

	private String locationCode;

	private Short fiscalYear;

	private Integer docNo;

	private Date docDate;
	
	private Date requestedDocDate;

	private Integer customerId;

	private BigDecimal amount;

	private BigDecimal utilisedAmount;

	private String paymentDetails;

	private String eghsDetails;

	private String frozenRateDetails;

	private String gepDetails;

	private String activationDetails;

	private BigDecimal totalTax;

	private String taxDetails;

	private String tepDetails;

	private String grnDetails;

	private String processId;

	private String remarks;

	private String status;

	private Integer prints;

	private String workflowStatus;

	private String approverLocationCode;

	private String customerName;
	private String mobileNumber;
	private String requestType;

	private Integer destCustomerId;

}
