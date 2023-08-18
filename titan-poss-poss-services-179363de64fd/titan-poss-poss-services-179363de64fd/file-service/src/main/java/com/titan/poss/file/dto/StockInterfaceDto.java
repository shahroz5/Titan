/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StockInterfaceDto {

	private String transactionType;
	private String fromWhere;
	private String fromLocation;
	private String lotNo;
	private String stmValue;
	private String toWhere;
	private String toLocation;
	private String primaryQty;
	private String secondaryQty2;
	private String businessDate;
	private String reasonCode;
	private String stmNumber;
	private String itemNo;
	private String attribute;
	private String attribute1;
	private String attribute2;
	private String attribute3;
	private String logisticPartnerName;
	private String logisticDocNumber;
	private String igstPercentage;
	private String igstAmount;
	private String sgstPercentage;
	private String sgstAmount;
	private String cgstPercentage;
	private String cgstAmount;
	private String utgstPercentage;
	private String utgstAmount;
	private String recordId;
	private String btqCode;
	private String fileName;
	private String businessDate2;
	
}
