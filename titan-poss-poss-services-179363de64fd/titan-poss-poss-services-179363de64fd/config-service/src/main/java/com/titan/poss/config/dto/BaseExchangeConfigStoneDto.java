/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class BaseExchangeConfigStoneDto {

	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX, nullCheck = true)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX, nullCheck = true)
	private String stoneQuality;

	@NotNull(message = "Deduction percent cannot be null")
	@PositiveOrZero(message = "Deduction percent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "Deduction percent valid till 3 decimal places only")
	@Max(value = 100, message = "deductionPercent cannot be more than 100")
	private BigDecimal dedutionPercent;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String rangeId;

}
