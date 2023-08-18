/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.workflow.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
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
import com.titan.poss.workflow.service.WorkflowProcessService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller Class for Workflow Process
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("workflow/v2/workflow-process")
@Api(tags = { "workflow-process-controller" })
@Validated
public class WorkflowProcessController {

	@Autowired
	WorkflowProcessService workflowProcessService;

	Logger logger = LoggerFactory.getLogger(WorkflowProcessController.class);

	/**
	 * This will Start the Process Instance and return Response to Requestor
	 * 
	 * @param workflowType
	 * @param workflowProcessCreateDto
	 * @return WorkflowProcessCreateResponseDto
	 */
	@ApiOperation(value = "Create workflow process for approval request", notes = "This API will Create Workflow Process for Approval Request. This API will be called by Client Services(Requestor)<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\"><br>Workflow Type:</span>" 
			+ "<ul>" 
			+ "	<li>BILL_CANCELLATION</li>"
			+ "	<li>APPROVE_RO_PAYMENT</li>" 
			+ "	<li>MANUAL_BILL</li>"
			+ "	<li>MANUAL_BILL_GRF</li>"
			+ "	<li>ACTIVATE_ADVANCE_BOOKING</li>"
			+ "	<li>ADVANCE_BOOKING_MANUAL_BILL</li>"
			+ "	<li>CANCEL_ADVANCE_BOOKING</li>"
			+ "	<li>CREDIT_NOTE_CANCELLATION</li>"
			+ "	<li>CREDIT_NOTE_GOLD_RATE_REMOVE</li>"
			+ "	<li>CREDIT_NOTE_TRANSFER</li>"
			+ "	<li>CREDIT_NOTE_ACTIVATE</li>"
			+ "	<li>GOODS_RETURN</li>"
			+ "</ul>"
			+ "<span style=\"font-size:14px;\">To understand sample Request and Header Data, Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/workflow-service/src/main/resources/com/titan/poss/workflow/json\">"
			+ "		WORKFLOW - REQUEST & HEADER DATA SAMPLE"
			+ "	</a><br/>"
			+ "</span><br>"
			+ " **NOTE:** For Approvals by a Boutique, **approverLocationCode** is **Mandatory** field in headerData of Request API.")
	@PostMapping
	public WorkflowProcessCreateResponseDto createWorkflowProcess(
			@ApiParam(name = "workflowType", value = "'workflowType' to Request", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "body", value = "Workflow Configuration that needs to be Approved", required = true) @RequestBody @Valid WorkflowProcessCreateDto workflowProcessCreateDto) {

		return workflowProcessService.createWorkflowProcess(workflowType, workflowProcessCreateDto);
	}

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
	@ApiOperation(value = "View list of Workflow Process w.r.t to different Filters Input for a logged In User", notes = "This API will give the list of Workflow Process filtered w.r.t different Filters Input for a logged In User of a particular location. \n"
			+ " By default data will be available for **TODAY** only if the value of **dateRangeType** is Not Provided. \n"
			+ " The **'dateRangeType'** Valid Values can be **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM, ALL** search is available too. \n"
			+ " Filtering Details w.r.t **Request Doc No** and **Fiscal Year** is also available for a logged in User for a particular location. \n"
			+ " **status** is an Optional Input field and it will fetch the records for the provided input.  \n"
			+ " In case any value of **status** is Not Selected, it will fetch ALL the records.  \n"
			+ " Please select **APPROVED**, **REJECTED**, **PENDING**, **CLOSED** OR **CANCELLED** as valid values for filtering results w.r.t status. \n"
			+ " For **CUSTOM** search, **startDate & endDate** are Mandatory. \n "
			+ " For **TODAY,LAST_WEEK, LAST_MONTH, LAST_YEAR, ALL** search, **startDate & endDate** are NOT Mandatory. \n "
			+ " **NOTE:** \n **1.**For Filtering Results for a given Date Range, please set the **dateRangeType** field value to **CUSTOM** and the set the Date Range. \n"
			+ "  **2.**For Filtering All Results, please set the **dateRangeType** field value to **ALL** and the select the status as required. ")
	@PostMapping("/list")
	@ApiPageable
	public PagedRestResponse<List<WorkflowProcessListDto>> listWorkflowProcess(
			@ApiParam(name = "workflowType", value = "'workflowType' Requested", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "approvalStatus", value = "The Status of Approval - APPROVED, REJECTED, PENDING, CLOSED OR CANCELLED", allowableValues = "APPROVED, REJECTED,PENDING,CLOSED,CANCELLED", required = false) @RequestParam(name = "approvalStatus", required = false) @ValueOfEnum(enumClass = WorkflowProcessStatusEnum.class) String approvalStatus,
			@ApiParam(name = "body", value = "The Request Body Containing the Filters ", required = false) @RequestBody @Valid ProcessListFilterRequestDto processListFilterRequestDto,		
			@ApiIgnore Pageable pageable) {
		return workflowProcessService.listWorkflowProcess(workflowType, approvalStatus, processListFilterRequestDto,
				pageable);
	}

	/**
	 * This will fetch Result for a given Process Instance Id
	 * 
	 * @param processId
	 * @return WorkflowProcessGetResponseDto
	 */
	@ApiOperation(value = "View workflow process for the given process id", notes = "This API will give details workflow process for the given process id")
	@GetMapping(value = "/{processId}")
	public WorkflowProcessGetResponseDto getWorkflowProcess(@PathVariable  @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Process ID. Please provide a valid one.") String processId,
			@ApiParam(name = "workflowType", value = "'workflowType' Requested", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType) {
		return workflowProcessService.getWorkflowProcess(processId, workflowType);
	}

	/**
	 * This will fetch the List of Count w.r.t Workflow type and Status from the
	 * Process DB.
	 * 
	 * @param status
	 * @return ListResponse<ProcessCountDto>
	 */
	@ApiOperation(value = "Count of Workflow tasks for approval requests", notes = "This API will give count of workflow processes for approval requests")
	@GetMapping(value = "/count")
	public ListResponse<ProcessCountDto> getWorkflowTaskCount(
			@RequestParam(required = true, name = "status") @ApiParam(value = "Approval Status", allowableValues = "APPROVED,REJECTED,PENDING", required = true) @ValueOfEnum(enumClass = WorkflowProcessStatusEnum.class) String approvalStatus) {
		return workflowProcessService.getWorkflowProcessCount(approvalStatus);
	}
	
	
	
	/**
	 * This will Cancel Pending Requests for a given Process Instance Id
	 * 
	 * @param processId
	 * @return CancelPendingRequestsResponseDto
	 */	
	@ApiOperation(value = "This API will Either Cancel Pending Requests OR Move the Approved Status to Closed, for a given Workflow Type", notes = "This API will expect a Process Id Input, generated while Raising Request, for a given Workflow Type. "
			+ " This API will Either **Cancel** **Pending** **Requests** OR **Move** **the** **Approved** **Status** **to** **Closed**, for a given Workflow Type."
			+ " <br> Also in case of workflow type as CANCEL_ADVANCE_BOOKING ,rejected state can also be closed")
	@PostMapping(value = "/{processId}")
	public CancelPendingRequestsResponseDto cancelPendingRequests(
			@ApiParam(value = "Process Id", required = true) @PathVariable(required = true, name = "processId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, message = "Invalid Process ID. Please provide a valid one.") String processId,
			@ApiParam(name = "workflowType", value = "'workflowType' Requested", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@RequestParam(required = false) @ApiParam(value = "Approval Status", allowableValues = "CANCELLED, APPROVED, REJECTED", required = false) @ValueOfEnum(enumClass = WorkflowProcessStatusEnum.class) String approvalStatus) {
		return workflowProcessService.cancelPendingOrCloseApprovedRequests(processId, workflowType, approvalStatus);
	}

}
