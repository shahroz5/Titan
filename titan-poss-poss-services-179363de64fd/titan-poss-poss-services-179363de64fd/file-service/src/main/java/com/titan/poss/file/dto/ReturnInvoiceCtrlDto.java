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
public class ReturnInvoiceCtrlDto {
	
	private String ctrl;
	
	private Integer fileLines;
	
	private Integer lineCount;
	
	private BigDecimal hdrTotWt;
	
	private BigDecimal hdrTotUnitValue;
	
	private String fileId;
	
	

}
