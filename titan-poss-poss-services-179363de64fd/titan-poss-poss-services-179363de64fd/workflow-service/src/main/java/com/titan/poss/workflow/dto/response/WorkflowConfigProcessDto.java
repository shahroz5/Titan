/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for Workflow Config Process
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
public class WorkflowConfigProcessDto {		
		private String workflowType; 
		private int approvalLevel;
		private Boolean isEditable;
		private Boolean isActive;
		private String processName;				
}
