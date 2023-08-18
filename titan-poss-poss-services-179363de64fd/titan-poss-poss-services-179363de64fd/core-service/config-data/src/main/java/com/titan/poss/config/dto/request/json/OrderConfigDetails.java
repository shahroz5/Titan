/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;

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
public class OrderConfigDetails extends BaseFieldsValidator {

	Boolean isGoldRateFrozenForCO;

	Boolean isGoldRateFrozenForAB;

	Integer offerPeriodForCO;

	Integer offerPeriodForAB;

	@Digits(integer = 6, fraction = 3, message = "Utilization Percentage valid till 3 decimal places only")
	BigDecimal coPercent;

	@Digits(integer = 6, fraction = 3, message = "Utilization Percentage valid till 3 decimal places only")
	BigDecimal abPercent;
}
