package com.titan.poss.workflow.dto.request;

import com.titan.poss.core.enums.WorkflowTypeEnum;

import lombok.Data;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowConfigAddDto {
	
	private WorkflowTypeEnum workflowType; 
	private int approvalLevel;
	private Boolean isPartialAllowed;
	private String reminderFrequency;
	private int reminderCount;
	private String processName;
	private Boolean isActive;
}
