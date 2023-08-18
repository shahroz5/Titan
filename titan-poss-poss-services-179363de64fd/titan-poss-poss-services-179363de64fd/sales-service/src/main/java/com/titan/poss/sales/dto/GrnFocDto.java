/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Map;

import com.titan.poss.core.dto.FocSchemeAllDto;

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
public class GrnFocDto {

	private BigDecimal focDeductionAmt;
	private Map<String, BigDecimal> focDeductionSchemeDetailsWise;

	private FocSchemeAllDto focConfigs;
	private FocSchemeAllDto focCnConfigs;

}
