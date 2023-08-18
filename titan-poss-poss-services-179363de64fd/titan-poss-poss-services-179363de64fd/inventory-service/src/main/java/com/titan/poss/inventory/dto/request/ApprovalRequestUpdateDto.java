/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;

import lombok.Data;

/**
 * DTO class for acceptance of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ApprovalRequestUpdateDto {

	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> itemIds;

	@NotNull(message = "Update status can't be null")
	@ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class)
	private String status;
	
	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX, nullCheck = false)
	private String remarks;

}
