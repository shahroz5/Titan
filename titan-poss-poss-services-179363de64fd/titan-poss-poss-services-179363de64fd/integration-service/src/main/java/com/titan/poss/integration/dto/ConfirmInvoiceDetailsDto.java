/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConfirmInvoiceDetailsDto {
  
	private String  LocationCode;
	
	private String CMNo;
	
	private String CMFiscalYEar;
	
	private Date CMDate;
	
	private String ItemCode;
	
	private String LotNumber;
	
	private String BINCode;
	
	private String COMOrderNo;
	
	private String PriorityOrderNo;
	
	private String PriorityOrderFiscalYear;
	
	private Short Quantity;
	
	private BigDecimal Weight;
	
	private BigDecimal TotalValue;
	
	private String CustomerMobile;
	
	private String CustomerULP;
	
	private String CancellationDocNo;
	
	private String CancelledBy;
	
	private Date CancelledDate;
	
	private String Reason;
	
}
