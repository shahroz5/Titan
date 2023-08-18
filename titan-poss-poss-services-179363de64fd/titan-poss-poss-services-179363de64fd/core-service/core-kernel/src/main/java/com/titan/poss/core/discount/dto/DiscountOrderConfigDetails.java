/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

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
public class DiscountOrderConfigDetails extends BaseFieldsValidator {

	private Boolean isGoldRateFrozenForCO;

	private Boolean isGoldRateFrozenForAB;

	private Boolean isDisplayOnAB;

	private Boolean isAllowedToChangeCO;
	
	private Boolean isAllowedToChangeAB;

	private Boolean isDisplayOnCO;

	private Integer offerPeriodForCO;

	private Integer offerPeriodForAB;

	@Digits(integer = 6, fraction = 3, message = "Utilization Percentage valid till 3 decimal places only")
	private BigDecimal coPercent;

	@Digits(integer = 6, fraction = 3, message = "Utilization Percentage valid till 3 decimal places only")
	private BigDecimal abPercent;
}
