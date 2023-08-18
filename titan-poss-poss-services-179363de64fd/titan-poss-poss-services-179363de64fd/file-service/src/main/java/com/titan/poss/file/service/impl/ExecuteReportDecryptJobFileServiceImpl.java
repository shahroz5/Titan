/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.service.ExecuteJobService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ExecuteReportDecryptJobFileServiceImpl implements ExecuteJobService {

	public ExecuteReportDecryptJobFileServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.REPORT_DECRYPT_JOB, this);
	}

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {
		if (launchJobRequest.getJobParams() == null) {
			throw new ServiceException("Sql query is required", "ERR-FILE-021");
		}
		Object sql = launchJobRequest.getJobParams().get("sql");
		Object reportId = launchJobRequest.getJobParams().get("reportId");
		if (sql == null || reportId == null) {
			throw new ServiceException("Sql query/ report id is missing", "ERR-FILE-021");
		} else {
			executeBatchJobs.executeJob(launchJobRequest, false);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_RETURN_INVOICE_JOB.toString());
		return response;
	}

}
