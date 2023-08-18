/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.core.dto.WorkflowTaskApproveDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.dto.WorkflowTaskListDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.ListBulkApprovalsDto;
import com.titan.poss.workflow.dto.response.ResendEmailResponse;
import com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto;
import com.titan.poss.workflow.dto.response.WorkflowTaskIndividualResponse;

/**
 * Service Interface for Workflow Task Service
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface WorkflowTaskService {

	/**
	 * This method will Return the COUNT from the Task DB and for APPROVAL and
	 * REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param approvalStatus
	 * @param workflowTypeList
	 * @return ListResponse<WorkflowTaskApproveCountDto>
	 */
	public ListResponse<WorkflowTaskApproveCountDto> getWorkflowTaskCount(String approvalStatus,
			List<String> workflowTypeList);

	/**
	 * This method will Update the Approval Status in both Task and Process Tables
	 * 
	 * @param workflowTaskApproveDto
	 * @param approved
	 * @param taskId
	 * @param processInstanceId
	 * @param taskName
	 * @return WorkflowTaskDetailsDto
	 */

	public WorkflowTaskDetailsDto approveWorkflowTask(WorkflowTaskApproveDto workflowTaskApproveDto, Boolean approved,
			String taskId, String processInstanceId, String taskName);

	/**
	 * This method will Return the Paged Response from the Task DB and for APPROVAL
	 * and REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param approvalStatus
	 * @param workflowType
	 * @return PagedRestResponse<WorkflowTaskDto>
	 */

	public PagedRestResponse<List<WorkflowTaskListDto>> listWorkflowTask(String approvalStatus, String workflowType,
			GETTaskListDTO getTaskListDTO, Pageable pageable);

	/**
	 * This method will Return the Individual Response from the DB.
	 * 
	 * @param taskId
	 * @param processId
	 * @param workflowType
	 * @param taskName
	 * @return WorkflowTaskIndividualResponse
	 */
	public WorkflowTaskIndividualResponse getWorkflowTask(String taskId, String processId, String workflowType,
			String taskName);

	/**
	 * This method will Complete the Approvals in Bulk and will update the
	 * Corresponding Status in Process and Task Tables.
	 * 
	 * @param approverRemarks
	 * @param listBulkApprovalsDto
	 * @return List<WorkflowTaskDetailsDto>
	 */
	public List<WorkflowTaskDetailsDto> approveWorkflowTasks(ListBulkApprovalsDto listBulkApprovalsDto);

	public List<WorkflowTaskDetailsDto> getWorkflowTasks(String processId, String workflowType);

	public ResendEmailResponse resendEmailLinkForDiscount(String processId, Pageable pageable);

}
