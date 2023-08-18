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

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for Credit Note payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNotePaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide amount")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX, nullCheck = true)
	private String instrumentNo; // CN doc No

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true)
	private String instrumentType; // Cn type?

	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.OTP_REGEX)
	private String reference1; // OTP

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String reference2;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true, message = "Please provide credit note id")
	private String reference3;

}
