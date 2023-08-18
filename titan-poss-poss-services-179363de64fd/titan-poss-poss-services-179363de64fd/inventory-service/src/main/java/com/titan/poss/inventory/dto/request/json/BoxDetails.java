/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for update of Other Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class BoxDetails {

	@PositiveOrZero(message = "Serial number should be greater than 0")
	Integer serialNumber;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, nullCheck = true)
	String boxNumber;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, nullCheck = true)
	String lockNumber;

	@NotNull(message = "Weight Unit cannot be null")
	@NotBlank(message = "Weight Unit cannot be empty")
	String weightUnit;

}
