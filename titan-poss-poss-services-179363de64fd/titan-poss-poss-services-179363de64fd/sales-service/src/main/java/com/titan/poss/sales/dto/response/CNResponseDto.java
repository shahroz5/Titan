/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class CNResponseDto {

	private String id;
	private Integer docNo;
	private Short fiscalYear;
	private String customerName;
	private Integer customerId;
	private String locationCode;
	private String creditNoteType;
	private Date docDate;
	private BigDecimal amount;
	private String status;
	private String linkedTxnType; // [reftxnType]
	private String mobileNumber;
	private String linkedTxnId;
	private String workflowStatus;

	private Object frozenRateDetails;
	private BigDecimal utilisedAmount;
	private BigDecimal cashCollected;
  //  private JsonData paymentDetails;
	private String mergedCNId;
	private JsonData discountDetails;
	private JsonData eghsDetails;
	private String gepConfigDetailsId;
	private String parentCnId;

	private Boolean isCancleAllowed;
	private Object paymentDetails;
	private Boolean isUnipay;
	private Date originalDocDate;
	private Date cancelDate;
	private Integer refDocNo;
	private Short refFiscalYear;
	private String refDocType;

	// private Integer accountNumber;
	public CNResponseDto(String id, Integer docNo, Short fiscalYear, String customerName, Integer customerId,
			String locationCode, String creditNoteType, Date docDate, BigDecimal amount, String status,
			String mobileNumber, String linkedTxnId, String workflowStatus, Object frozenRateDetails,
			BigDecimal utilisedAmount, String mergedCNId, Date cancelDate) {
		super();
		this.id = id;
		this.docNo = docNo;
		this.fiscalYear = fiscalYear;
		this.customerName = customerName;
		this.customerId = customerId;
		this.locationCode = locationCode;
		this.creditNoteType = creditNoteType;
		this.docDate = docDate;
		this.amount = amount;
		this.status = status;
		this.mobileNumber = mobileNumber;
		this.linkedTxnId = linkedTxnId;
		this.workflowStatus = workflowStatus;
		this.frozenRateDetails = frozenRateDetails;
		this.utilisedAmount = utilisedAmount;
		this.mergedCNId = mergedCNId;
		this.cancelDate = cancelDate;
	}


}
