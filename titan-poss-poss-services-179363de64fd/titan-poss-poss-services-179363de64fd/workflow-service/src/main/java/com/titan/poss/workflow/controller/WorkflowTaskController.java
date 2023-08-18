/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
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
import com.titan.poss.core.dto.GETTaskListDTO;
import com.titan.poss.core.dto.WorkflowTaskApproveDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.dto.WorkflowTaskListDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.workflow.dto.constants.TaskNameEnum;
import com.titan.poss.workflow.dto.constants.WorkflowTaskStatusEnum;
import com.titan.poss.workflow.dto.request.ListBulkApprovalsDto;
import com.titan.poss.workflow.dto.response.ResendEmailResponse;
import com.titan.poss.workflow.dto.response.WorkflowTaskApproveCountDto;
import com.titan.poss.workflow.dto.response.WorkflowTaskIndividualResponse;
import com.titan.poss.workflow.service.WorkflowTaskService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller Class for Workflow Task Approver and related details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("workflow/v2/workflow-task")
@Api(tags = { "workflow-task-controller" })
@Validated
public class WorkflowTaskController {

	@Autowired
	WorkflowTaskService workflowTaskService;

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
	@ApiOperation(value = "Approve a Workflow Process", notes = "This API will Approve a Workflow Process <br>" + "<br>"
			+ " **NOTE:-** The **'approvedData'** field will have the same value as **'requestData'** in case the Approver Does Not Edit the Data. Else, the value will be the new Updated Data from the Approver.")
	@PutMapping(value = "/approval")
	public WorkflowTaskDetailsDto approveWorkflowTask(
			@ApiParam(name = "taskName", value = "The Task Name for the Corresponding Approver/User", allowableValues = "REQUEST_APPROVER_L1, REQUEST_APPROVER_L2, REQUEST_APPROVER_L3", required = true) @RequestParam(name = "taskName") @ValueOfEnum(enumClass = TaskNameEnum.class) String taskName,
			@ApiParam(name = "body", value = "The Request Body Contains the Approver Comments and the Edited Data(if required to be updated) ", required = true) @RequestBody @Valid WorkflowTaskApproveDto workflowTaskApproveDto,
			@ApiParam(name = "approved", value = "Whether the Request Can be Approved or Not?", required = true) @RequestParam Boolean approved,
			@ApiParam(name = "taskId", value = "The Valid Task ID of the Approver", required = true) @RequestParam @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Task ID. Please provide a valid one.") String taskId,
			@ApiParam(name = "processId", value = "The Valid Process ID related to the Tasks", required = true) @RequestParam @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Process ID. Please provide a valid one.") String processId) {

		return workflowTaskService.approveWorkflowTask(workflowTaskApproveDto, approved, taskId, processId, taskName);
	}

	/**
	 * This method will Return the Paged Response from the Task DB and for APPROVAL
	 * and REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param workflowTaskApproveDto
	 * @param approvalStatus
	 * @param pageable
	 * @return PagedRestResponse<List<WorkflowTaskListDto>>
	 */
	@ApiOperation(value = "List of Tasks w.r.t Approval Status", notes = "This API will List down the Tasks for approval for the logged in Approver User for a given Workflow Type<br>"
			+ " By default data will be available for **TODAY** only if the value of **dateRangeType** is Not Provided. \n"
			+ " The **'dateRangeType'** Valid Values can be **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM, ALL** search is available too. \n"
			+ " Filtering Details w.r.t Request Doc No and Fiscal Year is also available for a logged in Approver. \n"
			+ " **'docFromDate'** and **'docFromDate'** corresponds to **'startDate'** **& 'endDate'** respectively and **'dateRangeType'** value would be **CUSTOM**. \n"
			+ " For **CUSTOM** search, **startDate & endDate** are mandatory.\n "
			+ " For **TODAY,LAST_WEEK, LAST_MONTH, LAST_YEAR, ALL** search, **startDate & endDate** are NOT Mandatory.\n "
			+ " For **ALL** dateRangeType, **startDate & endDate** are NOT Mandatory. It will fetch **ALL Records** raised in the past till current Day. \n "
			+ "<br>"
			+ "<span style=\"font-size:14px;\">For Valid **'filterParams'** Key Names, Refer sample json with suffix '_FILTER_VALUES' for the provided Workflow Type and Provide the Corresponding Filter Value.\n"
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/workflow-service/src/main/resources/com/titan/poss/workflow/json\">"
			+ "		WORKFLOW - SAMPLE FILTER 'KEY' NAME FOR A WORKFLOW TYPE." + "	</a><br/>" + "</span><br>"
			+ " **NOTES:-** \n"
			+ " **1.** For Filtering Results for a given Date Range, please set the **dateRangeType** field value to **CUSTOM** and the set the Date Range as Doc From and Doc To Date")
	@PostMapping
	@ApiPageable
	public PagedRestResponse<List<WorkflowTaskListDto>> listWorkflowTask(
			@RequestParam(required = true, name = "approvalStatus") @ApiParam(value = "Approval Status", allowableValues = "APPROVED,REJECTED,PENDING, CLOSED", required = true) @ValueOfEnum(enumClass = WorkflowTaskStatusEnum.class) String approvalStatus,
			@ApiParam(name = "workflowType", value = "'workflowType' to Get LIST", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "body", value = "Applied Filters for fetching the List", required = true) @RequestBody @Valid GETTaskListDTO getTaskListDTO,
			@ApiIgnore Pageable pageable) {

		return workflowTaskService.listWorkflowTask(approvalStatus, workflowType, getTaskListDTO, pageable);
	}

	/**
	 * This method will Return the Individual Response from the DB.
	 * 
	 * @param taskId
	 * @param processId
	 * @param workflowType
	 * @param taskName
	 * @return WorkflowTaskIndividualResponse
	 */
	@ApiOperation(value = "Get the details of task based on task id", notes = "This API will get details of task for a given task id and the process Instance Id.")
	@GetMapping(value = "/{taskId}")
	public WorkflowTaskIndividualResponse getWorkflowTask(
			@ApiParam(name = "taskId", value = "The Task ID of the Approver", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Task ID. Please provide a valid one.") String taskId,
			@ApiParam(name = "processId", value = "The Process ID related to the Tasks", required = true) @RequestParam @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Process ID. Please provide a valid one.") String processId,
			@ApiParam(name = "workflowType", value = "'workflowType' to Get LIST", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "taskName", value = "The Task Name for the Corresponding Approver/User", allowableValues = "REQUEST_APPROVER_L1, REQUEST_APPROVER_L2, REQUEST_APPROVER_L3", required = true) @RequestParam(name = "taskName") @ValueOfEnum(enumClass = TaskNameEnum.class) String taskName) {

		return workflowTaskService.getWorkflowTask(taskId, processId, taskName, workflowType);
	}

	/**
	 * This method will Return the COUNT from the Task DB and for APPROVAL and
	 * REJECTED Status. For PENDING status it will fetch from the Camunda DB.
	 * 
	 * @param approvalStatus
	 * @param workflowTypeList
	 * @return ListResponse<WorkflowTaskApproveCountDto>
	 */
	@ApiOperation(value = "Count of workflow tasks for approval", notes = "This API will give the count of approvals")
	@GetMapping(value = "/count")
	public ListResponse<WorkflowTaskApproveCountDto> getWorkflowTaskCount(
			@RequestParam(required = true, name = "approvalStatus") @ApiParam(value = "Approval Status", allowableValues = "APPROVED,REJECTED,PENDING", required = true) @ValueOfEnum(enumClass = WorkflowTaskStatusEnum.class) String approvalStatus,
			@RequestParam(required = true, name = "workflowType") @ApiParam(value = "List of Workflow Types", required = true) List<@ValueOfEnum(enumClass = WorkflowTypeEnum.class) String> workflowTypeList) {
		return workflowTaskService.getWorkflowTaskCount(approvalStatus, workflowTypeList);
	}

	/**
	 * This method will Update the Approval Status in both Task and Process Tables
	 * for List of Approval Inputs
	 * 
	 * @deprecated  As of next Release
	 * 
	 * @param listBulkApprovalsDto
	 * @param approved
	 * @param taskId
	 * @param processInstanceId
	 * @param taskName
	 * @return List<WorkflowTaskDetailsDto>
	 */
	@ApiOperation(value = "Approve Workflow Process in bulk", notes = "This API will Approve a list of Pending Workflow Processes <br>"
				+ "**NOTE**: This API will be **DEPRECATED** Going Forward as This Internally Uses **Camunda API in Loop** which is an Antipattern."
				+ " Instead use **/approval** API and call that in Loop from UI itself")
	@PutMapping(value = "/approvals")
	@Deprecated(since="")
	public List<WorkflowTaskDetailsDto> approveBulkWorkflowTasks(
			@ApiParam(name = "body", value = "The Request Body Contains the List of TaskIds, TaskNames, Process Instance IDs, Approver Comments and Whether Request can be Approved or Not", required = true) @RequestBody @Valid ListBulkApprovalsDto listBulkApprovalsDto) {

		return workflowTaskService.approveWorkflowTasks(listBulkApprovalsDto);
	}
	
	@ApiOperation(value = "API to get rejected tasks of given process id", notes = "API to get rejected tasks of given process id")
	@GetMapping("/getTasks")
	public List<WorkflowTaskDetailsDto> getWorkflowTasks(
			@RequestParam(required = true, name = "processId") @ApiParam(value = "processId", required = true) String processId,
			@RequestParam(required = true, name = "workflowType") @ApiParam(value = "Workflow Type", required = true) @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType) {

		return workflowTaskService.getWorkflowTasks(processId,workflowType);
	}
	@ApiOperation(value = "Resend the Request over the email", notes = "This API will Resend the Request over the email")
	@GetMapping(value = "/resendEmail")
	public ResendEmailResponse resendEmailLinkForDiscount(@RequestParam(required = true) @ApiParam(value = "Process ID") String processId,
			@ApiIgnore Pageable pageable) {		
		
		return workflowTaskService.resendEmailLinkForDiscount(processId,pageable);
		
	}

}
