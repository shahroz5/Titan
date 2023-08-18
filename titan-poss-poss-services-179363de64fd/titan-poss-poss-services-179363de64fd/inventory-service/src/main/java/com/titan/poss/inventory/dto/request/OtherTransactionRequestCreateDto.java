/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * DTO class for request structure of other transaction Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OtherTransactionRequestCreateDto {

	@NotEmpty(message = "requested items can't be empty")
	@NotNull
	private List<@Valid RequestOtherItemDto> items;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;

	JsonData approvalDetails; // other than CONV

	JsonData otherDetails; // its only for CONV, if child codes are not available , need to pass
							// description (NAP-4501)

}
