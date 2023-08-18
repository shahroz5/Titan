/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetalRateWithWeightDto {

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true)
	private String metalTypeCode;

	@NotNull(message = "Please provide total metal weight")
	@PositiveOrZero(message = "Total metal weight must be positive  or zero") // zero when manual bill is by request
																				// approval
	@Digits(integer = 6, fraction = DomainConstants.WEIGHT_SCALE, message = "total metal weight is valid till {integer} integral digits {fraction} and decimal places only")
	private BigDecimal totalMetalWeight;

	@NotNull(message = "Please provide ratePerUnit")
	@Positive(message = "Rate per unit must be positive")
	@Digits(integer = 10, fraction = DomainConstants.PRICE_SCALE, message = "Rate per unit is valid till {integer} integral digits and {fraction} decimal places only")
	private BigDecimal ratePerUnit;

	@Override
	public boolean equals(Object objectToCompare) {

		if (objectToCompare == null) {
			return false;
		}

		if (!(objectToCompare instanceof MetalRateWithWeightDto)) {
			return false;
		}

		if (this == objectToCompare) {
			return true;
		}

		MetalRateWithWeightDto inputObj = (MetalRateWithWeightDto) objectToCompare;

		return (this.getMetalTypeCode().equals(inputObj.getMetalTypeCode())
				&& this.getRatePerUnit().compareTo(inputObj.getRatePerUnit()) == 0);
	}

	@Override
	public int hashCode() {

		return this.getMetalTypeCode().charAt(0) + this.getRatePerUnit().intValue();
	}
}
