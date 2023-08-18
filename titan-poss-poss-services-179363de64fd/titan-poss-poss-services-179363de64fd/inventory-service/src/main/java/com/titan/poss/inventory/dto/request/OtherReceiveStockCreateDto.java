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
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OtherReceiveStockCreateDto {

	@NotEmpty(message = "Received items can't be empty")
	private List<@Valid ReceiveItemDto> items;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX, nullCheck = true)
	private String remarks;

}
