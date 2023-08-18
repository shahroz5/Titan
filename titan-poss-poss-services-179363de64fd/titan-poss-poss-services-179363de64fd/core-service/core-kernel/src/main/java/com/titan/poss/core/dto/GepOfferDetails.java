/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.TodayOrFutureDay;

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
public class GepOfferDetails extends BaseFieldsValidator {

	@PositiveOrZero(message = "gepCNUtilizationPercentage should be 0 or more than 0")
//	@NotNull(message = "gepCNUtilizationPercentage cannot be null")
	@Max(value = 100, message = "gepCNUtilizationPercentage cannot be more than 100")
	@Digits(integer = 6, fraction = 3, message = "gepCNUtilizationPercentage valid till 3 decimal places only")
	private BigDecimal gepCNUtilizationPercentage;

//	@TodayOrFutureDay
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date gepDiscountStartDate;

	@TodayOrFutureDay
	private Date gepDiscountEndDate;

	@PositiveOrZero(message = "daysForGEPCNAfterOffer should be 0 or more than 0")
//	@NotNull(message = "daysForGEPCNAfterOffer cannot be null")
	private Integer daysForGEPCNAfterOffer;

	@PositiveOrZero(message = "daysForGRNAndRebillingAfterOffer should be 0 or more than 0")
//	@NotNull(message = "daysForGRNAndRebillingAfterOffer cannot be null")
	private Integer daysForGRNAndRebillingAfterOffer;

	@PositiveOrZero(message = "grnCNUtilizationPercentage should be 0 or more than 0")
//	@NotNull(message = "grnCNUtilizationPercentage cannot be null")
	@Max(value = 100, message = "grnCNUtilizationPercentage cannot be more than 100")
	@Digits(integer = 6, fraction = 3, message = "grnCNUtilizationPercentage valid till 3 decimal places only")
	private BigDecimal grnCNUtilizationPercentage;

	private Boolean isRivaah;
}
