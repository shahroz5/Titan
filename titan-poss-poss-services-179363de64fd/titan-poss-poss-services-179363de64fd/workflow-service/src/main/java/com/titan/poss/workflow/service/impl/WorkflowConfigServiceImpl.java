/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.workflow.dao.WorkflowConfigDao;
import com.titan.poss.workflow.dto.request.WorkflowConfigUpdateDto;
import com.titan.poss.workflow.dto.response.GetWorkflowConfigonWFTypeDto;
import com.titan.poss.workflow.dto.response.PagedListDto;
import com.titan.poss.workflow.dto.response.WorkflowConfigDto;
import com.titan.poss.workflow.repository.WorkflowMasterRepository;
import com.titan.poss.workflow.service.WorkflowConfigService;
import com.titan.poss.workflow.util.GetBPMNProcessNameUtil;

/**
 * Service Implementation class for Workflow Configurations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowConfigService")
public class WorkflowConfigServiceImpl implements WorkflowConfigService {
	
	@Autowired
	WorkflowMasterRepository workflowMasterRepository;
	
	private static final String ERR_WRF_001 = "ERR-WRF-001";
	private static final String ERR_WRF_002 = "ERR-WRF-002";
	
	private static final String WORKFLOW_MASTER_CONFIG_ALREADY_AVAILABLE = "Workflow Master Config is already available";
	private static final String INVALID_WORKFLOW_TYPE = "The 'Workflow Type' Provided is Invalid. Please Provide a Valid Workflow Type";
	
	Logger logger = LoggerFactory.getLogger(WorkflowConfigServiceImpl.class);
	
	
	// GET The Workflow Configuration List with Paginated Response
	/**
	 * This method will return the list of Workflow Configurations details based on isActive Boolean Input
	 *  
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PagedListDto>>
	 */
	
	@Override
	public PagedRestResponse<List<PagedListDto>> listWorkflowConfig(Boolean isActive, Pageable pageable) {
		Page<PagedListDto> pgListDto;
		if (isActive == null) {
			pgListDto = workflowMasterRepository.findAllDetails(pageable);
		} else {
			pgListDto = workflowMasterRepository.findAllDetailsByIsActive(isActive, pageable);
		}
		return (new PagedRestResponse<>(pgListDto.getContent(), pgListDto));
	}
	
	
	
	
	// GET the Workflow Configuration details on Workflow Type
	/**
	 * This method will return the Workflow Configuration details based on the workflowType.
	 * 
	 * @param workflowType
	 * @return GetWorkflowConfigonWFTypeDto
	 */

	@Override
	public GetWorkflowConfigonWFTypeDto getWorkflowConfig(String workflowType) {
		
		WorkflowConfigDao workflowConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);		
		if(workflowConfigDao == null) {
			throw new ServiceException(INVALID_WORKFLOW_TYPE,ERR_WRF_002);
		}
		
		GetWorkflowConfigonWFTypeDto getWorkflowConfigonWFTypeDto;
		getWorkflowConfigonWFTypeDto = (GetWorkflowConfigonWFTypeDto) MapperUtil.getDtoMapping(workflowConfigDao, GetWorkflowConfigonWFTypeDto.class);

		return getWorkflowConfigonWFTypeDto;
	}
		
	
	
	
	// Create New Configurations for Workflow
	/**
	 * This method will Create and Save the Workflow Configuration details.
	 * 
	 * @param workflowConfigDto
	 * @return WorkflowConfigDto
	 */	
	@Transactional
	@Override
	public WorkflowConfigDto createWorkflowConfig(WorkflowConfigDto workflowConfigDto) {
		
		WorkflowConfigDao workflowConfigDao = workflowMasterRepository.findByWorkflowType(workflowConfigDto.getWorkflowType());
		
		if(workflowConfigDao!=null) {
			throw new ServiceException(WORKFLOW_MASTER_CONFIG_ALREADY_AVAILABLE,ERR_WRF_001);
		}
		
		
		 workflowConfigDao = (WorkflowConfigDao) MapperUtil.getObjectMapping(workflowConfigDto, new WorkflowConfigDao());		 
		 
		 // Set the Process Name based on Input 'Approval Level' for a given 'Workflow type'
		 GetBPMNProcessNameUtil getBPMNProcessNameUtil = new GetBPMNProcessNameUtil();
		 workflowConfigDao.setProcessName(getBPMNProcessNameUtil.getBPMNProcessNameUtilByWorkflowType(workflowConfigDto.getWorkflowType()));
		 	 		 	 
		 workflowMasterRepository.save(workflowConfigDao);		 
		
		return workflowConfigDto;	
	}
	
	
	
	
	
	// Update Existing Configurations
	/**
	 * This method will update the Workflow Configuration details.
	 * 
	 * @param workflowType
	 * @param workflowConfigUpdateDto
	 * @return WorkflowConfigDto
	 */	
	@Transactional
	@Override
	public WorkflowConfigDto udpateWorkflowConfig(String workflowType, WorkflowConfigUpdateDto workflowConfigUpdateDto) {
		
		WorkflowConfigDao wfConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);		
		
		if(wfConfigDao == null) {
			throw new ServiceException(INVALID_WORKFLOW_TYPE,ERR_WRF_002);
		}		
		
		wfConfigDao.setApprovalLevel(workflowConfigUpdateDto.getApprovalLevel());
		wfConfigDao.setIsEditable(workflowConfigUpdateDto.getIsEditable());
		wfConfigDao.setIsActive(workflowConfigUpdateDto.getIsActive());
		
		GetBPMNProcessNameUtil getBPMNProcessNameUtil = new GetBPMNProcessNameUtil();
		wfConfigDao.setProcessName(getBPMNProcessNameUtil.getBPMNProcessNameUtilByWorkflowType(workflowType));
		
		workflowMasterRepository.save(wfConfigDao);
		
		WorkflowConfigDto wfConfigDto;
		wfConfigDto = (WorkflowConfigDto) MapperUtil.getDtoMapping(workflowConfigUpdateDto, WorkflowConfigDto.class);
		wfConfigDto.setWorkflowType(workflowType);		
		
		return wfConfigDto;	
	}	

	
}
