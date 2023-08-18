/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import java.util.Map;

import com.titan.poss.workflow.camundabpm.CamundaCustomData;
import com.titan.poss.workflow.dto.response.CompleteTaskAllLevelsResponseDto;

/**
 * DTO  Class for Completing Class and Reading Process Variables and Sending to Service IMPL class
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CompleteTaskAllLevels {
	
	private static final String APPROVAL_LEVEL= "approvalLevel";
	private static final String REQUESTOR = "requestor";
	private static final String WORKFLOW_TYPE = "workflowType";
	private static final String IS_EDITABLE = "isEditable";
			
	
	public CompleteTaskAllLevelsResponseDto completeTask(String approverComments, Boolean approved, String approverName, String taskId, String processInstanceId, String taskName, String camundaHostName) {
		
		CompleteTaskAllLevelsResponseDto completeTaskAllLevels = new CompleteTaskAllLevelsResponseDto();
		
		
		if(taskName.equals("REQUEST_APPROVER_L1")) {
			completeTaskAllLevels = completeTaskL1(approverComments, approved, approverName, taskId, processInstanceId, camundaHostName);			
		} 
		
		
		if(taskName.equals("REQUEST_APPROVER_L2")) {
			completeTaskAllLevels = completeTaskL2(approverComments, approved, approverName, taskId, processInstanceId, camundaHostName);
		} 
		
		
		if(taskName.equals("REQUEST_APPROVER_L3")) {
			completeTaskAllLevels = completeTaskL3(approverComments, approved, approverName, taskId, processInstanceId, camundaHostName);
		} 
		
		return completeTaskAllLevels;
	}
	
	
	 public CompleteTaskAllLevelsResponseDto completeTaskL1(String approverComments, Boolean approved, String approverName, String taskId, String processInstanceId, String camundaHostName) {
		 
		 	// GET/READ Required Process Variables
		 	Map<String, Object> processVars;
			CamundaCustomData camundaCustomData = new CamundaCustomData();
			processVars = camundaCustomData.returnProcessVariables(processInstanceId);
			
			Integer approvalLevel = (Integer)processVars.get(APPROVAL_LEVEL);
			String approverRoleCode = processVars.get("approverL1").toString();
			String requestor = processVars.get(REQUESTOR).toString();
			String workflowType = processVars.get(WORKFLOW_TYPE).toString();
			Boolean isEditable = (boolean)processVars.get(IS_EDITABLE);
			
			// Complete the Task using Task ID and Calling CompleteUserTask() Class 
		 	String status=null;
			CompleteUserTask completeUserTask = new CompleteUserTask();
			status = completeUserTask.completeTask(approverComments, approved, approverName, taskId, "REQUEST_APPROVER_L1", camundaHostName);
			
			// Send Response to Task Service IMPL Class
			CompleteTaskAllLevelsResponseDto completeTaskAllLevels = new CompleteTaskAllLevelsResponseDto();
			completeTaskAllLevels.setWorkflowType(workflowType);
			completeTaskAllLevels.setStatus(status);
			completeTaskAllLevels.setApproverRoleCode(approverRoleCode);
			completeTaskAllLevels.setApprovalLevel(approvalLevel);
			completeTaskAllLevels.setIsEditable(isEditable);
			completeTaskAllLevels.setRequestor(requestor);
			completeTaskAllLevels.setLevel(1);
			
		 return completeTaskAllLevels;
			
	 }
	 
	 public CompleteTaskAllLevelsResponseDto completeTaskL2(String approverComments, Boolean approved, String approverName, String taskId, String processInstanceId, String camundaHostName) {
		
			// GET/READ Required Process Variables
		 	Map<String, Object> processVars;
			CamundaCustomData camundaCustomData = new CamundaCustomData();
			processVars = camundaCustomData.returnProcessVariables(processInstanceId);
			
			Integer approvalLevel = (Integer)processVars.get(APPROVAL_LEVEL);
			String approverRoleCode = processVars.get("approverL2").toString();			
			String requestor = processVars.get(REQUESTOR).toString();			
			String workflowType = processVars.get(WORKFLOW_TYPE).toString();			
			Boolean isEditable = (boolean)processVars.get(IS_EDITABLE);
			
			
			// Complete the Task using Task ID and Calling CompleteUserTask() Class 
		 	String status=null;
			CompleteUserTask completeUserTask = new CompleteUserTask();
			status = completeUserTask.completeTask(approverComments, approved, approverName, taskId, "REQUEST_APPROVER_L2", camundaHostName);
			
			// Send Response to Task Service IMPL Class	
			CompleteTaskAllLevelsResponseDto completeTaskAllLevels = new CompleteTaskAllLevelsResponseDto();
			completeTaskAllLevels.setWorkflowType(workflowType);
			completeTaskAllLevels.setStatus(status);
			completeTaskAllLevels.setApproverRoleCode(approverRoleCode);
			completeTaskAllLevels.setApprovalLevel(approvalLevel);
			completeTaskAllLevels.setIsEditable(isEditable);
			completeTaskAllLevels.setRequestor(requestor);
			completeTaskAllLevels.setLevel(2);
		
			return completeTaskAllLevels;
			
	 }
	 
	 
	 
	 public CompleteTaskAllLevelsResponseDto completeTaskL3(String approverComments, Boolean approved, String approverName, String taskId, String processInstanceId, String camundaHostName) {
			// GET/READ Required Process Variables
			 	Map<String, Object> processVars;
				CamundaCustomData camundaCustomData = new CamundaCustomData();
				processVars = camundaCustomData.returnProcessVariables(processInstanceId);
				
				Integer approvalLevel = (Integer)processVars.get(APPROVAL_LEVEL);
				String approverRoleCode = processVars.get("approverL3").toString();					
				String requestor = processVars.get(REQUESTOR).toString();
				String workflowType = processVars.get(WORKFLOW_TYPE).toString();
				Boolean isEditable = (boolean)processVars.get(IS_EDITABLE);
				
				
				// Complete the Task using Task ID and Calling CompleteUserTask() Class 
			 	String status=null;
				CompleteUserTask completeUserTask = new CompleteUserTask();
				status = completeUserTask.completeTask(approverComments, approved, approverName, taskId, "REQUEST_APPROVER_L3", camundaHostName);
				
				// Send Response to Task Service IMPL Class
				CompleteTaskAllLevelsResponseDto completeTaskAllLevels = new CompleteTaskAllLevelsResponseDto();
				completeTaskAllLevels.setWorkflowType(workflowType);
				completeTaskAllLevels.setStatus(status);
				completeTaskAllLevels.setApproverRoleCode(approverRoleCode);
				completeTaskAllLevels.setApprovalLevel(approvalLevel);
				completeTaskAllLevels.setIsEditable(isEditable);
				completeTaskAllLevels.setRequestor(requestor);
				completeTaskAllLevels.setLevel(3);
				
				return completeTaskAllLevels;
				
		 }
	
}
