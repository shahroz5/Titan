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
 * DTO for item value and product group code details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemValueAndProductCodeDetailsDto {

	private String productGroupCode;
	private BigDecimal finalValue;
	private BigDecimal paidAmount;
	private BigDecimal totalValue;

	public ItemValueAndProductCodeDetailsDto(String productGroupCode, BigDecimal finalValue, BigDecimal totalValue) {
		this.productGroupCode = productGroupCode;
		this.finalValue = finalValue;
		this.totalValue = totalValue;
	}

}
