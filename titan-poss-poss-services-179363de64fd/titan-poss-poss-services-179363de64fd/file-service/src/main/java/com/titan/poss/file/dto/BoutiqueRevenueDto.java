/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BoutiqueRevenueDto {

	private String receiptNo;

	private String currency;

	private BigDecimal amount;

	private String receiptDate;

	private String glDate;

	private String receiptMethod;

	private String category;

	private String attribute1;

	private String attribute2;

	private String customerName;

	private String customerNumber;

	private String comments;

	private String attribute3;

	private String attribute4;

	private String attribute5;

	private String attribute6;

	private Date attribute7;
	
	private String attribute7String;

	private String attribute8;
	
	private String fileId;

}
