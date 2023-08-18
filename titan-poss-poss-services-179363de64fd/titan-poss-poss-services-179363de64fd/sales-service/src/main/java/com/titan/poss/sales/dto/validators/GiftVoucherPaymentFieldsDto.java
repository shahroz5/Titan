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

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for Gift Voucher payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GiftVoucherPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.NUMERIC_REGEX, message = "Please provide valid instrument number(Voucher number).", nullCheck = true)
	private String instrumentNo;

	@NotNull(message = "Please provide instrument date(card transaction date).")
	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.OTP_REGEX, message = "Please provide valid reference1(OTP)")
	private String reference1;

}
