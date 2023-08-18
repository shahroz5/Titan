/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.List;

import javax.validation.Valid;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.filter.FeignClientInterceptor;

import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "workflowContextId", name = "workflow-service", configuration = FeignClientInterceptor.class)
public interface WorkflowServiceClient {

	@GetMapping(value = "workflow/v2/workflow-process/{processId}")
	public WorkflowProcessGetResponseDto getWorkflowProcess(@PathVariable("processId") String processId,
			@ApiParam(name = "workflowType", value = "'workflowType' Requested", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType);

	// Inter-Service Call to Workflow Service to Expire Requests Older than
	// Configured Hours.
	@PutMapping(value = "/workflow/v2/jobs/expire-pending-requests")
	public SchedulerResponseDto expirePendingWorkflowRequests(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@PostMapping(value = "workflow/v2/workflow-process/{processId}")
	Object cancelPendingRequests(@PathVariable(required = true, name = "processId") String processId,
			@RequestParam(name = "workflowType") String workflowType,
			@RequestParam(name = "approvalStatus") String approvalStatus);

	@PostMapping(value = "workflow/v2/workflow-process")
	WorkflowProcessCreateResponseDto createWorkflowProcess(
			@ApiParam(name = "workflowType", value = "'workflowType' to Request", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "body", value = "Workflow Configuration that needs to be Approved", required = true) @RequestBody @Valid WorkflowProcessCreateDto workflowProcessCreateDto);

	@GetMapping("workflow/v2/workflow-task/getTasks")
	List<WorkflowTaskDetailsDto> getWorkflowTasks(
			@RequestParam(required = true, name = "processId") @ApiParam(value = "processId", required = true) String processId,
			@RequestParam(required = true, name = "workflowType") @ApiParam(value = "Workflow Type", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType);

	
}
