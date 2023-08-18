/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
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
public class GepConfigDetails extends BaseFieldsValidator {

//	@NotNull(message = "gepDaysAfterCOOffer cannot be null")
	@PositiveOrZero(message = "gepDaysAfterCOOffer should be 0 or more than 0")
	private Integer gepDaysAfterCOOffer;

//	@NotNull(message = "gepDaysAfterABOffer cannot be null")
	@PositiveOrZero(message = "gepDaysAfterABOffer should be 0 or more than 0")
	private Integer gepDaysAfterABOffer;

//	@PositiveOrZero(message = "minKaratAccepted should be 0 or more than 0")
	@Digits(integer = 6, fraction = 0, message = "minKaratAccepted should not have any decimal value")
	@Max(value = 24, message = "minKaratAccepted cannot be more than 24")
	@Min(value = 9, message = "minKaratAccepted cannot be less than 9")
	private BigDecimal minKaratAccepted;

//	@NotNull(message = "gepDiscountDeductionAmt cannot be null")
	private Boolean gepDiscountDeductionAmt;

//	@NotNull(message = "gepAsPayment cannot be null")
	private Boolean gepAsPayment;

//	@PositiveOrZero(message = "baseKaratForPurity should be 0 or more than 0")
	@Digits(integer = 6, fraction = 0, message = "baseKaratForPurity should not have any decimal value")
	@Max(value = 24, message = "baseKaratForPurity cannot be more than 24")
	@Min(value = 9, message = "baseKaratForPurity cannot be less than 9")
	private BigDecimal baseKaratForPurity;

//	@NotNull(message = "holdTime cannot be null")
	@PositiveOrZero(message = "holdTime should be 0 or more than 0")
	private Integer holdTime;

//	@NotNull(message = "isPreMeltingDetailsMandatory cannot be null")
	private Boolean isPreMeltingDetailsMandatory;

}
