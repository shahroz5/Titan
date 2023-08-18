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
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for Wallet payment fields.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class WalletPaymentFieldsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide Amount.")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 10, fraction = 0, message = "Amount valid till {integer} integer and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, message = "Please provide instrument no.(PayTM, PayU etc).", nullCheck = true)
	private String instrumentNo;

	@ValueOfEnum(enumClass = PaymentGroupEnum.class)
	@NotNull(message = "Please provide instrument type.(WALLET)")
	private String instrumentType;

	@NotNull(message = "Please provide instrument date(wallet transaction date).")
	private Date instrumentDate;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_30, message = "Please provide reference 1(wallet transaction id).")
	private String reference1;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_30, message = "Please provide reference 2.")
	private String reference2;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_30, message = "Please provide reference 3.")
	private String reference3;

}
