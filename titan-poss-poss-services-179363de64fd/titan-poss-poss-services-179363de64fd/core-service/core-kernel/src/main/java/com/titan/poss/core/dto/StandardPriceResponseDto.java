/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

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
public class StandardPriceResponseDto {
	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true)
	private String metalTypeCode;

	@NotNull(message = "Please provide purity")
	@DecimalMin(value = "0", inclusive = true, message = "min value of purity is 0")
	@DecimalMax(value = "100", inclusive = true, message = "max value of purity is 100")
	@Digits(integer = 6, fraction = 7, message = "purity valid till {fraction} decimal places only")
	private BigDecimal purity;

	@NotNull(message = "Please provide ratePerUnit")
	@Positive(message = "Rate per unit must be positive")
	private BigDecimal ratePerUnit;

	@PatternCheck(regexp = CURRENCY_CODE_REGEX, nullCheck = true, message = "Please provide valid currency code")
	private String currency;

	@NotNull(message = "Please provide applicable date")
	private Date applicableDate;

	private BigDecimal karat;

	@Override
	public boolean equals(Object objectToCompare) {

		if (objectToCompare == null) {
			return false;
		}

		if (!(objectToCompare instanceof StandardPriceResponseDto)) {
			return false;
		}

		if (this == objectToCompare) {
			return true;
		}

		StandardPriceResponseDto inputObj = (StandardPriceResponseDto) objectToCompare;

		return (this.getMetalTypeCode().equals(inputObj.getMetalTypeCode())
				&& this.getRatePerUnit().compareTo(inputObj.getRatePerUnit()) == 0
				&& this.getPurity().compareTo(inputObj.getPurity()) == 0
				&& this.getCurrency().equals(inputObj.getCurrency())
				&& this.getApplicableDate().equals(inputObj.getApplicableDate())
				&& ((this.getKarat() == null && inputObj.getKarat() == null)
						|| (this.getKarat().compareTo(inputObj.getKarat()) == 0)));
	}

	@Override
	public int hashCode() {

		return this.getMetalTypeCode().hashCode() + this.getPurity().intValue() + this.getRatePerUnit().intValue()
				+ this.getApplicableDate().hashCode() + this.getCurrency().hashCode();
	}
}
