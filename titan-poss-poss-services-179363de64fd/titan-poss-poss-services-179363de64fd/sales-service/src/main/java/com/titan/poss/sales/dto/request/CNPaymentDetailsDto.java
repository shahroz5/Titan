/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;
import java.util.Map;

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
public class CNPaymentDetailsDto {

	public CNPaymentDetailsDto(boolean isRTGS, boolean isCheque, boolean isUPI, Boolean isGeneratedForUnipayDeletion,
			Map<String, String> paymentCodes) {
		super();
		this.isRTGS = isRTGS;
		this.isCheque = isCheque;
		this.isUPI = isUPI;
		this.isGeneratedForUnipayDeletion = isGeneratedForUnipayDeletion;
		this.paymentCodes = paymentCodes;
	}

	boolean isRTGS;

	boolean isCheque;
	
	boolean isUPI;

	private Boolean isGeneratedForUnipayDeletion;// will be true when CN is generated for 'UNIPAY' payment deletion.

	Map<String, String> paymentCodes;

	private Date chequeDate;
	
	private String unipayID;

	private String hostname;

	private String paymentId;

	private String txnDate;

	private String bankInvoiceNo;
	
	private String instrumentNumber;

	private String bankName;
}
