/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.workflow.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.WorkflowConfigUpdateDto;
import com.titan.poss.workflow.dto.response.GetWorkflowConfigonWFTypeDto;
import com.titan.poss.workflow.dto.response.PagedListDto;
import com.titan.poss.workflow.dto.response.WorkflowConfigDto;
import com.titan.poss.workflow.service.WorkflowConfigService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;
/**
 * Controller Class for Workflow Configurations
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("workflowConfigController")
@RequestMapping("workflow/v2/workflow-configs")
@Api(tags= {"workflow-config-controller"})
@Validated
public class WorkflowConfigController {
	
	@Autowired
	private WorkflowConfigService workflowConfigService;
	

	/**
	 * This method will return the list of Workflow Configurations.
	 * 
	 * @param pageable
	 * @param isActive
	 * @return PagedRestResponse<List<PagedListDto>>
	 */
		
	@ApiOperation(value="View the list of Workflow Configs", notes = "This API will give list of workflow configs based on isActive")
	@GetMapping	
	@ApiPageable
	public PagedRestResponse<List<PagedListDto>> listWorkflowConfig(
				@RequestParam(value = "Select if you want to filter by 'isActive'", required = false) Boolean isActive, 
				@ApiIgnore Pageable pageable){		
		return workflowConfigService.listWorkflowConfig(isActive, pageable);
	}
	
	
	
	/**
	 * This method will return the Workflow Configuration details based on the Workflow Type.
	 * 
	 * @param workflowType
	 * @return GetWorkflowConfigonWFTypeDto
	 */
	
	@ApiOperation(value="View Config details based on Workflow type", notes = "This API will give details of workflow configuration for a give **Workflow Type**")
	@GetMapping(value="/{workflowType}")
	public GetWorkflowConfigonWFTypeDto getWorkflowConfig(				
				@ApiParam(name = "workflowType", value = "'workflowType' to Get Details based on that", required = true) @PathVariable("workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType) {		
		return workflowConfigService.getWorkflowConfig(workflowType);
	}
	
	
	
	/**
	 * This method will save the Workflow Configuration details.
	 * 
	 * @param workflowConfigDto
	 * @return WorkflowConfigDto
	 */
		
	@ApiOperation(value="Create New Workflow Configurations using this API", notes = "This API will Create Workflow Configurations")
	@PostMapping
	public WorkflowConfigDto createWorkflowConfig(
				@ApiParam(name = "body", value = "Workflow Configuration that needs to be created", required = true)
				@RequestBody @Valid WorkflowConfigDto workflowConfigDto) {		
		return workflowConfigService.createWorkflowConfig(workflowConfigDto);
	}
	
	
	/**
	 * This method will update the Workflow Configurations
	 * 
	 * @param workflowType
	 * @param workflowConfigUpdateDto
	 * @return WorkflowConfigDto
	 */
	
	@ApiOperation(value="API to Update the Workflow Config for a given workflow type", notes="This API will Update the Workflow Configuration for a given workflow type")
	@PutMapping(value = "/{workflowType}")
	public WorkflowConfigDto udpateWorkflowConfig(
			@ApiParam(name = "workflowType", value = "'workflowType' to edit", required = true) @PathVariable("workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType, 
			@ApiParam(name = "body", value = "Workflow Configuration that needs to be edited", required = true)  @RequestBody @Valid WorkflowConfigUpdateDto workflowConfigUpdateDto) {
				
		return workflowConfigService.udpateWorkflowConfig(workflowType, workflowConfigUpdateDto);
	}

}
