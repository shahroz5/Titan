/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesWorkflowService")
public interface WorkflowService {

	public WorkflowProcessGetResponseDto getWorkflowProcess(String processId, String workflowType);

	Object cancelPendingRequests(String processId, String workflowType);

}
