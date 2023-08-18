/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import com.titan.poss.core.dto.CumulativeItemDetails;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountAutoCalRequestDto {

	private DiscountItemLevelRequestDto discountRequestDto;

	private DiscountItemDetailsReqDto itemDetails;

	private DiscountCustDetails customerDetails;

	private CumulativeItemDetails cumulativeItemDetails;

}
