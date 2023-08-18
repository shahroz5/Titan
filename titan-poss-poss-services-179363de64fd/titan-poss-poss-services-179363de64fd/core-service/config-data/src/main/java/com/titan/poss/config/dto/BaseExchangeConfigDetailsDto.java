/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.TodayOrFutureDay;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class BaseExchangeConfigDetailsDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String rangeId;

	@NotNull(message = "deductionPercent cannot be nulll")
	@PositiveOrZero(message = "deductionPercent should be 0 or more than 0")
	@Digits(integer = 6, fraction = 3, message = "deductionPercent valid till 3 decimal places only")
	@Max(value = 100, message = "deductionPercent cannot be more than 100")
	private BigDecimal deductionPercent;

//	@NotNull(message = "schemePercent cannot be nulll")
	@PositiveOrZero(message = "schemePercent should be 0 or more than 0")
	@Digits(integer = 6, fraction = 3, message = "schemePercent valid till 3 decimal places only")
	@Max(value = 100, message = "schemePercent cannot be more than 100")
	private BigDecimal schemePercent;

//	@NotNull(message = "startDate cannot be null")
	@TodayOrFutureDay
	private Date startDate;

	@TodayOrFutureDay
//	@NotNull(message = "endDate cannot be null")
	private Date endDate;

	@PatternCheck(regexp = RegExConstants.METAL_TYPE_REGEX, nullCheck = true)
	private String metalType;

	@PatternCheck(regexp = RegExConstants.GEP_ITEM_TYPE_REGEX, nullCheck = true)
	private String itemType;

}
