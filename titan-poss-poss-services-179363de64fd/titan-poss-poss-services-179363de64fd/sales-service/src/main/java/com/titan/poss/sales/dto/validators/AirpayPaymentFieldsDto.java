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
import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for AirPay payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AirpayPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide reference 1(AirPay transaction id) of max length is 100")
	private String reference1;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide reference 2 of max length is 100")
	private String reference2;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide reference 3 of max length is 100")
	private String reference3;

	@NotNull(message = "Please provide instrument date")
	private Date instrumentDate;

	@NotNull(message = "Please provide other details")
	private JsonData otherDetails;

}
