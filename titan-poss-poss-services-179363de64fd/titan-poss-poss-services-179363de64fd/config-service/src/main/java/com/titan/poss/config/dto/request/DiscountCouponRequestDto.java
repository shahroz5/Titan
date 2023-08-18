/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class DiscountCouponRequestDto {

	private Integer noOfCoupons;

	private Integer noOfDigits;

	private Integer startingDigits;
}
