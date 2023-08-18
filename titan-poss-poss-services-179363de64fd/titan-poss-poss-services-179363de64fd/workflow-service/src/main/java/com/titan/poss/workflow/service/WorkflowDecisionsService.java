/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.DecisionsCreateUpdateApproverDetailsDto;
import com.titan.poss.workflow.dto.response.DecisionsApproverDto;
import com.titan.poss.workflow.dto.response.DecisionsCreateUpdateApproverDetailsResponseDto;
import com.titan.poss.workflow.dto.response.PagedDecisionsApproverListDto;

/**
 * Service interface for Workflow Decisions
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("WorkflowDecisionsService")
public interface WorkflowDecisionsService {
		
	/**
	 * This method will return the list of Approver Details with Approver Role Code and Approver Email.
	 *  
	 * @param workflowType
	 * @param level
	 * @param pageable
	 * @return PagedRestResponse<List<PagedDecisionsApproverListDto>>
	 */
	PagedRestResponse<List<PagedDecisionsApproverListDto>> listWorkflowDecisions(String workflowType, Pageable pageable);
	
	
	/**
	 * This method will return the Individual Workflow Approver details based on the unique Id Input.
	 * 
	 * @param workflowType
	 * @param level
	 * @return GetWorkflowConfigonWFTypeDto
	 */	
	DecisionsApproverDto getWorkflowDecisionApprover(String id, String workflowType,  int level);
	
	
	/**
	 * This method will Create and Save the Approver details based on Input for Decisions in BPMN.
	 * 
	 * @param workflowConfigDto
	 * @return WorkflowConfigDto
	 */
	DecisionsCreateUpdateApproverDetailsResponseDto createWorkflowDecisionsApprovers(String workflowType, int level, DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto);
	
	
	/**
	 * This method will update the Existing Details for Approvers in the Workflow Decision Table 
	 * 
	 * @param workflowType
	 * @param workflowConfigUpdateDto
	 * @return WorkflowConfigDto
	 */
	DecisionsCreateUpdateApproverDetailsResponseDto updateWorkflowDecisionsApprovers(String id, String workflowType,int level, DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto);
		
	

	/**
	 * This method will DELETE the Workflow Decisions Approval Configuration details based on Unique Id and Workflow Type.
	 * 
	 * @param id
	 * @param workflowType
	 * @return DecisionsApproverDto
	 */
	DecisionsApproverDto deleteWorkflowDecisionApprover(String id, String workflowType);
}	
