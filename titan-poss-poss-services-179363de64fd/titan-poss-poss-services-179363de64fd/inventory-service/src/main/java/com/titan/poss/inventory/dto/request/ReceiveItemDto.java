/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReceiveItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = true)
	private String binCode;

	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX, nullCheck = true)
	private String binGroupCode;

	@NotNull(message = "value cannot be null")
	@Positive(message = "value should be more than 0")
	private BigDecimal value;

	@NotNull(message = "measuredWeight cannot be null")
	@Positive(message = "measuredWeight should be more than 0")
	private BigDecimal measuredWeight;

	@NotNull(message = "quantity cannot be null")
	@Positive(message = "quantity should be more than 0")
	private Short quantity;
	
	private Boolean isHallmarked;

}
