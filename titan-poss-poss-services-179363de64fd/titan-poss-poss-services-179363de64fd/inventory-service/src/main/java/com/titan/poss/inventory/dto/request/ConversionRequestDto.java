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
public class ConversionRequestDto {
		
	private Integer requestId;

	//parent items
	@NotEmpty(message = "issueItems can't be null")
	private List<@Valid ConversionRequestItemDto> issueItems;

	//child items
	@NotEmpty(message = "receiveItems can't be null")
	private List<@Valid ConversionRequestChildItemDto> receiveItems;

	@PatternCheck(regexp = RegExConstants.USER_NAME_REGEX, nullCheck = true)
	private String rsoName;

}
