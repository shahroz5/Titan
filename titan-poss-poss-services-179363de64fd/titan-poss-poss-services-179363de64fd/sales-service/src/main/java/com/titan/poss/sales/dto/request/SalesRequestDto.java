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
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * Request DTO class for Common Fields of Sales transactions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
public class SalesRequestDto extends BaseSalesTxnRequestDto {

	@NotNull(message = "Please provide Total Quantity")
	@Positive(message = "totalQuantity must be positive")
	private Short totalQuantity;

	@NotNull(message = "Please provide Total Weight")
	@PositiveOrZero(message = "Total Weight must be zero or positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Total Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	@NotNull(message = "Please provide Total Value")
	@Positive(message = "Total Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	@NotNull(message = "Please provide Total Tax")
	@PositiveOrZero(message = "Total Tax must be positive or 0")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Tax valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalTax;

	@NotNull(message = "Please provide Final value")
	@Positive(message = "Final Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Final Value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal finalValue;

	@PositiveOrZero
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Discount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalDiscount;

	@NotNull(message = "Please provide Paid value")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Paid value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal paidValue;

	@Valid
	private MetalRateListDto metalRateList;

	@NotNull(message = "Please provide Hallmark Charges")
	@PositiveOrZero(message = "Hallmark Charges must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Charges valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkCharges;

	@NotNull(message = "Please provide Hallmark Discount")
	@PositiveOrZero(message = "Hallmark Discount must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Discount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkDiscount;

}
