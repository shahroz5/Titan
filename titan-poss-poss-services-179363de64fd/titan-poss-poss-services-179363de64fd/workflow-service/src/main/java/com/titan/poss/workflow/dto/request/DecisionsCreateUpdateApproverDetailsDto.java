/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * DTO Request for Creating or Updating Approver Details for Decisions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DecisionsCreateUpdateApproverDetailsDto {
	
	@NotNull
	private String approverRoleCode;
	
	@NotNull
	private String approverEmail;
}
