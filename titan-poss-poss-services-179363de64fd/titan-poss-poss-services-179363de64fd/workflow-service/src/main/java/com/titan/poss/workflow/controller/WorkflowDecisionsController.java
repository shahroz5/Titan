/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.DecisionsCreateUpdateApproverDetailsDto;
import com.titan.poss.workflow.dto.response.DecisionsApproverDto;
import com.titan.poss.workflow.dto.response.DecisionsCreateUpdateApproverDetailsResponseDto;
import com.titan.poss.workflow.dto.response.PagedDecisionsApproverListDto;
import com.titan.poss.workflow.service.WorkflowDecisionsService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller Class for Workflow Approval Configurations for Decisions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("workflowDecisionsController")
@RequestMapping("workflow/v2/workflow-decisions")
@Api(tags= {"workflow-decisions-controller"})
@Validated
public class WorkflowDecisionsController {
	
	@Autowired
	private WorkflowDecisionsService wfDecisionsService;
	
	/**
	 * This method will return the list of Workflow Configurations details based on	 * isActive Boolean Input
	 * 
	 * @param workflowType
	 * @param level
	 * @param pageable
	 * @return PagedRestResponse<List<PagedDecisionsApproverListDto>>
	 */
	@ApiOperation(value="View the list of Workflow Approval Configs for Decisions", notes = "This API will give list of workflow Approval Configs based on **Level No.** and **Workflow Type** Inputs")
	@GetMapping(value="/list")
	@ApiPageable
	public PagedRestResponse<List<PagedDecisionsApproverListDto>> listWorkflowApprovalConfig(
				@RequestParam(value = "The Input Workflow Type for which the List Approval List needs to be fetched", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
				@ApiIgnore Pageable pageable){		
		return wfDecisionsService.listWorkflowDecisions(workflowType, pageable);
	}
	
	
	/**
	 * This method will return the Workflow Configuration details based on Unique Id, Workflow Type and Approval Level No.
	 * 
	 * @param id
	 * @param workflowType
	 * @param level
	 * @return DecisionsApproverDto
	 */
	@ApiOperation(value="View Individual Approval Config details for Decisions based on Unique Id, Level No. and Workflow Type", notes = "This API will give details of Decision Approval Configuration for a given **Unique Id**,**Level No.** and **Workflow Type**")
	@GetMapping(value="/{id}")
	public DecisionsApproverDto getIndividualDecisionsApprovalConfig(				
				@ApiParam(name = "id", value = "'Input Unique Id' to Get Details based on that", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid 'id' Field. Please provide a valid 'id'.") String id,
				@RequestParam(value = "The Input Workflow Type for which Individual Decision Approval Detail needs to be fetched", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
				@RequestParam(value = "The Approval level No. for a given Workflow", required = true) @Min(value = 1, message = "Please Provide Minimum Approval level as 1. Request need to go with atleast 1 Level of Approval.") int level) {		
		return wfDecisionsService.getWorkflowDecisionApprover(id, workflowType, level);
	}
	
	
	
	/**
	 * This method will Create and Save the Workflow Approval Configuration details.
	 * 
	 * @param workflowType
	 * @param level
	 * @param decisionsCreateUpdateApproverDetailsDto
	 * @return DecisionsCreateUpdateApproverDetailsResponseDto
	*/
	@ApiOperation(value="Create New Decision Approval Configurations using this API", notes = "This API will Create Decisions Approval Configurations for a given Workflow Type")
	@PostMapping
	public DecisionsCreateUpdateApproverDetailsResponseDto createDecisionsApprovalConfig(
				@RequestParam(value = "The Input Workflow Type for which Individual Decision Approval Detail needs to be Created", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
				@RequestParam(value = "The Approval level No. for a given Workflow", required = true) @Min(value = 1, message = "Please Provide Minimum Approval level as 1. Request need to go with atleast 1 Level of Approval.") int level,
				@ApiParam(name = "body", value = "Decisions Approval Configuration that needs to be created", required = true) @RequestBody @Valid DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto) {		
		return wfDecisionsService.createWorkflowDecisionsApprovers(workflowType, level, decisionsCreateUpdateApproverDetailsDto);
	}
	
	
	/**
	 * This method will update the Workflow Configuration details.
	 * 
	 * @param id
	 * @param workflowType
	 * @param level
	 * @param decisionsCreateUpdateApproverDetailsDto
	 * @return DecisionsCreateUpdateApproverDetailsResponseDto
	 */
	@ApiOperation(value="API to Update Decision Approval Configurations for a given workflow type", notes="This API will Update Decisions Approval Configurations for a given Workflow Type")
	@PutMapping(value = "/{id}")
	public DecisionsCreateUpdateApproverDetailsResponseDto updateDecisionsApprovalConfig(
			@ApiParam(name = "id", value = "'Input Unique Id' to Update Decisions Approval Configurations based on that", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid 'id' Field. Please provide a valid 'id'.") String id,
			@RequestParam(value = "The Input Workflow Type for which Individual Decision Approval Detail needs to be Created", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@RequestParam(value = "The Approval level No. for a given Workflow", required = true) @Min(value = 1, message = "Please Provide Minimum Approval level as 1. Request need to go with atleast 1 Level of Approval.") int level, 
			@ApiParam(name = "body", value = "Decision Approval Configurations that need to be edited", required = true)  @RequestBody @Valid DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto) {
				
		return wfDecisionsService.updateWorkflowDecisionsApprovers(id, workflowType, level, decisionsCreateUpdateApproverDetailsDto);
	}
	
	
	/**
	 * This method will DELETE the Workflow Decisions Approval Configuration details based on Unique Id and Workflow Type.
	 * 
	 * @param id
	 * @param workflowType
	 * @return DecisionsApproverDto
	 */
	@ApiOperation(value="Delete Decision Approver Configuration", notes = "This API will give DELETE Records of Decision Approval Configuration for a given **Unique Id** and **Workflow Type**")
	@DeleteMapping(value="/{id}")
	public DecisionsApproverDto deleteWorkflowDecisionApproverConfig(				
				@ApiParam(name = "id", value = "'Input Unique Id' to Get Details based on that", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid 'id' Field. Please provide a valid 'id'.") String id,
				@RequestParam(value = "The Input Workflow Type for which Individual Decision Approval Detail which needs to be Deleted", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType) {		
		return wfDecisionsService.deleteWorkflowDecisionApprover(id, workflowType);
	}

}
