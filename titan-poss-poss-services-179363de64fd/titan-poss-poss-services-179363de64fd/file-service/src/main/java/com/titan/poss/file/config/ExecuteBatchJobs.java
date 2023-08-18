/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.config;

import java.util.Date;
import java.util.Map;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.configuration.JobLocator;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.NoSuchJobException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
@Slf4j
public class ExecuteBatchJobs {

	@Autowired
	@Qualifier("asyncJobLauncher")
	private JobLauncher asyncjobLauncher;

	@Autowired
	@Qualifier("syncJobLauncher")
	private JobLauncher syncjobLauncher;

	/** job locator. */
	@Autowired
	private JobLocator jobLocator;

	/**
	 * Generic method to execute any job based on job name and Job parameters.
	 *
	 * @param launchJobRequest launch job request
	 * @throws Exception exception.
	 */
	public JobExecution executeJob(LaunchJobRequest launchJobRequest, boolean async) {
		try {
			log.info("Batch job-The time is now " + CalendarUtils.getCurrentDate());
			JobParametersBuilder builder = buildJobParameters();
			if (!CollectionUtils.isEmpty(launchJobRequest.getJobParams())) {
				for (Map.Entry<String, String> entry : launchJobRequest.getJobParams().entrySet()) {
					builder.addString(entry.getKey(), entry.getValue());
				}
			}
			JobExecution execution;
			if (async) {
				execution = asyncjobLauncher.run(jobLocator.getJob(launchJobRequest.getJobName()),
						builder.toJobParameters());
			} else {
				execution = syncjobLauncher.run(jobLocator.getJob(launchJobRequest.getJobName()),
						builder.toJobParameters());
			}
			log.info("Job currently running" + jobLocator.getJob(launchJobRequest.getJobName()).getName());
			log.info("Exit Status: " + execution.getStatus() + " for job:" + execution.getJobInstance().getJobName());
			return execution;
		} catch (JobExecutionAlreadyRunningException e) {
			throw new ServiceException("Job running already - " + launchJobRequest.getJobName(), e.getMessage(),
					"ERR-FILE-009");
		} catch (JobRestartException e) {
			throw new ServiceException("Job Restarted - " + launchJobRequest.getJobName(), e.getMessage());
		} catch (JobInstanceAlreadyCompleteException e) {
			throw new ServiceException("Job already completed - " + launchJobRequest.getJobName(), e.getMessage());
		} catch (JobParametersInvalidException e) {
			throw new ServiceException("Invalid parameters for the job - " + launchJobRequest.getJobName(),
					e.getMessage(), "ERR-FILE-010");
		} catch (NoSuchJobException e) {
			throw new ServiceException("The input job does not exist - " + launchJobRequest.getJobName(),
					e.getMessage(), "ERR-FILE-011");
		} catch (Exception e) {
			throw new ServiceException("Exception Occurred in - " + launchJobRequest.getJobName() + " Job",
					"ERR-FILE-012", e);
		}

	}

	/**
	 * Helper method to prepare he job parameters.
	 *
	 * @param launchJobRequest launch job request
	 * @return job parameters builder
	 */
	private JobParametersBuilder buildJobParameters() {
		JobParametersBuilder builder = new JobParametersBuilder();
		try {
			log.info("System time now: " + System.currentTimeMillis());
			builder.addDate("date", new Date());
			builder.addLong("time", System.currentTimeMillis());
		} catch (Exception e) {
			throw new ServiceException("Error occured while building job parameterss", "ERR-FILE-012", e);
		}
		return builder;
	}
}
