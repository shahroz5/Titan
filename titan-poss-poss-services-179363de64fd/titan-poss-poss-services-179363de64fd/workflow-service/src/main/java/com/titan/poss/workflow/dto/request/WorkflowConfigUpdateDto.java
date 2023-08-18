package com.titan.poss.workflow.dto.request;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import lombok.Data;
/**
 * DTO Class for Updating Master Configurations of a given Workflow Type
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowConfigUpdateDto {
	@NotNull
	@Max(2)
	private int approvalLevel;
	
	@NotNull
	private Boolean isEditable;
	
	@NotNull
	private Boolean isActive;

}
