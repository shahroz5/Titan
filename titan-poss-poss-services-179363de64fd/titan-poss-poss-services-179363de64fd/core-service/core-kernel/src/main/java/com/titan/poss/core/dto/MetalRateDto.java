/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dto to get metal rate.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetalRateDto {

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true)
	private String metalTypeCode;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true)
	private String metalName;

	@NotNull(message = "Please provide the offset")
	@DecimalMin(value = "0", inclusive = true, message = "min value of offset is 0")
	@DecimalMax(value = "3", inclusive = true, message = "max value of offset is 3")
	@Digits(integer = 2, fraction = 5, message = "offset valid till 5 decimal places only")
	private BigDecimal offset;

	@DecimalMin(value = "0", inclusive = true, message = "min value of karat is 0")
	@DecimalMax(value = "24", inclusive = true, message = "max value of karat is 24")
	@Digits(integer = 6, fraction = 3, message = "karat valid till 3 decimal places only")
	private BigDecimal karatage;

	@NotNull(message = "Please provide purity")
	@DecimalMin(value = "0", inclusive = true, message = "min value of purity is 0")
	@DecimalMax(value = "100", inclusive = true, message = "max value of purity is 100")
	@Digits(integer = 6, fraction = 7, message = "purity valid till {fraction} decimal places only")
	private BigDecimal purity;

	@NotNull(message = "Please provide ratePerUnit")
	private BigDecimal ratePerUnit;

	@PatternCheck(regexp = CURRENCY_CODE_REGEX, nullCheck = true)
	private String currency;

	@NotNull(message = "Please provide applicable date")
	private Date applicableDate;

	@NotNull(message = "Please provide unit")
	private String unit;

	@Override
	public boolean equals(Object objectToCompare) {

		if (objectToCompare == null) {
			return false;
		}

		if (!(objectToCompare instanceof MetalRateDto)) {
			return false;
		}

		if (this == objectToCompare) {
			return true;
		}

		MetalRateDto inputObj = (MetalRateDto) objectToCompare;

		return (this.getMetalTypeCode().equals(inputObj.getMetalTypeCode())
				&& this.getMetalName().equals(inputObj.getMetalName())
				&& this.getOffset().compareTo(inputObj.getOffset()) == 0
				&& this.getRatePerUnit().compareTo(inputObj.getRatePerUnit()) == 0
				&& this.getPurity().compareTo(inputObj.getPurity()) == 0
				&& this.getCurrency().equals(inputObj.getCurrency())
				&& this.getApplicableDate().equals(inputObj.getApplicableDate()));
	}

	@Override
	public int hashCode() {

		return this.getMetalTypeCode().charAt(0) + this.getOffset().intValue() + this.getRatePerUnit().intValue();
	}

}
