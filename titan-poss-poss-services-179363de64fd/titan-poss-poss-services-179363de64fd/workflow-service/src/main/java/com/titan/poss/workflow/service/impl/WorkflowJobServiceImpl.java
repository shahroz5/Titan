/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.camunda.bpm.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.config.dto.request.json.WorkflowReqExpireGlobalConfig;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.workflow.repository.WorkflowProcessRepository;
import com.titan.poss.workflow.service.EngineService;
import com.titan.poss.workflow.service.WorkflowJobService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowJobService")
public class WorkflowJobServiceImpl implements WorkflowJobService{
	
	@Autowired
	EngineService engineService;
	
	@Autowired
	WorkflowProcessRepository workflowProcessRepository;
	
	@Autowired
	private RuntimeService runtimeService;
	
	private static final Logger LOGGER = Logger.getLogger(WorkflowJobServiceImpl.class.getName());

	@Override
	@Transactional
	public SchedulerResponseDto expirePendingWorkflowRequests(String status) {
		
		String ruleType = RuleTypeEnum.WORKFLOW_REQEXPIRE_GLOBAL_CONFIG.toString();
		Integer configuredExpirationTime; 
		try {
			Object response = engineService.getRuleFieldValues(ruleType, new RuleRequestListDto());
			WorkflowReqExpireGlobalConfig value = MapperUtil.getObjectMapperInstance().convertValue(response, WorkflowReqExpireGlobalConfig.class);
			configuredExpirationTime = Integer.valueOf(value.getTimeToExpirePendingRequests());
			LOGGER.log(Level.INFO, () -> "Configured Expiry Time in Hours for Pending Requests Expiry: '" + configuredExpirationTime + "'.");
		} catch (Exception e) {
			throw new ServiceException("Cannot Read Configured Value to AUTO-EXPIRE PENDING Requests", "ERR_WRFSCHED_001",
					"Please Check the Global Configuration Value to Expire Pending Requests");
		}		
					
		//GET the List of Process Instance IDs from our Custom DB
		List<String> processInstanceIds = workflowProcessRepository.findPendingRequestsOlderThanConfigurableHours(configuredExpirationTime);			
		LOGGER.log(Level.INFO, () -> "Pending Process Ids for which the request is NOT ACTIONED within configured Hours: '" + processInstanceIds + "'.");
		LOGGER.log(Level.INFO, () -> "Total Number of Pending Process Ids for which the Request is NOT ACTIONED within Configured Hours: '" + processInstanceIds.size() + "'.");
		
		// Convert the Upper Case Process Ids to LOWER case which are to be DELETED from CAMUNDA DB
		List<String> camundaProcessInstanceIdstoDelete = new ArrayList<>();
	    for(String s:processInstanceIds){
	        camundaProcessInstanceIdstoDelete.add(s.toLowerCase());
	    }
	    LOGGER.log(Level.INFO, () -> "Process Ids To be DELETED in Camunda(obtained from above Query) Converted to LOWER CASE: '" + camundaProcessInstanceIdstoDelete + "'.");
		
		// Get the Scheduler Token -> Emp Name and Emp Code		
		String schedulerTokenEmpName = CommonUtil.getAuthUser().getEmployeeName();
		String schedulerTokenEmpCode = CommonUtil.getEmployeeCode();
		LOGGER.log(Level.INFO, () -> "Scheduler Token Employee Name: '" + schedulerTokenEmpName + "'.");
		LOGGER.log(Level.INFO, () -> "Scheduler Token Employee Code: '" + schedulerTokenEmpCode + "'.");		
		LOGGER.log(Level.INFO, () -> "******** Total Number of PENDING Requests that will be EXPIRED and DELETED FROM CAMUNDA DB: '" + processInstanceIds.size() + "'.*********************");
		
		// Remove All the Pending Process IDs Obtained Above from CAMUNDA DB Asynchronously
		if(!camundaProcessInstanceIdstoDelete.isEmpty()) {	
			runtimeService.deleteProcessInstancesAsync(camundaProcessInstanceIdstoDelete, "Scheduler Job DELETE Process Instance Ids Operation.");
		}
		
				
		// Update Database Records with PENDING Requests not Actioned for more than configurable hours AND update STATUS to EXPIRED
		if(!processInstanceIds.isEmpty()) {
			workflowProcessRepository.updateStatustoExpiredForOlderRequests("EXPIRED", "Expiring Pending Requests through Scheduler Job", schedulerTokenEmpName, new Date(), schedulerTokenEmpCode, configuredExpirationTime);
		}
		
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.WORKFLOW_EXPIRE_PENDING_REQUESTS_JOB.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		
		LOGGER.log(Level.INFO, () -> "Scheduler Response Dto Response: '" + schedulerResponseDto + "'.");
		
		return schedulerResponseDto;
	}

}
