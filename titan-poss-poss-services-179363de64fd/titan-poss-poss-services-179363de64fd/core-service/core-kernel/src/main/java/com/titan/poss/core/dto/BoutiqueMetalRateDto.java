/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

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
public class BoutiqueMetalRateDto {

	@PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX, nullCheck = true)
	private String metalTypeCode;

	@NotNull(message = "Please provide ratePerUnit")
	@Positive(message = "Rate per unit must be positive")
	private BigDecimal ratePerUnit;
}
