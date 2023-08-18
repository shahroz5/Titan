/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.product.dto.response;


import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class KeyValueDto {

	@NotNull(message = "Please provide the code")
	@NotEmpty(message = "code cannot be Empty")
	@PatternCheck(regexp = RegExConstants.PRODUCT_LOV_CODE_REGEX)
	private String code;

	@NotNull(message = "Please provide the value")
	@NotEmpty(message = "value cannot be Empty")
	@PatternCheck(regexp = RegExConstants.PRODUCT_LOV_VALUE_REGEX)
	private String value;

	@NotNull(message = "Please provide the isActive")
	private Boolean isActive;

}
