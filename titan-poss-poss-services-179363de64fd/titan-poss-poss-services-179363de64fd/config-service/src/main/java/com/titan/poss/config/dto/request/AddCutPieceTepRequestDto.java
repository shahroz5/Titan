/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AddCutPieceTepRequestDto {

	@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX, nullCheck = true)
	private String productCategoryCode;

	@PositiveOrZero(message = "cutPieceTepPercent cannot be less than 0")
	@Digits(integer = 6, fraction = 3, message = "cutPieceTepPercent valid till 3 decimal places only")
	private BigDecimal cutPieceTepPercent;
}
