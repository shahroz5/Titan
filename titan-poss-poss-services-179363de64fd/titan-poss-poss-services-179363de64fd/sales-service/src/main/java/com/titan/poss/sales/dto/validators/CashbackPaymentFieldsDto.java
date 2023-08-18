/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.validators;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Cashback payment fields.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashbackPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@NotBlank(message = "Please provide instrument number(card number).")
	private String instrumentNo;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide bank name", nullCheck = true)
	private String bankName;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Please provide reference 1(Offer id)", nullCheck = true)
	private String reference1;// do not change the offerId saved(same is copied for payment_refunds also)

	@PatternCheck(regexp = RegExConstants.DECIMAL_REGEX, message = "Please provide reference 2(swipe amount)", nullCheck = true)
	private String reference2;

}
