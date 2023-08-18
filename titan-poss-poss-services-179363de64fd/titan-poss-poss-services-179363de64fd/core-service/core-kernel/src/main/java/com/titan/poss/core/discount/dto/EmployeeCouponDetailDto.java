/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for Employee coupon details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EmployeeCouponDetailDto {

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX)
	private String couponCode;
	
	private BigDecimal amount;

	private String redeemTxnId;

	// REDEEMED or REVERSED
	private String redeemStatus;

}
