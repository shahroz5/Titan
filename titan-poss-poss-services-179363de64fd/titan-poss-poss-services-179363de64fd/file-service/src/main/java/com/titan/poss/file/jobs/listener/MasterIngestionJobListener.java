/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Slf4j
public class MasterIngestionJobListener implements JobExecutionListener {

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("MasterIngestionJob has started at: {}", CalendarUtils.getCurrentDate());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		log.info("MasterIngestionJob has ended at: {}", CalendarUtils.getCurrentDate());
	}
}
