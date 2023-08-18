/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfigAmountAndPANDto {
	private Boolean isPanMandatory;
	private BigDecimal configurationAmount;	
	private boolean isPanCardOnSingleInvoice;
	private boolean isPanCardOnCumulativeInvoice;
}
