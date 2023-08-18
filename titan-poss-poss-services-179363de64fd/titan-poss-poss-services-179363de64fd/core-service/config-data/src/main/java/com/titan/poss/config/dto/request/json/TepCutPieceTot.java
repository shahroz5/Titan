/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

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
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TepCutPieceTot extends BaseFieldsValidator {

	@PositiveOrZero(message = "l3DeductionPercent should be 0 or more than 0")
	@Max(value = 100, message = "l3DeductionPercent cannot be more than 100")
	@Digits(integer = 6, fraction = 3, message = "l3DeductionPercent valid till 3 decimal places only")
	private BigDecimal l3DeductionPercent;

}
