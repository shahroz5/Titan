/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CummulativeDiscountWithExcludeDto {

	private String discountId;
	private String discountDetailsId;
	private Boolean isExclude;
	private String discountType;
	private Boolean isAutoDiscount;

	public CummulativeDiscountWithExcludeDto(String discountId, String discountDetailsId, Boolean isExclude,
			String discountType) {
		super();
		this.discountId = discountId;
		this.discountDetailsId = discountDetailsId;
		this.isExclude = isExclude;
		this.discountType = discountType;
	}

}
