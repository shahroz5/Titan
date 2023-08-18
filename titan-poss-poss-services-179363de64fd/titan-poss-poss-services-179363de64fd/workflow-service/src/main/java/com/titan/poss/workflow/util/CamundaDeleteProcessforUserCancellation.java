/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.util;

import org.springframework.web.client.RestTemplate;

import com.titan.poss.core.exception.ServiceException;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CamundaDeleteProcessforUserCancellation {
	
	public String deleteProcessInstanceonUserRequest(String processId, String camundaHostName) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			String url = "http://" + camundaHostName + "/camunda/rest/process-instance/" + processId;
			
			restTemplate.delete(url);
			return "CANCELLED";
		}
		catch(Exception e) {
			throw new ServiceException("The Request has already been Approved or Rejected Or Cancelled. Please Try with a valid Request with valid Unique Process Instance Id","ERR-WRFCMND-004");
		}
	}
	
}
