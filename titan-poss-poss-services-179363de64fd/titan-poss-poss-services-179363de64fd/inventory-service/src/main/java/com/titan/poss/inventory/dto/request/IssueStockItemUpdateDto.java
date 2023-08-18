/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.UUID_REGEX;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class IssueStockItemUpdateDto {

	@PositiveOrZero(message = "measured quantity should be more than 0")
	@NotNull
	private Short measuredQuantity;

	@Positive
	private BigDecimal measuredWeight;

	@PatternCheck(regexp = UUID_REGEX)
	private String inventoryId;

}
