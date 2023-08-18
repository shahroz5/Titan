/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * DTO class for update of Other Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Valid
public class ApprovalData {

	@NotNull(message = "approvalCode cannot be null")
	@NotBlank(message = "approvalCode cannot be empty")
	String approvalCode;

	@NotNull(message = "approvedBy cannot be null")
	@NotBlank(message = "approvedBy cannot be empty")
	String approvedBy;

}
