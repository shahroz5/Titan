/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.workflow.service.WorkflowJobService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/workflow/v2/jobs")
public class JobController {
	
	@Autowired
	WorkflowJobService workflowJobService;
	
	@PutMapping(value = "/expire-pending-requests")
	@ResponseBody
	@ApiOperation(value = "Expire Pending Workflow Requests Automatically after a Configurable number of hours", notes = "This API invocation will Expire Pending Workflow Requests Automatically after a Configurable number of hours, through a Scheduler Job.")
	public SchedulerResponseDto expirePendingWorkflowRequests() {
		return workflowJobService.expirePendingWorkflowRequests("PENDING");
	}

}
