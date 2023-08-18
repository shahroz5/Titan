/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.response.ListResponse;

/**
 * Service Interface to Return the List of Roles for Logged in User
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("WorkflowEngineService")
public interface EngineService {
	
	/**
	 * This method will return the Roles for a Logged  In User. 
	 * 
	 * @return ListResponse<String>
	 */
	public ListResponse<String> getRoleList();
	
	
	/**
	 * This method will return the Business Day and Fiscal Year. 
	 * 
	 * @return BusinessDayDto
	 */
	public BusinessDayDto getBusinessDay(String locationCode);
	
	
	/**
	 * This method is Used for Interservice Call using Feign Client to Engine Service to Fetch Configuration for 'WORKFLOW_REQEXPIRE_GLOBAL_CONFIG' ruleType.
	 * 
	 * @param ruleType
	 * @param ruleRequestListDto
	 * @return
	 */
	Object getRuleFieldValues(String ruleType, RuleRequestListDto ruleRequestListDto);

}
