/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowProcessGetResponseDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.response.CancelPendingRequestsResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.request.ProcessListFilterRequestDto;
import com.titan.poss.workflow.dto.response.ProcessCountDto;
import com.titan.poss.workflow.dto.response.WorkflowProcessListDto;

/**
 * Service Interface for Workflow Process
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface WorkflowProcessService {

	/**
	 * This method will return the list of Workflow Process based on Requestor
	 * 'locationCode', 'requestorUserName', 'processId' and 'locationCode'
	 * 
	 * @param processId
	 * @param workflowType
	 * @param requestorUserName
	 * @param locationCode
	 * @return WorkflowProcessDao
	 */
	public WorkflowProcessGetResponseDto getWorkflowProcess(String processId, String workflowType);

	/**
	 * This will fetch the List of Count w.r.t Workflow type and Status from the
	 * Process DB.
	 * 
	 * @param status
	 * @return ListResponse<ProcessCountDto>
	 */
	public ListResponse<ProcessCountDto> getWorkflowProcessCount(String status);

	/**
	 * This will Start the Process Instanace and return Response to Requestor
	 * 
	 * @param workflowType
	 * @param workflowProcessCreateDto
	 * @return WorkflowProcessCreateResponseDto
	 */
	public WorkflowProcessCreateResponseDto createWorkflowProcess(
			@ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			WorkflowProcessCreateDto workflowProcessCreateDto);

	/**
	 * This will fetch the List of Results on the basis of Workflow type, Approval
	 * Status and Requestor UserName and Location Code.
	 * 
	 * @param workflowType
	 * @param status
	 * @param docNo
	 * @param fiscalYear
	 * @param date
	 * @param startDate
	 * @param endDate
	 * @param pageable
	 * @return PagedRestResponse<WorkflowProcessRequestDto>
	 */
	public PagedRestResponse<List<WorkflowProcessListDto>> listWorkflowProcess(String workflowType, String status,
			ProcessListFilterRequestDto processListFilterRequestDto, Pageable pageable);

	
	
	/**
	 * @param processId
	 * @param workflowType
	 * @param approvalStatus
	 * @return CancelPendingRequestsResponseDto
	 */
	public CancelPendingRequestsResponseDto cancelPendingOrCloseApprovedRequests(String processId, String workflowType,
			String approvalStatus);
	
}
