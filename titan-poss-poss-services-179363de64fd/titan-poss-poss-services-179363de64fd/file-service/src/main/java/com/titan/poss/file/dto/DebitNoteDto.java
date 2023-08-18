/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DebitNoteDto {
	
	private String trxDate;
	
	private String giDate;
	
	private String reference;
	
	private String reference1;
	
	private String blank1;
	
	private String currency;
	
	private String source;
	
	private String transactionType;
	
	private String customerNo;
	
	private String customerName;
	
	private String salesrepName;
	
	private String memoLine;
	
	private Integer qty;
	
	private BigDecimal amount1;
	
	private BigDecimal amount2;
	
	private String blank2;
	
	private String purchaseOrder;
	
	private String btqCode;
	
	private String line;
	
	private String paymentTerm;
	
	private String org;
	
	private String location1;
	
	private Integer recordId;
	
	private String location2;
	
	private String date;
	
	private String fileRef;
	
	private String fileId;

}
