/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
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
public class StockTransactionConfirmDto {

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX)
	private String employeeCode;

	@NotNull(message = "totalQuantity cannot be null")
	@Positive(message = "totalQuantity should be greater than 0")
	private Short totalQuantity;

	@NotNull(message = "measuredWeight cannot be null")
	@Positive(message = "measuredWeight should be greater than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Measured Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	@NotNull(message = "totalWeight cannot be null")
	@Positive(message = "totalWeight should be greater than 0")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Total Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;
}
