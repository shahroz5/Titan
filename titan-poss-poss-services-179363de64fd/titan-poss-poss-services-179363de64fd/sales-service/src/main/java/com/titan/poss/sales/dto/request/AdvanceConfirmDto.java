/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AdvanceConfirmDto {

	@NotNull
	@Positive
	private Integer customerId;

	@NotNull(message = "Please provide paid value")
	@Positive(message = "Total Value must be positive")
	@Digits(integer = DomainConstants.MAX_NO_OF_DIGIT, fraction = DomainConstants.PRICE_SCALE, message = "Total value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal paidValue;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	@Positive(message = "Total Value must be positive")
	@Digits(integer = DomainConstants.MAX_NO_OF_DIGIT, fraction = DomainConstants.WEIGHT_SCALE, message = "Total amount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal weightAgreed;

	@Valid
	private MetalRateListDto metalRateList;
}
