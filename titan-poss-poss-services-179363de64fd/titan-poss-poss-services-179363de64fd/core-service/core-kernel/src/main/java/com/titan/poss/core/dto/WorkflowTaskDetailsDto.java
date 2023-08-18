package com.titan.poss.core.dto;

import lombok.Data;
/**
 * 
 * DTO for Task Details 
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowTaskDetailsDto {
	
	private String taskId;
	private String processId;
	private String requestorUserName;
    private String taskStatus;
	private int totalApproverLevels;
	private int level;	
	private String approverRoleCode;
	private String approverUserName;
	private String approverRemarks;
	private String approverCode;
	
}
