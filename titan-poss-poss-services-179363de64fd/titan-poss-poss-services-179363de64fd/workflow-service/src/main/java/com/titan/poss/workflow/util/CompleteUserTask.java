/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.workflow.dto.request.TaskCompletionDtoL1;
import com.titan.poss.workflow.dto.request.TaskCompletionDtoL2;
import com.titan.poss.workflow.dto.request.TaskCompletionDtoL3;
import com.titan.poss.workflow.dto.request.TaskCompletionValues;
import com.titan.poss.workflow.dto.request.TaskCompletionVariables;

/**
 * DTO Request to Complete the Approver Task
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CompleteUserTask {
	
	String approvalStatus;
	private static final String ERR_WRF_001 = "ERR_WRF_TASK_001";
	private static final String INVALID_COMPLETE_RESPONSE = "The Approval Request Cannot be Completed. The Camunda Task Completion API threw an Unexpected Error ";
	
	public String completeTask(String approverComments, Boolean approved, String approverName, String taskId, String taskName, String camundaHostName){	
		
		TaskCompletionVariables taskCompletionVariables = new TaskCompletionVariables();
		
		TaskCompletionValues taskCompletionValues = new TaskCompletionValues();
		taskCompletionValues.setValue(approved);
		
		TaskCompletionValues taskCompletionValues1 = new TaskCompletionValues();
		taskCompletionValues1.setValue(approverComments);
		
		TaskCompletionValues taskCompletionValues2 = new TaskCompletionValues();
		taskCompletionValues2.setValue(approverName);
		
		if(taskName.equals("REQUEST_APPROVER_L1")) {
			TaskCompletionDtoL1 taskCompletionDtoL1 = new TaskCompletionDtoL1();
			taskCompletionDtoL1.setApprovedL1(taskCompletionValues);
			taskCompletionDtoL1.setApproverCommentsL1(taskCompletionValues1);
			taskCompletionDtoL1.setApproverNameL1(taskCompletionValues2);
			taskCompletionVariables.setVariables(taskCompletionDtoL1);
		}
		
		if (taskName.equals("REQUEST_APPROVER_L2")) {
			TaskCompletionDtoL2 taskCompletionDtoL2 = new TaskCompletionDtoL2();
			taskCompletionDtoL2.setApprovedL2(taskCompletionValues);
			taskCompletionDtoL2.setApproverCommentsL2(taskCompletionValues1);
			taskCompletionDtoL2.setApproverNameL2(taskCompletionValues2);
			taskCompletionVariables.setVariables(taskCompletionDtoL2);
		}

		if (taskName.equals("REQUEST_APPROVER_L3")) {
			TaskCompletionDtoL3 taskCompletionDtoL3 = new TaskCompletionDtoL3();
			taskCompletionDtoL3.setApprovedL3(taskCompletionValues);
			taskCompletionDtoL3.setApproverCommentsL3(taskCompletionValues1);
			taskCompletionDtoL3.setApproverNameL3(taskCompletionValues2);
			taskCompletionVariables.setVariables(taskCompletionDtoL3);
		}
				
		
		//Creating the ObjectMapper object
	    ObjectMapper mapper = new ObjectMapper();
	    //Converting the Object to JSONString
	    String jsonMapped = null;
		try {
			jsonMapped = mapper.writeValueAsString(taskCompletionVariables);
		} catch (JsonProcessingException e) {
			throw new ServiceException(INVALID_COMPLETE_RESPONSE,ERR_WRF_001);			
		}
	
		try {
		if(approved) {
			pendingApprovalStatusUtil(jsonMapped, taskId, camundaHostName);
			approvalStatus = "APPROVED";
			} 
		else {
			pendingApprovalStatusUtil(jsonMapped, taskId, camundaHostName);
			approvalStatus = "REJECTED";
			}
		}
		catch(Exception e) {
			throw new ServiceException("Could Not Complete Task due to either Invalid Task ID OR  Task ID is NOT yet Generated OR Task has already been completed!", "ERR-WRFTSK-005");
		}		
		
		return approvalStatus;
	}


public static void pendingApprovalStatusUtil(String taskCompleteModel, String taskId, String camundaHostName) {
	RestTemplate restTemplate = new RestTemplate();
	HttpHeaders headers = new HttpHeaders();
	String url = "http://" + camundaHostName + "/camunda/rest/task/" + taskId + "/complete";
	// set `Content-Type` header
	headers.setContentType(MediaType.APPLICATION_JSON);
	HttpEntity<String> request = new HttpEntity<>(taskCompleteModel, headers);
	
	restTemplate.postForEntity(url, request, Void.class);
}

}