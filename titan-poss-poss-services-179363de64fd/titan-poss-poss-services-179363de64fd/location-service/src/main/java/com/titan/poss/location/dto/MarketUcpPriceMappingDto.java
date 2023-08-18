/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

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
 * DTO class for market UCP factor request.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketUcpPriceMappingDto {

	@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX, nullCheck = true)
	private String marketCode;

	@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX, nullCheck = true)
	private String productGroupCode;

	@NotNull
	@Positive
	@Digits(integer = 15, fraction = 5, message = "Markup factor valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal markupFactor;

}
