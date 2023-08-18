/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.WorkflowConfigUpdateDto;
import com.titan.poss.workflow.dto.response.GetWorkflowConfigonWFTypeDto;
import com.titan.poss.workflow.dto.response.PagedListDto;
import com.titan.poss.workflow.dto.response.WorkflowConfigDto;
/**
 * Service interface for Workflow Configurations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("WorkflowConfigService")
public interface WorkflowConfigService {
	
	/**
	 * This method will return the list of Workflow Configurations details based on isActive Boolean Input
	 *  
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PagedListDto>>
	 */
	PagedRestResponse<List<PagedListDto>> listWorkflowConfig(Boolean isActive, Pageable pageable);
	
	
	/**
	 * This method will return the Workflow Configuration details based on the workflowType.
	 * 
	 * @param workflowType
	 * @return GetWorkflowConfigonWFTypeDto
	 */	
	GetWorkflowConfigonWFTypeDto getWorkflowConfig(String workflowType);
	
	
	/**
	 * This method will Create and Save the Workflow Configuration details.
	 * 
	 * @param workflowConfigDto
	 * @return WorkflowConfigDto
	 */
	WorkflowConfigDto createWorkflowConfig(WorkflowConfigDto workflowConfigDto);
	
	
	/**
	 * This method will update the Workflow Configuration details.
	 * 
	 * @param workflowType
	 * @param workflowConfigUpdateDto
	 * @return WorkflowConfigDto
	 */
	WorkflowConfigDto udpateWorkflowConfig(String workflowType, WorkflowConfigUpdateDto workflowConfigUpdateDto);	
	
}
