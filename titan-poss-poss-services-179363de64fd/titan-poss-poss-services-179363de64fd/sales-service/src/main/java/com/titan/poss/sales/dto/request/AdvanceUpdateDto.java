/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AdvanceUpdateDto {

	@Positive
	private Integer customerId;

	@Positive(message = "Total Value must be positive")
	@Digits(integer = DomainConstants.MAX_NO_OF_DIGIT, fraction = DomainConstants.PRICE_SCALE, message = "Total value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	private String employeeCode;

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX)
	private String metalType;

	private Boolean isPaymentForEGHS;

}