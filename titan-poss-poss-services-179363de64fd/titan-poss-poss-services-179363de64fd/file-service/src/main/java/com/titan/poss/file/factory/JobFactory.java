/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.factory;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.titan.poss.file.service.ExecuteJobService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class JobFactory {

	Map<String, ExecuteJobService> jobServices;

	public JobFactory() {
		jobServices = new HashMap<>();
	}

	public void registerJob(String jobName, ExecuteJobService jobService) {
		jobServices.put(jobName, jobService);
	}

	public ExecuteJobService getJob(String reportName) {
		return jobServices.get(reportName);
	}
}
