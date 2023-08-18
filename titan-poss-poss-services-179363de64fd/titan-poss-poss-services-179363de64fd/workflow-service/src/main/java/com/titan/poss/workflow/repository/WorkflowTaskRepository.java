/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.workflow.dao.WorkflowTaskDao;
import com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto;

/**
 * Handles repository operations for <b>Workflow Task</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("workflowTaskRepository")
public interface WorkflowTaskRepository extends JpaRepository<WorkflowTaskDao, String> {
	
	/**
	 * This method will return the COUNT of Workflow Processes based on Requestor 'locationCode', 'requestorUserName', 'approvalStatus'  and  'locationCode'
	 *  
	 * @param taskStatus
	 * @param approverUserName
	 * @return List<WorkflowTaskApproveCountDto>
	 */	
	
	@Query("SELECT new com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto(wft.taskStatus, wft.workflowType, count(wft.taskStatus)) "
			+ " FROM WorkflowTaskDao wft "
			+ " WHERE wft.approverUserName = :approverUserName"
			+ " AND wft.taskStatus = :taskStatus "
			+ " GROUP BY wft.workflowType,wft.taskStatus ORDER BY wft.workflowType")
				
	List<WorkflowTaskApproveCountDto> listTaskCounts(
									@Param("taskStatus") String taskStatus,
									@Param("approverUserName") String approverUserName);

	/**
	 * @param processId
	 * @param level
	 * @param taskStatus
	 * @return
	 */
	WorkflowTaskDao findByProcessIdAndLevelAndTaskStatus(String processId, int level, String taskStatus);

	List<WorkflowTaskDao> findAllByProcessIdAndWorkflowTypeAndTaskStatus(String processId, String workflowType, String taskStatus);

}
