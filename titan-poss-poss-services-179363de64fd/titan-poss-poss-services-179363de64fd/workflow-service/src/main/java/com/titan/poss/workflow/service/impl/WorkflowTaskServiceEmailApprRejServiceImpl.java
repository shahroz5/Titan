/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.workflow.dao.WorkflowProcessDao;
import com.titan.poss.workflow.dao.WorkflowTaskDao;
import com.titan.poss.workflow.dto.response.CompleteTaskAllLevelsResponseDto;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;
import com.titan.poss.workflow.repository.WorkflowTaskRepository;
import com.titan.poss.workflow.service.WorkflowTaskServiceEmailApprRejService;
import com.titan.poss.workflow.util.CompleteTaskAllLevels;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("WorkflowTaskServiceEmailApprRejServiceImpl")
public class WorkflowTaskServiceEmailApprRejServiceImpl implements WorkflowTaskServiceEmailApprRejService {
	
	@Autowired
	private WorkflowTaskRepository wfTaskRepo;

	@Autowired
	private WorkflowProcessRepository wfProcessRepo;
	
	@Value("${camunda.rest.host:localhost}")
	private String camundaHostName;
	
	private static final Logger LOGGER = Logger.getLogger(WorkflowTaskServiceEmailApprRejServiceImpl.class.getName());
	
	private static final String DELIMTER = "#";
	
	private static final String ERR_WRF_002 = "ERR-WRF-PROCESS-002";
	private static final String CANNOT_UPDATE_DATA_IN_DB = "Cannot Update Data in Process DB. The Process Instance ID is Invalid";
	private static final String DB_CONSTR_VIOLATION = "Database Constraint Violation!! Entry Cannot be Inserted in Few Columns of Database due to Database Constraints.";
	
	@Autowired
	WorkflowTaskServiceEmailApprRejService workflowTaskServiceEmailApprRejService;
	

	@Override
	public String approveWorkflowTaskOverEmail(String key) {
		Map<String, String> out = new HashMap<>();
		try {
		out = decryptInputStringtoArray(key);
		} catch(Exception e) {
			LOGGER.info("Decrytion Failed. Please try again.");
			return "Invalid Input. Please CLICK AGAIN on 'APPROVE' or 'REJECT' Hyperlink Received on Email.";
		}
		
		String appOrRej = out.get("appOrRej");
		String processId = out.get("processId");
		String taskId = out.get("taskId");
		String taskName = out.get("taskName");
		String approverRoleCode = out.get("approverRoleCode");
		String approverUserName = out.get("approverUserName");
		
		LOGGER.log(Level.INFO, () -> "appOrRej: '" + appOrRej + "'.");
		LOGGER.log(Level.INFO, () -> "processId: '" + processId + "'.");
		LOGGER.log(Level.INFO, () -> "taskId: '" + taskId + "'.");
		LOGGER.log(Level.INFO, () -> "taskName: '" + taskName + "'.");
		LOGGER.log(Level.INFO, () -> "approverRoleCode: '" + approverRoleCode + "'.");
		LOGGER.log(Level.INFO, () -> "approverUserName: '" + approverUserName + "'.");
			
		String status = appOrRej.equals("true")?"APPROVED":"REJECTED";
		Boolean actionTaken = true;
		if(!(appOrRej.equals("true"))) {
			actionTaken = false;
		}
		
		CompleteTaskAllLevelsResponseDto completeTaskAllLevels;

		CompleteTaskAllLevels completeTasks = new CompleteTaskAllLevels();

		completeTaskAllLevels = completeTasks.completeTask("NA", actionTaken, approverRoleCode, taskId, processId, taskName, camundaHostName);
		
		// Save the details to Task DB
				WorkflowTaskDao wfTaskDao = new WorkflowTaskDao();
				wfTaskDao.setTaskId(taskId);
				wfTaskDao.setProcessId(processId);
				wfTaskDao.setTaskStatus(completeTaskAllLevels.getStatus());
				wfTaskDao.setLevel(completeTaskAllLevels.getLevel());
				wfTaskDao.setApproverRoleCode(approverRoleCode);
				wfTaskDao.setApproverUserName(approverUserName);
				wfTaskDao.setApproverRemarks("NA");

				wfTaskDao.setApprovedData("NA");
				wfTaskDao.setTaskName(taskName);
				wfTaskDao.setWorkflowType(completeTaskAllLevels.getWorkflowType());
				wfTaskDao.setApprovalLevel(completeTaskAllLevels.getApprovalLevel());
				wfTaskDao.setApproverCode(approverRoleCode);
				wfTaskRepo.save(wfTaskDao);

				// Update the Status in Workflow Process Table to either APPROVED or REJECTED
				// based on Process Instance ID input.
				WorkflowProcessDao workflowProcessDao = wfProcessRepo.findByProcessId(processId);
				if (workflowProcessDao != null) {
					if ((completeTaskAllLevels.getApprovalLevel() == completeTaskAllLevels.getLevel()) || completeTaskAllLevels.getStatus().equalsIgnoreCase("REJECTED")) {
						workflowProcessDao.setApprovalStatus(completeTaskAllLevels.getStatus());
						workflowProcessDao.setApproverRemarks("NA");
						workflowProcessDao.setApproverName(approverUserName);
						workflowProcessDao.setApprovedDateTime(new Date());
						workflowProcessDao.setApproverCode(approverRoleCode);
					}
					if ((completeTaskAllLevels.getIsEditable())) {
						workflowProcessDao.setApprovedData("NA");
					}
			if (((completeTaskAllLevels.getApprovalLevel() == completeTaskAllLevels.getLevel())
					|| completeTaskAllLevels.getStatus().equalsIgnoreCase("APPROVED"))
					&& workflowProcessDao.getWorkflowType().equalsIgnoreCase("DISCOUNT_CREATION")) {
				workflowProcessDao.setApprovalStatus("PENDING");

			}
			wfProcessRepo.save(workflowProcessDao);
						
				} else {
					throw new ServiceException(CANNOT_UPDATE_DATA_IN_DB, ERR_WRF_002,DB_CONSTR_VIOLATION );
				}

		LOGGER.log(Level.INFO, () -> "Received:-> The Status is: " + status + ", Process Id: " + processId + ", Task Id: " + taskId + ", Task Name: " + taskName + ", Approver Role Code: " + approverRoleCode + ", Approver User Name: " + approverUserName);
		return status;
	}
	
	

	public Map<String, String> decryptInputStringtoArray(String key) {
		LOGGER.log(Level.INFO, () -> "Before Decryption: '" + key + "'.");
		
		String str = CryptoUtil.decrypt(key, "key", true);
		LOGGER.log(Level.INFO, "After Decryption, String: : {0} ", str);		

		List<String> parametersReceived = convertStringToList(str);		
		LOGGER.log(Level.INFO, () -> "ParametersReceived '" + parametersReceived + "'.");
		
		Map<String, String> receivedParameters = new HashMap<>();
		receivedParameters.put("appOrRej", parametersReceived.get(0));
		receivedParameters.put("processId", parametersReceived.get(1));
		receivedParameters.put("taskId", parametersReceived.get(2));
		receivedParameters.put("taskName", parametersReceived.get(3));
		receivedParameters.put("approverRoleCode", parametersReceived.get(4));
		receivedParameters.put("approverUserName", parametersReceived.get(5));		
		
		return receivedParameters;
	}
	
	
	
	private List<String> convertStringToList(String str) {
		if (StringUtils.isBlank(str))
			return new ArrayList<>();
		String[] strArray = str.split(DELIMTER);
		return Arrays.asList(strArray);
	}



	
}
