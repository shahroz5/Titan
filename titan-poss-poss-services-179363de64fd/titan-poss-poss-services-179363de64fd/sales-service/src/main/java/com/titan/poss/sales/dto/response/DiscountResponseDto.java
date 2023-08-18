/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO class for Discount details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountResponseDto {

	private List<DiscountDetailResponseDto> discountDetails;

	private List<String> discountTxnIdList;// used for Rivaah GHS

	/**
	 * @param discountDetails
	 */
	public DiscountResponseDto(List<DiscountDetailResponseDto> discountDetails) {
		super();
		this.discountDetails = discountDetails;
	}

}
