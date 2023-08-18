/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dto for payment details update.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentUpdateDto {

	@Positive(message = "Amount must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String bankName;

	// @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_MAX_30)
	// ---removed for encrypted cardNo in 'CASHBACK'
	private String instrumentNo;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String instrumentType;

	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String reference1;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String reference2;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100)
	private String reference3;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	private JsonData otherDetails;
	
	private Boolean isWithoutOtp;
	
}
