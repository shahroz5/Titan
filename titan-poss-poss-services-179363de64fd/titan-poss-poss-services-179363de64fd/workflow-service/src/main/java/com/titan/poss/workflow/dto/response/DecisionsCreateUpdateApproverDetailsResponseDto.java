/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import lombok.Data;

/**
 * DTO Response for Creating or Updating Approver Details for Decisions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DecisionsCreateUpdateApproverDetailsResponseDto {
	
	private String id;
	private String workflowType;	
	private int level;
	private String approverRoleCode;
	private String approverEmail;
	
}
