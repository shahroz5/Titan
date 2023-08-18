/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class BrandConfigDetails extends BaseFieldsValidator {

	private Boolean isInterbrandTEPAllowed;

	@NotNull(message = "Please provide minUtilizationPercentageforGRN")
	@PositiveOrZero(message = "minUtilizationPercentageforGRN must be positive or 0")
	private BigDecimal minUtilizationPercentageforGRN;

	@NotNull(message = "Please provide minUtilizationPercentageforGRF")
	@PositiveOrZero(message = "minUtilizationPercentageforGRF must be positive or 0")
	private BigDecimal minUtilizationPercentageforGRF;

	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, message = "Invalid phone number", nullCheck = false)
	private String refusedMobileNumber;
	private String referCashPaymentConfig;

	// @NotNull(message = "Please provide numberOfPrintsAllowed")
	// commented till ui implementation
	private Short numberOfPrintsAllowed;

	@NotNull
	private BigDecimal passwordConfigForCashDeposit;

	@NotNull
	@PositiveOrZero
	@Max(value = 99)
	@Min(value = 1)
	private Integer airpayPaymentExpiry;

	@NotNull
	@PositiveOrZero
	@Max(value = 99)
	@Min(value = 1)
	private Integer razorpayPaymentExpiry;

	private Boolean isCustomerMandatoryForDigiGold;

}
