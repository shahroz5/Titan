/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO class for Json details of order payment configuration
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentConfigDetails extends BaseFieldsValidator {

	@PositiveOrZero(message = "metalRateFrozenPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "metalRateFrozenPercent valid till 3 decimal places only")
	BigDecimal metalRateFrozenPercent;

	@PositiveOrZero(message = "metalRateNonFrozenPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "metalRateNonFrozenPercent valid till 3 decimal places only")
	BigDecimal metalRateNonFrozenPercent;

	@PositiveOrZero(message = "bestRatePercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "bestRatePercent valid till 3 decimal places only")
	BigDecimal bestRatePercent;

}
