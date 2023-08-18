/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import javax.validation.constraints.Size;

import com.titan.poss.core.response.JsonData;

import lombok.Data;
/**
 * 
 * DTO class for Approving Workflow Task
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowTaskApproveDto {	
	
	@Size(max=250)
	private String approverRemarks;
	
	private JsonData approvedData;
	
}
