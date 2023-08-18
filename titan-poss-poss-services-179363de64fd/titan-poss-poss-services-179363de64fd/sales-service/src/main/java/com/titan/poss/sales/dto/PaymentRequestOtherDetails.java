/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

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
public class PaymentRequestOtherDetails {

	private String customerName;
	private String customerTitle;
	private String customerMobileNumber;
	private String referenceId;
	private String ulpId;
	private String creditNoteId;
	private Integer creditNoteDocNo;
	private Integer creditNoteFiscalYear;
	private String reference1;
	private String reference2;
	private String reference3;
	private String paymentUrl;
	private Date   approvedTime;
	private String errorCode;
	private String errorMessage;

}
