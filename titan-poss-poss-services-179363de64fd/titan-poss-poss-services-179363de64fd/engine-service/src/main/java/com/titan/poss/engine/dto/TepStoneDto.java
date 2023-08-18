/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class TepStoneDto {

	@PatternCheck(regexp = RegExConstants.STONE_CODE_REGEX, nullCheck = true)
	private String stoneCode;

	@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX, nullCheck = true)
	private String stoneTypeCode;

	@PatternCheck(regexp = RegExConstants.STONE_QUALITY_REGEX, nullCheck = true)
	private String stoneQuality;

	@Positive(message = "carat should be more than 0")
	@NotNull(message = "carat should not be null")
	private BigDecimal carat;

}
