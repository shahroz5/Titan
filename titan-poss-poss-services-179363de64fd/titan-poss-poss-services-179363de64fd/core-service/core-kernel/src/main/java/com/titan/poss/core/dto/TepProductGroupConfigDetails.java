/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TepProductGroupConfigDetails extends BaseFieldsValidator {

	@NotNull(message = "isTepAllowed cannot be null")
	private Boolean isTepAllowed;

	@NotNull(message = "goldDeductionPercent cannot be null")
	@PositiveOrZero(message = "goldDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "goldDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "goldDeductionPercent cannot be more than 100")
	private BigDecimal goldDeductionPercent;

	@NotNull(message = "silverDeductionPercent cannot be null")
	@PositiveOrZero(message = "silverDeductionPercent cannot be less than 0")
	@Max(value = 100, message = "silverDeductionPercent cannot be more than 100")
	@Digits(integer = 6, fraction = 3, message = "silverDeductionPercent valid till 3 decimal places only")
	private BigDecimal silverDeductionPercent;

	@NotNull(message = "platinumDeductionPercent cannot be null")
	@PositiveOrZero(message = "Platinum utilization percent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "Platinum utilization percent valid till 3 decimal places only")
	@Max(value = 100, message = "platinumDeductionPercent cannot be more than 100")
	private BigDecimal platinumDeductionPercent;

	@PositiveOrZero(message = "ucpDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "ucpDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "ucpDeductionPercent cannot be more than 100")
	private BigDecimal ucpDeductionPercent;

	@PositiveOrZero(message = "ucpDeductionFlatValue cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "ucpDeductionFlatValue valid till 3 decimal places only")
	private BigDecimal ucpDeductionFlatValue;

	@NotNull(message = "isStoneChargesApplicable cannot be null")
	private Boolean isStoneChargesApplicable;

	@PositiveOrZero(message = "stoneDeductionPercente cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "stoneDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "stoneDeductionPercent cannot be more than 100")
	private BigDecimal stoneDeductionPercent;

	@NotNull(message = "isCMMandatory cannot be null")
	private Boolean isCMMandatory;

	@NotNull(message = "cmUnavailableDeductionPercent cannot be null")
	@PositiveOrZero(message = "cmUnavailableDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "cmUnavailableDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "cmUnavailableDeductionPercent cannot be more than 100")
	private BigDecimal cmUnavailableDeductionPercent;

	@NotNull(message = "isFVTAllowed cannot be null")
	private Boolean isFVTAllowed;

//	@NotNull(message = "fvtDeductionPercent cannot be null")
	@PositiveOrZero(message = "fvtDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "fvtDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "fvtDeductionPercent cannot be more than 100")
	private BigDecimal fvtDeductionPercent;

	@NotNull(message = "isCutPieceTepAllowed allowed cannot be null")
	private Boolean isCutPieceTepAllowed;

	@NotNull(message = "isInterBrandTepAllowed allowed cannot be null")
	private Boolean isInterBrandTepAllowed;

	private Boolean isQuantityEditable;

	@NotNull(message = "typeOfExchange cannot be null")
	private String typeOfExchange;

	@NotNull(message = "recoverDiscountPercent cannot be null")
	@PositiveOrZero(message = "recoverDiscountPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "recoverDiscountPercent valid till 3 decimal places only")
	@Max(value = 100, message = "recoverDiscountPercent cannot be more than 100")
	private BigDecimal recoverDiscountPercent;

	@NotNull(message = "refundDeductionPercent cannot be null")
	@PositiveOrZero(message = "refundDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "refundDeductionPercent valid till 3 decimal places only")
	private BigDecimal refundDeductionPercent;

	@NotNull(message = "isTEPSaleBin cannot be null")
	private Boolean isTEPSaleBin;

//	@NotNull(message = "weightTolerancePercent cannot be null")
	@PositiveOrZero(message = "weightTolerancePercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "weightTolerancePercent valid till 3 decimal places only")
	@Max(value = 100, message = "weightTolerancePercent cannot be more than 100")
	private BigDecimal weightTolerancePercent;

	@NotNull(message = "isProportionedValue cannot be null")
	private Boolean isProportionedValue;
	
	@NotNull(message = "isCmDeductionAllowed value cannot be null")
	private Boolean isCmDeductionAllowed;

	@PositiveOrZero(message = "cmDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "cmDeductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "cmDeductionPercent cannot be more than 100")
	private BigDecimal cmDeductionPercent;
	
}
