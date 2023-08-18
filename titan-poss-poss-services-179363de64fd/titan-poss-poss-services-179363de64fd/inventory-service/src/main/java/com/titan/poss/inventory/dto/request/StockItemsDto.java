/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import static com.titan.poss.core.domain.constant.RegExConstants.UUID_REGEX;

import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public class StockItemsDto {

	@PatternCheck(regexp = UUID_REGEX, nullCheck = true)
	private String inventoryId;
}
