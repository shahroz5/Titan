/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dto.TaxCalculationResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GiftDetailsDto {

	private String itemId;

	private String instrumentNo;

	private String vendorCode;

	private String binCode;

	private String giftType;

	private String giftCode;
	
	private Integer rowId;

	private BigDecimal totalValue;

	private BigDecimal finalValue;

	private BigDecimal totalTax;

	private TaxCalculationResponseDto taxDetails;

}
