/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.service.clients.WorkflowServiceClient;
import com.titan.poss.sales.service.WorkflowService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesWorkflowServiceImpl")
public class WorkflowServiceImpl implements WorkflowService {

	@Autowired
	WorkflowServiceClient workflowClient;

	@Override
	public WorkflowProcessGetResponseDto getWorkflowProcess(String processId, String workflowType) {
		return workflowClient.getWorkflowProcess(processId, workflowType);

	}

	@Override
	public Object cancelPendingRequests(String processId, String workflowType) {
		return workflowClient.cancelPendingRequests(processId, workflowType, null);
	}
}
