/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Response Class to Map the Paginated Response for a WorkflowType
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagedListDto {
	private String workflowType; 
	private int approvalLevel;
	private Boolean isEditable;
	private Boolean isActive;	
}
