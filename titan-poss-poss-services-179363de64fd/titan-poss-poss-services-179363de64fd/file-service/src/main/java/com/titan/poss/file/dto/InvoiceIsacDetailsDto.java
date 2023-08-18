/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceIsacDetailsDto {

	private Integer lineDtlCount;
	
	private String glKey;
	
	private String dcInd;
	
	private BigDecimal percentage;
	
	private BigDecimal amount;
}
