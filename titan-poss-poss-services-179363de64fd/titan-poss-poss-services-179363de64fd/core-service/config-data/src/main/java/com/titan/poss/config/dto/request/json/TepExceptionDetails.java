/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TepExceptionDetails extends BaseFieldsValidator {

	@NotNull(message = "deductionPercent cannot be null")
	@PositiveOrZero(message = "deductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "deductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "deductionPercent cannot be more than 100")
	private BigDecimal deductionPercent;

	@NotNull(message = "flatTepExchangeValue cannot be null")
	@PositiveOrZero(message = "flatTepExchangeValue cannot be less than 0")
	@Digits(integer = 9, fraction = 2, message = "flatTepExchangeValue valid from 9 digits and 2 decimal places only")
	private BigDecimal flatTepExchangeValue;

	@NotNull(message = "isWeightToleranceAllowed cannot be null")
	private Boolean isWeightToleranceAllowed;

	@NotNull(message = "approvedBy cannot be null")
	private String approvedBy;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_255, nullCheck = true)
	private String reasonForException;
}
