/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.service.ExecuteJobService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Primary
@Slf4j
public class ExecuteJobServiceImpl implements ExecuteJobService {

	@Autowired
	private JobFactory jobFactory;

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {
		ExecuteJobService executeJobService = jobFactory.getJob(launchJobRequest.getJobName());
		if (executeJobService == null) {
			throw new ServiceException("Job not found", "ERR-FILE-013");
		}
		Map<String, String> jobParams = launchJobRequest.getJobParams() == null ? new HashMap<>()
				: launchJobRequest.getJobParams();
		String userName = FileIntegrationConstants.ERP_USER;
		try {
			userName = CommonUtil.getUserName();
		} catch (NullPointerException ex) {
			log.debug("Scheduled " + launchJobRequest.getJobName() + " has started.");
		}
		jobParams.put("createdBy", userName);
		return executeJobService.triggerJob(launchJobRequest);
	}

}
