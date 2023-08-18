/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;

import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class AddGepRangeDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String rangeId;

	@PositiveOrZero(message = "percent value shoule be 0 or more than 0")
	private BigDecimal percentValue;
}
