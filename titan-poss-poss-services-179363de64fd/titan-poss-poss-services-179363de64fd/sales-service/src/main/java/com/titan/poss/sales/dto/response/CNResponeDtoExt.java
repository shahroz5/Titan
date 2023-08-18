/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class CNResponeDtoExt extends CNResponseDto {

	private Integer refDocNo; // txn doc number
	private String refDocType; // txn doc type
	private String workflowStatus;
	private List<Integer> refDocNos;

	private Integer balanceAmtCnDocNo;
	private BigDecimal maxGhsAmount;
	private Integer destCustomerId;

	private Boolean isAutoApproved;
	private Object bankDetails;
	private BigDecimal refundAmount;
	private String paymentCode;
	private String paymentInstrumentNo;
	private Boolean isRefundDetailsApplicable;
	private String approverRemarks;
	private String approverBy;
	private BigDecimal balanceAmount;
	private String cancelRemarks;
	private String remarks;
	private String destLocation;
	private Boolean isTransferEghsAllowed;
	private String paymentInstrumentType;
	private Integer debitNoteDocNo;
	private Integer debitNoteFiscalYear;

}
