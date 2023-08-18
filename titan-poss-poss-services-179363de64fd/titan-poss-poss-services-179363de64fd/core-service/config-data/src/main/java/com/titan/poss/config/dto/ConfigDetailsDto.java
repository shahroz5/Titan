/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Valid
public class ConfigDetailsDto {

	@NotNull(message = "gepDaysAfterCOOffer cannot be null")
	@PositiveOrZero(message = "gepDaysAfterCOOffer should be 0 or more than 0")
	private Integer gepDaysAfterCOOffer;

	@NotNull(message = "gepDaysAfterABOffer cannot be null")
	@PositiveOrZero(message = "gepDaysAfterABOffer should be 0 or more than 0")
	private Integer gepDaysAfterABOffer;

	@NotNull(message = "minKaratAccepted cannot be null")
	@PositiveOrZero(message = "minKaratAccepted should be 0 or more than 0")
	private BigDecimal minKaratAccepted;

	@NotNull(message = "gepDiscountDeductionAmt cannot be null")
	private Boolean gepDiscountDeductionAmt;

	@NotNull(message = "gepAsPayment cannot be null")
	private Boolean gepAsPayment;

	@NotNull(message = "baseKaratForPurity cannot be null")
	@PositiveOrZero(message = "baseKaratForPurity should be 0 or more than 0")
	private BigDecimal baseKaratForPurity;

//	@NotNull(message = "maxCancellationDays cannot be null")
//	@PositiveOrZero(message = "maxCancellationDays should be 0 or more than 0")
//	private Integer maxCancellationDays;

	@NotNull(message = "holdTime cannot be null")
	@PositiveOrZero(message = "holdTime should be 0 or more than 0")
	private Integer holdTime;

	@NotNull(message = "isPreMeltingDetailsMandatory cannot be null")
	private Boolean isPreMeltingDetailsMandatory;

//	@NotNull(message = "isGepExchangeOfferApplicable cannot be null")
//	private Boolean isGepExchangeOfferApplicable;

}
