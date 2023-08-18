/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountDetailsBaseResponseDto {

	private DiscountDetailsBaseDto discountConfigDetails;

	private RivaahGhsDiscountDto rivaahGhsDetails;

}
