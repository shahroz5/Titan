/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * DTO class for request structure of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class StockRequestCreateDto {

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true)
	private String srcLocationCode;

	@NotEmpty(message = "requested items can't be empty")
	private List<@Valid RequestStockItemDto> items;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX, nullCheck = true)
	private String remarks;

}
