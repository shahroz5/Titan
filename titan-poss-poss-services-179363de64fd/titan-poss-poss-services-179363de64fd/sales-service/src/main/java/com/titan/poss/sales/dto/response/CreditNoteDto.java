/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.sales.dao.CancelDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteDto {
	/**
	* 
	*/

	private String id;

	private SalesTxnDto salesTxn;

	private SalesTxnDto linkedTxn; // what if its a cancel txn--- how to save that object in it...?

	private CreditNoteDto parentCn;

	private CreditNoteDto originalCn;

	private CancelDaoExt cancelTxn;

	private String creditNoteType;

	private String locationCode;
	private Short fiscalYear;

	private Integer docNo;

	private Date docDate;
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

	private String workflowStatus;

	private String cancelRemarks;

	private Integer prints;

	private BigDecimal cashCollected;

	private String cnTransferId;
	
	private Boolean isTransferEghsAllowed;
	
	private Date cancelDate;

}
