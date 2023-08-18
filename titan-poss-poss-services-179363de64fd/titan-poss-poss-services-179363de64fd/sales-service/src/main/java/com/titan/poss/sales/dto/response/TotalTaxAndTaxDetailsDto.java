/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;

import com.titan.poss.core.dto.TaxCalculationResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for total tax value and tax details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalTaxAndTaxDetailsDto {

	private BigDecimal totalTax;
	private TaxCalculationResponseDto taxDetails;
	private BigDecimal finalValue;
}
