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
 * RO Payment fields Dto.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ROPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@NotNull(message = "Please provide instrument date(RO transaction date).")
	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, message = "Please provide reference1(reference id)")
	private String reference1;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true, message = "Please provide reference2(payment request id)")
	private String reference2;

	@NotNull(message = "Please provide bank name(Approved By).")
	private String bankName;

}
