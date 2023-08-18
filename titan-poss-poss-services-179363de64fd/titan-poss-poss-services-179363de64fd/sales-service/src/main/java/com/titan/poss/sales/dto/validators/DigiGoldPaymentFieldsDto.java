/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.validators;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DigiGoldPaymentFieldsDto extends BasePaymentFieldsDto {
	
	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;
	
	@PatternCheck(regexp = RegExConstants.OTP_REGEX, message = "Please provide OTP")
	private String reference1;
	
	@NotNull(message = "Please provide other details")
	private JsonData otherDetails;


}
