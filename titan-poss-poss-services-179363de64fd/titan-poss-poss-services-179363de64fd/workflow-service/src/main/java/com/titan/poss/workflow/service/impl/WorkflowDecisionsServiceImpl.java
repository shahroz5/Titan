/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dao.WorkflowConfigDao;
import com.titan.poss.workflow.dao.WorkflowDecisionsDao;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.dto.request.DecisionsCreateUpdateApproverDetailsDto;
import com.titan.poss.workflow.dto.response.DecisionsApproverDto;
import com.titan.poss.workflow.dto.response.DecisionsCreateUpdateApproverDetailsResponseDto;
import com.titan.poss.workflow.dto.response.PagedDecisionsApproverListDto;
import com.titan.poss.workflow.repository.WorkflowDecisionsRepository;
import com.titan.poss.workflow.repository.WorkflowMasterRepository;
import com.titan.poss.workflow.service.WorkflowDecisionsService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowDecisionsServiceImpl")
public class WorkflowDecisionsServiceImpl implements WorkflowDecisionsService{
	
	@Autowired
	private WorkflowDecisionsRepository wfDecisionsRepository;
	
	@Autowired
	private WorkflowMasterRepository workflowMasterRepository;
		
	private static final String ERR_WRFDEC_001 = "ERR-WRFDEC-001";	
	private static final String WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_MSG = "Workflow Master Config is Not Available. Please Create Workflow Configurations first and Try again.";
	private static final String WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_CAUSE = "No Master Configuration Found for Input Workflow Type.";
	
	private static final String ERR_WRFDEC_002 = "ERR-WRFDEC-002";	
	private static final String WORKFLOW_APPROVAL_CONFIG_NOT_FOUND_MSG = "Workflow Master Approval Decisions Config Not Found for the Input Id. Please Create Decisions Approval Configurations first and Try again.";
	private static final String WORKFLOW_APPROVAL_CONFIG_NOT_FOUND_CAUSE = "Workflow Approval Configurations Not Found";
	
	private static final Logger LOGGER = Logger.getLogger(WorkflowDecisionsServiceImpl.class.getName());
	
	// GET The Workflow Approval Configuration List with Paginated Response from Decisions Table
	/**
	 * This method will return the list of Workflow Configurations details based on	 * isActive Boolean Input
	 * 
	 * @param workflowType
	 * @param level
	 * @param pageable
	 * @return PagedRestResponse<List<PagedDecisionsApproverListDto>>
	 */
	@Override
	public PagedRestResponse<List<PagedDecisionsApproverListDto>> listWorkflowDecisions(String workflowType, Pageable pageable) {
		Page<PagedDecisionsApproverListDto> pgDecisionsApproverListDto;
		pgDecisionsApproverListDto = wfDecisionsRepository.findApproverListByWFType(workflowType, pageable);
		
		
		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailListDto1;
		List<ApproverRoleCodeandApproverEmailListDto> approverRoleCodeandApproverEmailListDto2;		
		
		
		approverRoleCodeandApproverEmailListDto1 = wfDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType,1);		
		approverRoleCodeandApproverEmailListDto2 = wfDecisionsRepository.findApproverListByWFTypeAndLevel(workflowType,2);
		
		LOGGER.log(Level.INFO, () -> "approverRoleCodeandApproverEmailListDto1: " + approverRoleCodeandApproverEmailListDto1 + "'.");
		LOGGER.log(Level.INFO, () -> "approverRoleCodeandApproverEmailListDto2: " + approverRoleCodeandApproverEmailListDto2 + "'.");
		
		return (new PagedRestResponse<>(pgDecisionsApproverListDto.getContent(), pgDecisionsApproverListDto));
	}
	
	
	// GET the Approval Configuration details on Unique Id, Workflow Type and Approval Level No. from Decisions Table
	/**
	 * This method will return the Workflow Decisions Approval Configuration details based on Unique Id, Workflow Type and Approval Level No.
	 * 
	 * @param id
	 * @param workflowType
	 * @param level
	 * @return DecisionsApproverDto
	 */
	@Override
	public DecisionsApproverDto getWorkflowDecisionApprover(String id, String workflowType, int level) {
		Optional<WorkflowDecisionsDao> workflowDecisionsDao = wfDecisionsRepository.findById(id);
		DecisionsApproverDto decisionsApproverDto = new DecisionsApproverDto();
				
		decisionsApproverDto.setId(id);
		decisionsApproverDto.setWorkflowType(workflowType);
		decisionsApproverDto.setLevel(level);
		
		String approverCodeList = workflowDecisionsDao.map(WorkflowDecisionsDao::getApproverRoleCode).orElse(null);
		String approverEmailList = workflowDecisionsDao.map(WorkflowDecisionsDao::getApproverEmail).orElse(null);
		
		decisionsApproverDto.setApproverRoleCode(approverCodeList);
		decisionsApproverDto.setApproverEmail(approverEmailList);
		
		return decisionsApproverDto;		
	}

	// Create New Approval Configurations for a given Workflow in Decisions Table
	/**
	 * This method will Create and Save the Workflow Approval Configuration details.
	 * 
	 * @param workflowType
	 * @param level
	 * @param decisionsCreateUpdateApproverDetailsDto
	 * @return DecisionsCreateUpdateApproverDetailsResponseDto
	 */
	@Transactional
	@Override
	public DecisionsCreateUpdateApproverDetailsResponseDto createWorkflowDecisionsApprovers(String workflowType, int level, DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto) {
		String approverRoleCodeList = StringUtils.EMPTY;
		String approverEmailList = StringUtils.EMPTY;
		
		WorkflowConfigDao workflowConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);
		if(workflowConfigDao == null) {
			throw new ServiceException(WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_MSG,ERR_WRFDEC_001,WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_CAUSE);
		}
		
		if(level > workflowConfigDao.getApprovalLevel()) {
			throw new ServiceException("The Maximum Approval Level for Input Workflow is Configured as: "
					+ workflowConfigDao.getApprovalLevel()
					+ ". Please provide the maximum value of 'level' less than or equal to "
					+ workflowConfigDao.getApprovalLevel(), "ERR_WRFDEC_003",
					"Input Level is more than the Maximum Configured Approval Level for the Input Workflow.");
		}
		
		if (decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode() != null) {
			approverRoleCodeList = decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode();
		}
		
		if(decisionsCreateUpdateApproverDetailsDto.getApproverEmail() != null) {
			approverEmailList = decisionsCreateUpdateApproverDetailsDto.getApproverEmail();
		}
		
		WorkflowDecisionsDao workflowDecisionsDao = new WorkflowDecisionsDao();
		workflowDecisionsDao.setWorkflowType(workflowType);
		workflowDecisionsDao.setLevel(level);
		workflowDecisionsDao.setApproverRoleCode(approverRoleCodeList);
		workflowDecisionsDao.setApproverEmail(approverEmailList);
		
		wfDecisionsRepository.save(workflowDecisionsDao);
		
		DecisionsCreateUpdateApproverDetailsResponseDto decisionsCreateUpdateApproverDetailsResponseDto = new DecisionsCreateUpdateApproverDetailsResponseDto();
		
		decisionsCreateUpdateApproverDetailsResponseDto.setWorkflowType(workflowType);
		decisionsCreateUpdateApproverDetailsResponseDto.setLevel(level);
		decisionsCreateUpdateApproverDetailsResponseDto.setApproverRoleCode(decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode());
		decisionsCreateUpdateApproverDetailsResponseDto.setApproverEmail(decisionsCreateUpdateApproverDetailsDto.getApproverEmail());
		
		
		return decisionsCreateUpdateApproverDetailsResponseDto;
	}
	
	// Update Existing Approval Configurations in Decisions Table
	/**
	 * This method will update the Workflow Configuration details.
	 * 
	 * @param id
	 * @param workflowType
	 * @param level
	 * @param decisionsCreateUpdateApproverDetailsDto
	 * @return DecisionsCreateUpdateApproverDetailsResponseDto
	 */
	@Transactional
	@Override
	public DecisionsCreateUpdateApproverDetailsResponseDto updateWorkflowDecisionsApprovers(String id, String workflowType,int level, DecisionsCreateUpdateApproverDetailsDto decisionsCreateUpdateApproverDetailsDto) {
		WorkflowConfigDao wfConfigDao = workflowMasterRepository.findByWorkflowType(workflowType);		
		WorkflowDecisionsDao wfDecisionsDao = wfDecisionsRepository.findByInputPKId(id);
		
		if(wfConfigDao == null) {
			throw new ServiceException(WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_MSG,ERR_WRFDEC_001,WORKFLOW_MASTER_CONFIG_NOT_AVAILABLE_CAUSE);
		}
		if(wfDecisionsDao == null) {
			throw new ServiceException(WORKFLOW_APPROVAL_CONFIG_NOT_FOUND_MSG,ERR_WRFDEC_002,WORKFLOW_APPROVAL_CONFIG_NOT_FOUND_CAUSE);
		}
		
		if(level > wfConfigDao.getApprovalLevel()) {
			throw new ServiceException("The Maximum Approval Level for Input Workflow is Configured as: "
					+ wfConfigDao.getApprovalLevel()
					+ ". Please provide the maximum value of 'level' less than or equal to "
					+ wfConfigDao.getApprovalLevel(), "ERR_WRFDEC_003",
					"Input Level is more than the Maximum Configured Approval Level for the Input Workflow.");
		}
		
		String approverRoleCodeList = StringUtils.EMPTY;
		String approverEmailList = StringUtils.EMPTY;
		
		if (decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode() != null) {
			approverRoleCodeList = decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode();
		}			
		
		if(decisionsCreateUpdateApproverDetailsDto.getApproverEmail() != null) {
			approverEmailList = decisionsCreateUpdateApproverDetailsDto.getApproverEmail();
		}
		
		wfDecisionsDao.setWorkflowType(workflowType);
		wfDecisionsDao.setLevel(level);
		wfDecisionsDao.setApproverRoleCode(approverRoleCodeList);
		wfDecisionsDao.setApproverEmail(approverEmailList);
		
		wfDecisionsRepository.save(wfDecisionsDao);
		
		DecisionsCreateUpdateApproverDetailsResponseDto decisionsCreateUpdateApproverDetailsResponseDto = new DecisionsCreateUpdateApproverDetailsResponseDto();
		decisionsCreateUpdateApproverDetailsResponseDto.setId(id);
		decisionsCreateUpdateApproverDetailsResponseDto.setWorkflowType(workflowType);
		decisionsCreateUpdateApproverDetailsResponseDto.setLevel(level);
		decisionsCreateUpdateApproverDetailsResponseDto.setApproverRoleCode(decisionsCreateUpdateApproverDetailsDto.getApproverRoleCode());
		decisionsCreateUpdateApproverDetailsResponseDto.setApproverEmail(decisionsCreateUpdateApproverDetailsDto.getApproverEmail());
		
		
		return decisionsCreateUpdateApproverDetailsResponseDto;
	}
	
	
	
	
	// DELETE the Approval Configuration details on Unique Id and Workflow Type from Decisions Table
	/**
	 * This method will DELETE the Workflow Decisions Approval Configuration details based on Unique Id and Workflow Type.
	 * 
	 * @param id
	 * @param workflowType
	 * @return DecisionsApproverDto
	 */
	@Override
	public DecisionsApproverDto deleteWorkflowDecisionApprover(String id, String workflowType) {
		WorkflowDecisionsDao workflowDecisionsDao = wfDecisionsRepository.findByInputPKId(id);
		
		if(!(workflowType.equalsIgnoreCase(workflowDecisionsDao.getWorkflowType()))) {
			throw new ServiceException(
					"The Provided Workflow Type Doesnot correspond to the given Workflow. Please provide a valid Workflow Type and Id Combination.",
					"ERR_WRFDEC_004",
					"Invalid Workflow Type and 'id' Combination.");
		}
		//Delete Records from Repository
		wfDecisionsRepository.deleteById(id);
		
		DecisionsApproverDto decisionsApproverDto = new DecisionsApproverDto();
		
		//Deleted Record Details: Response Dto
		decisionsApproverDto.setId(id);
		decisionsApproverDto.setWorkflowType(workflowType);
		
		int level = workflowDecisionsDao.getLevel();
		String approverCodeList = workflowDecisionsDao.getApproverRoleCode();
		String approverEmailList = workflowDecisionsDao.getApproverEmail();
		
		decisionsApproverDto.setLevel(level);
		decisionsApproverDto.setApproverRoleCode(approverCodeList);
		decisionsApproverDto.setApproverEmail(approverEmailList);

		return decisionsApproverDto;
	}

}
