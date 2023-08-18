/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class UpdateExchangeConfigStoneRequestDto {

	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX)
	private String stoneQuality;

	@PositiveOrZero(message = "Deduction percent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "Deduction percent valid till 3 decimal places only")
	@Max(value = 100, message = "dedutionPercent cannot be more than 100")
	private BigDecimal dedutionPercent;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String rangeId;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String id;

	@Positive(message = "rowId should be more than 0")
	private Integer rowId;

}
