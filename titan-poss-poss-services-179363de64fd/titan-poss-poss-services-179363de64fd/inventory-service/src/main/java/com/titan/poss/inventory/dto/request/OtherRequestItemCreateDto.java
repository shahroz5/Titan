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
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public class OtherRequestItemCreateDto {

	@NotNull(message = "inventory id can't be null")
	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String inventoryId;

	@Positive
	private Short quantity;

	@Positive
	private BigDecimal measuredWeight;
}
