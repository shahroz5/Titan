/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for payment request.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestCommonDto {

	@NotNull(message = "Please provide customer id.")
	@Positive(message = "Customer id should be positive.")
	private Integer customerId;

	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true)
	private String paymentCode;

	@NotNull(message = "Please provide amount")
	@Positive(message = "Amount must be positive")
	@Digits(integer = 15, fraction = 0, message = "Amount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal amount;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String requestedReason;

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX)
	private String approvedBy;

}
