/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CreditNoteGhsUpdateDto {
	
	
	private Integer documentId;
	
	private Integer fiscalYear;
	
	private Boolean isNewCn;
	
	private String docType;
	
	private BigDecimal ghsBonus;
	
	private Integer ghsAccountNo;
	
	private Integer docNo;
	
	private BigDecimal amount;
	
	private Integer cnFiscalYear;
	
	private Integer ghsFiscalYear;
	
	private String ghsLocationCode;
	
	private Date maturedDate;
	
	
	
	
	
	
	
	
	
	
	

}
