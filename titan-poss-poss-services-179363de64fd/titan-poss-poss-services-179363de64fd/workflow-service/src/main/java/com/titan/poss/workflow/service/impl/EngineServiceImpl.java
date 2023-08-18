/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.workflow.service.EngineService;

/**
 * Service Implementation Class to Return the List of Roles for Logged in User
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowEngineService")
public class EngineServiceImpl implements EngineService {
	
	@Autowired
	EngineServiceClient engineClient;

	/**
	 * This method will return the Roles for a Logged  In User. 
	 * 
	 * @return ListResponse<String>
	 */
	@Override
	public ListResponse<String> getRoleList() {
		
		return engineClient.getRoleList();
	}
	
	
	/**
	 * This method will return the Business Day and Fiscal Year. 
	 * 
	 * @return BusinessDayDto
	 */
	@Override
	public BusinessDayDto getBusinessDay(String locationCode) {
		
		return engineClient.getBusinessDay(locationCode);
	}

	

	/**
	 * This method is Used for Interservice Call using Feign Client to Engine Service to Fetch Configuration for 'WORKFLOW_REQEXPIRE_GLOBAL_CONFIG' ruleType.
	 * 
	 * @param ruleType
	 * @param ruleRequestListDto
	 * @return
	 */
	@Override
	public Object getRuleFieldValues(String ruleType, RuleRequestListDto ruleRequestListDto) {
		Object response = engineClient.getRuleValues(ruleType, ruleRequestListDto);
		if (response == null) {
			throw new ServiceException("Response is Empty.Please set Configurations for Rule:" + ruleType + " ",
					"Error-Code");
		}
		return response;
	}


}
