/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for GHS account discount details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class GhsAccountDiscountDetailsDto extends BaseDiscountDetailsDto {

	private BigDecimal discountValue;
	private Integer discountMcPct;
	private Integer discountUcpPct;
	private List<String> productGroupCodesRestricted;
	private String schemeType;
	private String schemeCode;

}
