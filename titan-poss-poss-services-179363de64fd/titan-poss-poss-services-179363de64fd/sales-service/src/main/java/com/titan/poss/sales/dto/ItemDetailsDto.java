/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.constants.SalesConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class for item details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDetailsDto {

	// lotNumber
	// inventory id

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX)
	private String lotNumber;

	@NotNull(message = "Please provide Inventory Weight")
	@PositiveOrZero(message = "Inventory Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Inventory Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal inventoryWeight;

	@NotNull(message = "Please provide Total Weight")
	@PositiveOrZero(message = "Total Weight must be positive")
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "Total Weight valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalWeight;

	@NotNull(message = "Please provide Total Quantity")
	@Positive(message = "Total Quantity must be positive")
	private Short totalQuantity;

	@PatternCheck(regexp = SalesConstants.UUID_REGEX, message = "Invalid inventoryId")
	private String inventoryId;

	@NotNull(message = "Please provide Unit Value")
	@Positive(message = "Unit Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Unit value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal unitValue;

	@NotNull(message = "Please provide Total Value")
	@Positive(message = "Total Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalValue;

	@PositiveOrZero
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Discount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalDiscount;

	@NotNull(message = "Please provide Final Value")
	@Positive(message = "Final Value must be positive")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Final value valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal finalValue;

	@NotNull(message = "Please provide Total Tax")
	@PositiveOrZero(message = "Total tax must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Total Tax valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal totalTax;

	@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX + "|^$")
	private String employeeCode;

	@Size(max = 255, message = "Remarks max length is {max}")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;

	@Size(max = 255, message = "Reason max length is {max}")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String reason;

	@NotNull(message = "Please provide Hallmark Charges")
	@PositiveOrZero(message = "Hallmark Charges must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Charges valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkCharges;

	@NotNull(message = "Please provide Hallmark Discount")
	@PositiveOrZero(message = "Hallmark Discount must be positive or zero")
	@Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Hallmark Discount valid till {integer} digits and {fraction} decimal places only")
	private BigDecimal hallmarkDiscount;

}
