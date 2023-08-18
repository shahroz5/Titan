/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import lombok.Data;

/**
 * Response DTO  Class for Completing Class and Reading Process Variables
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CompleteTaskAllLevelsResponseDto {
	
	private String workflowType;
	private String status;
	private String approverRoleCode;
	private int approvalLevel;
	private Boolean isEditable;
	private String requestor;
	private int level;
}
