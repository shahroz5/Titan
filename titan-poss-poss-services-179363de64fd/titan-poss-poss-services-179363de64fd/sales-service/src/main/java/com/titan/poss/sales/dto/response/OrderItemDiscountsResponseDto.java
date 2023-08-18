/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import com.titan.poss.core.discount.dto.ClubbingDiscountDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseResponseDto;

import lombok.Data;

/**
 * Order item level Discount details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OrderItemDiscountsResponseDto {

	private List<DiscountDetailsBaseResponseDto> discounts;

	private List<ClubbingDiscountDetailsDto> clubDiscounts;

}
