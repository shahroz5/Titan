/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;

import lombok.Data;

/**
 * DTO class for updating an approval request item
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ApprovalRequestItemUpdateDto {

	@PositiveOrZero(message = "quantity should be 0 or more than 0")
	private Short quantity;

	@NotNull(message = "Update status of the requesting item can't be null")
	@ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class)
	private String status;

}
