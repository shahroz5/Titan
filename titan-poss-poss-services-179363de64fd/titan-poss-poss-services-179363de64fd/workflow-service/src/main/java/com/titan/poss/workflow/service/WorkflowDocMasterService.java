/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import org.springframework.stereotype.Service;

import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.workflow.dto.response.DocNoAndFiscalYearDto;

/**
 * Service Interface for Workflow Doc Master
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("WorkflowDocMasterService")
public interface WorkflowDocMasterService {
	
	/**
	 * Returns doc no specific to a store, year and docType
	 * 
	 * @param docType
	 * @param isActive
	 * @return Integer
	 */
	DocNoAndFiscalYearDto getDocNumber(WorkflowTypeEnum workflowType, Boolean isActive);

		
}
