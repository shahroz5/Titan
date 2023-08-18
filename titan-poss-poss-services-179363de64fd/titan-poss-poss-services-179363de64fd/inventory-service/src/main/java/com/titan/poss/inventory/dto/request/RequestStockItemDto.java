/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.Positive;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for item details at stock request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RequestStockItemDto {

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true)
	private String itemCode;

	@Positive
	private Short quantity;

}
