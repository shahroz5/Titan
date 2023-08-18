/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to send hallmark details to tax calculation.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HallmarkGstRequestDto {

	@PositiveOrZero(message = "Hallmark Charges must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Charges valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkCharges;

	@PositiveOrZero(message = "Hallmark Discount must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Discount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkDiscount;

	@PositiveOrZero(message = "Hallmark GST pct must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark GST pct valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkGstPct;

}
