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
public class TepApDetailsDto {
	
    private String recType;
	
	private String invoiceType;
	
	private String invoiceNumber;
	
	private Date businessDate;
	
	private String vendorCode;
	
	private String vendorSite;
	
	private BigDecimal amount;
	
	private String currencyCode;
	
	private String glCodeCombination;
	
	private String itemCode;
	
	private String customerName;
	
	private String customerBankAccNo;
	
	private String bankIfscCode;
	
	private String btqEmailId;
	
	private String fileName;
	
	private String fileId;

}
