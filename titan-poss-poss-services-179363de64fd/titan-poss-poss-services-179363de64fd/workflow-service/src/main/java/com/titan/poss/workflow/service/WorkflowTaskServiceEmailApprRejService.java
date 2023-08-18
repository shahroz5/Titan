/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service;

import org.springframework.stereotype.Service;

/**
 * Service Interface for Workflow Task Service with Approval Over Email
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface WorkflowTaskServiceEmailApprRejService {
	
	/**
	 * This method will Update the Approval Status as APPROVED or REJECTED in both Task and Process Tables.
	 * This is an Interface for  APPROVAL OR REJECTION Over Email
	 * 
	 * @param key
	 * @return String
	 */

	public String approveWorkflowTaskOverEmail(String key);

}
