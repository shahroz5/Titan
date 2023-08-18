/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class CashbackOfferRequestDto {

	@NotBlank
	private String cardNumber;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, nullCheck = true)
	private String bankName;

	@NotNull
	@Positive
	@Digits(integer = 10, fraction = 2, message = "Swipe Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal swipeAmount;

	@NotNull
	@Positive
	@Digits(integer = 10, fraction = 2, message = "Invoice Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal invoiceAmount;

}
