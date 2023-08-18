/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Map;

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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CancelGRNResponseDto extends CancelAdvanceResponseDto {

	private BigDecimal cnAmt;
	private BigDecimal loyaltyReversalPoint;
	private Map<String, String> cNDocTypes;

	@Override
	public String toString() {
		return "CancelGRNResponseDto [cnAmt=" + cnAmt + ", loyaltyReversalPoint=" + loyaltyReversalPoint
				+ ", toString()=" + super.toString() + "]";
	}

}
