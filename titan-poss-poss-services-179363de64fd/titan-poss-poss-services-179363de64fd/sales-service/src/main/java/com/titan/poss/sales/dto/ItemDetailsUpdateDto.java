/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * DTO class for update item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemDetailsUpdateDto {

	@PositiveOrZero
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Tax valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalTax;

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX + "|^$")
	private String employeeCode;

	private JsonData discountDetails;
}
