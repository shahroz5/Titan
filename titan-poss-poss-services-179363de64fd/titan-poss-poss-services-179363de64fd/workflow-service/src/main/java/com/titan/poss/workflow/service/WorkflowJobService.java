/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.SchedulerResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface WorkflowJobService {
	
	/**
	 * This method will be called while Auto Expiring Workflow Requests Pending after a specific Configurable number of hours.
	 * 
	 * @return SchedulerResponseDto.
	 * 
	 */
	SchedulerResponseDto expirePendingWorkflowRequests(String status);

}
