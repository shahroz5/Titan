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
 * DTO to validate GHS eVoucher Payment fields.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GhsEVoucherPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX, message = "Please provide valid instrument number(eVoucher number).", nullCheck = true)
	private String instrumentNo;

	@NotNull(message = "Please provide instrument date(card transaction date).")
	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide bank name(CPG name)", nullCheck = true)
	private String bankName;

	@PatternCheck(regexp = RegExConstants.OTP_REGEX, message = "Please provide valid reference1(OTP)", nullCheck = true)
	private String reference1;

}
