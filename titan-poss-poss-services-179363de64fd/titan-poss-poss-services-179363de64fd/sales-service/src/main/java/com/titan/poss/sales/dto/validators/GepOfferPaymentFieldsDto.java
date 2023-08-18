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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for 'GEP OFFER' payment fields
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class GepOfferPaymentFieldsDto extends BasePaymentFieldsDto {

	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@NotNull(message = "Please provide instrument date(business date).")
	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide valid reference 1 of max length is 100")
	private String reference1;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100, message = "Please provide reference 2 of max length is 100")
	private String reference2;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Please provide valid reference3(payment id)", nullCheck = true)
	private String reference3;

}
