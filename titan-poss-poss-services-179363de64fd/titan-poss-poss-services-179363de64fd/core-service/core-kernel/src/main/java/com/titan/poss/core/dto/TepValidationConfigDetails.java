/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
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
public class TepValidationConfigDetails extends BaseFieldsValidator {

	@NotNull(message = "isFVTCNCancellationAllowed cannot be null")
	private Boolean isFVTCNCancellationAllowed;

	@NotNull(message = "fvtCNCancellationDeductionPercent cannot be null")
	@PositiveOrZero(message = "fvtCNCancellationDeductionPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "fvtCNCancellationDeductionPercent valid till 3 decimal places only")
	private BigDecimal fvtCNCancellationDeductionPercent;

	@NotNull(message = "isAnnexurePrintingAllowed cannot be null")
	private Boolean isAnnexurePrintingAllowed;

	@NotNull(message = "tepCancellationDays cannot be null")
	@PositiveOrZero(message = "tepCancellationDays should be 0 or more than 0")
	private Integer tepCancellationDays;

	@NotNull(message = "isInterBrandCashRefundAllowed cannot be null")
	private Boolean isInterBrandCashRefundAllowed;

}
