/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Max;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Rivaah GHS discount details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RivaahGhsDiscountDto {

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String schemeCode;
	
	private List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = true) String> excludeProductGroup;
	
	@NotNull
	@Positive
	@Max(value = 100)
	@Digits(integer = 3, fraction = DomainConstants.PRICE_SCALE, message = "MC discount % valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal makingChargeDiscountPercent;
	
	@NotNull
	@Positive
	@Max(value = 100)
	@Digits(integer = 3, fraction = DomainConstants.PRICE_SCALE, message = "UCP discount % valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal ucpDiscountPercent;
	
	private String accountNo;//in case of CN store docNo_fiscalYear
	
	private Boolean isMcDiscountUsed;
	
	private Boolean isUcpdiscountUsed;
	
	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String refPaymentId; //used on discount addition. Not for AB to CM.
	
	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX)
	private String paymentCode;
}
