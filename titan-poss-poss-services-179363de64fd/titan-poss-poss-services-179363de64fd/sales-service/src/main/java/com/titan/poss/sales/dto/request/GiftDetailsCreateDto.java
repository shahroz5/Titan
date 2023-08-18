/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;

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
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class GiftDetailsCreateDto {

	private String instrumentNo;

	@NotNull(message = "Please provide line item number")
	@Min(1)
	private Integer rowId;

	@NotNull(message = "Please provide Total Value")
	@Positive(message = "Total Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	@NotNull(message = "Please provide Net Value")
	@Positive(message = "Net Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Net value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal finalValue;

	@NotNull(message = "Please provide Total Tax")
	@PositiveOrZero(message = "Total tax must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Tax valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalTax;

	private String giftCode;

}
