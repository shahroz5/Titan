/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.workflow.dao.WorkflowDecisionsDao;
import com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto;
import com.titan.poss.workflow.dto.response.PagedDecisionsApproverListDto;
/**
 * Repository for Workflow Decisions Approver Configuration
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("workflowDecisionsRepository")
public interface WorkflowDecisionsRepository extends JpaRepository<WorkflowDecisionsDao, String> {
	
	@Query("SELECT wfd FROM WorkflowDecisionsDao wfd where wfd.id = ?1")
	WorkflowDecisionsDao findByInputPKId(@Param("id") String id);
	
	/**
	 * This method will return the list of Workflow Approver details based on Inputs
	 *  
	 * @param workflowType
	 * @param level
	 * @param pageable
	 * @return Page<PagedDecisionsApproverListDto>
	 */
	@Query("SELECT new com.titan.poss.workflow.dto.response.PagedDecisionsApproverListDto(wfd.id, wfd.workflowType, "
				+ " wfd.level, wfd.approverRoleCode,  wfd.approverEmail) FROM WorkflowDecisionsDao wfd WHERE wfd.workflowType = :workflowType")
	Page<PagedDecisionsApproverListDto> findApproverListByWFType(@Param("workflowType") String workflowType, Pageable pageable);
	
	
	
	/**
	 * This method will return the list of Workflow Approver Code and Approver Email List details based on Workflow Type and Level No.
	 * 
	 * @param workflowType
	 * @param level
	 * return List<ApproverRoleCodeandApproverEmailListDto>
	 */
	
	@Query("SELECT new com.titan.poss.workflow.dto.request.ApproverRoleCodeandApproverEmailListDto(wfd.approverRoleCode, wfd.approverEmail) FROM WorkflowDecisionsDao wfd WHERE wfd.workflowType = :workflowType AND wfd.level = :level")
	List<ApproverRoleCodeandApproverEmailListDto> findApproverListByWFTypeAndLevel(@Param("workflowType") String workflowType, @Param("level") int level);
	
}
