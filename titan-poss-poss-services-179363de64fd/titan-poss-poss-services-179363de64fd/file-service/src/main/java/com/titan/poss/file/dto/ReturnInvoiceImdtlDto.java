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
public class ReturnInvoiceImdtlDto {
	
    private String type;
	
	private Integer lineCount;
	
	private Integer lineDtlCount;
	
	private String itemNo;
	
	private BigDecimal weight;
	
	private Integer qty;
	
	private String fileId;
}
