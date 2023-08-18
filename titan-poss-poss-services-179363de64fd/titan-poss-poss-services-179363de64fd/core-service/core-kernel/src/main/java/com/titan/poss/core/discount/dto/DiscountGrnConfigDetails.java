/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.discount.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Positive;

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
public class DiscountGrnConfigDetails extends BaseFieldsValidator {

	@Positive
	private Integer noOfDaysAllowedBeforeOfferPeriod;
	
	@Positive
	private Integer noOfDaysAllowedAfterOfferPeriod;

	@Digits(integer = 6, fraction = 3, message = "Utilization Percentage valid till 3 decimal places only")
	private BigDecimal utilizationPercent;
	
	private Boolean isAllowedBeforeOffer;
	
	private Boolean isSameCfaEligible;

}
