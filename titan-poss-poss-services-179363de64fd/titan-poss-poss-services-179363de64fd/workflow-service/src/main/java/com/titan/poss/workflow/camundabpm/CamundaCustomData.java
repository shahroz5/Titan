/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;

import com.titan.poss.core.exception.ServiceException;

/**
 * Camunda Related Class to Fetch Process Variables for a given Process Instance ID.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CamundaCustomData {
	
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();	
		RuntimeService runtimeService = processEngine.getRuntimeService();
		TaskService taskService = processEngine.getTaskService();
		
		
		public Map<String,Object> returnProcessVariables(String processInstanceId){
		Map<String, Object> context = new HashMap<>();
		try {
		context = runtimeService.getVariables(processInstanceId);
		return context;			
		}
		catch(Exception e) {
			throw new ServiceException("The Process Instance ID is either NOT Valid or the Corresponding Tasks have been completed","ERR-WRFCMND-001");
		}
	}
		
		
		
		public List<String> returnTaskIdsForaGivenProcessId(String processId) {
			List<Task> tasks;
			try {
				tasks = taskService.createTaskQuery().processInstanceId(processId).list();
			}
			catch(Exception e) {
				throw new ServiceException("The Request has already been Approved or Rejected Or Cancelled. Please Try with a valid Request with valid Unique Process Instance Id","ERR-WRFCMND-002");
			}
				
			List<String> taskList = new ArrayList<>();
			for(Task tsk: tasks) {
				taskList.add(tsk.getId());
			}
				
		return taskList;
						
		}
					
		
}
