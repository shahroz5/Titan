/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.validators;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for Cheque payment fields.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class ChequePaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide bank name", nullCheck = true)
	private String bankName;

	@Size(min = 6, max = 8, message = "Instrument number(Cheque no.) min length is {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX, message = "Please provide instrument number(Cheque number).", nullCheck = true)
	private String instrumentNo;

	@NotNull(message = "Please provide instrument date(Date on cheque or DD).")
	private Date instrumentDate;

	// instrument type required?
}
