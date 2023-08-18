/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.workflow.dao.WorkflowConfigDao;
import com.titan.poss.workflow.dto.response.PagedListDto;
import com.titan.poss.workflow.dto.response.WorkflowConfigProcessDto;

/**
 * Handles repository operations for <b>Workflow Configurations</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("workflowConfigRepository")
public interface WorkflowMasterRepository extends JpaRepository<WorkflowConfigDao, String> {
	
	WorkflowConfigDao findByWorkflowType(String workflowType);

	/**
	 * This method will return the list of Workflow Config details based on Boolean value 'isActive'
	 *  
	 * @param isActive
	 * @param pageable
	 * @return Page<PagedListDto>
	 */
	@Query("SELECT new com.titan.poss.workflow.dto.response.PagedListDto(wfm.workflowType, wfm.approvalLevel, "
				+ " wfm.isEditable, wfm.isActive) FROM WorkflowConfigDao wfm WHERE wfm.isActive = :isActive")
	Page<PagedListDto> findAllDetailsByIsActive(@Param("isActive") Boolean isActive, Pageable pageable);
	
	
	/**
	 * This method will return the Complete list of Workflow Config details
	 * 
	 * @param pageable
	 * @return Page<PagedListDto>
	 */
	
	@Query("SELECT new com.titan.poss.workflow.dto.response.PagedListDto(wfm.workflowType, wfm.approvalLevel, wfm.isEditable, wfm.isActive) "
			+ " FROM WorkflowConfigDao wfm")
	Page<PagedListDto> findAllDetails(Pageable pageable);
	
	
	
	@Query("SELECT new com.titan.poss.workflow.dto.response.WorkflowConfigProcessDto(wfm.workflowType, wfm.approvalLevel, wfm.isEditable, wfm.isActive, wfm.processName) FROM WorkflowConfigDao wfm WHERE wfm.workflowType = :workflowType")
	WorkflowConfigProcessDto findRecordByWorkflowType(@Param("workflowType") String workflowType);
	
}
