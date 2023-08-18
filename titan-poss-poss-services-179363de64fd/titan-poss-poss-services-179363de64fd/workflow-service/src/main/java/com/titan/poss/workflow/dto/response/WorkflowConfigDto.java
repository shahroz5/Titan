/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.dto.response;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;

import lombok.Data;
/**
 * DTO Response for Responding while Creating Workflow Configurations
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowConfigDto {
	
	@NotNull
	@ValueOfEnum(enumClass = WorkflowTypeEnum.class)
	private String workflowType;
	
	@NotNull
	@Max(2)
	private int approvalLevel;
	
	@NotNull
	private Boolean isEditable;	
	private Boolean isActive;
}
