/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.response;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GhsCreditNoteDto {
	
	private Integer ghsDocNo;

	private String creditNoteType;
	
	private BigDecimal amount;
	
	private Integer cnDocNo;
	
	private Integer fiscalYear;
	
	private String customerName;
	
	private Integer customerId;
	
	private String mobileNumber;
	
	private String ulpId;
	
	private String status;
}
