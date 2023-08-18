/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ConversionRequestItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true)
	private String lotNumber;

	@Positive(message = "measured weight should be more than 0")
	private BigDecimal measuredWeight;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;

	@PatternCheck(regexp = RegExConstants.BIN_REGEX)
	private String binCode;

	private Boolean sold;
}
