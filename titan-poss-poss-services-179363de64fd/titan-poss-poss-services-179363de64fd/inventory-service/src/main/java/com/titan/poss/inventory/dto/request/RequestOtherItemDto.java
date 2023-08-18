/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * DTO class for item details at other transaction request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RequestOtherItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = false)
	private String lotNumber;

	@Positive(message = "quantity should be more than 0")
	private Short quantity;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;

	// Added measured weight for PSV and ADJUSTMENT
	@PositiveOrZero(message = "measuredWeight should be more than or equals to 0")
	private BigDecimal measuredWeight;

	JsonData itemDetails;

	@PatternCheck(regexp = RegExConstants.BIN_REGEX, nullCheck = false)
	private String binCode;

	private BigDecimal measuredValue;
}
