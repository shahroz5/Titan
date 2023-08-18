/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class StoneSearchRequestDto {

	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX)
	private String stoneCode;

	@Positive(message = "from std value should be more than 0")
	private BigDecimal fromStdValue;

	@Positive(message = "to std value should be more than 0")
	private BigDecimal toStdValue;

	private String color;

	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX)
	private String quality;

	@Positive(message = "rate per carat should be more than 0")
	private BigDecimal ratePerCarat;
}
