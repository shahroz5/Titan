/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.time.LocalDate;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class NetcarrotsJobBaseTasklet implements Tasklet, StepExecutionListener {

	private boolean stopJob;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		stopJob = false;
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		if (stopJob) {
			log.debug("Transaction date cannot be in the future");
			return ExitStatus.FAILED;
		}
		return ExitStatus.COMPLETED;
	}

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String transactionDateString = (String) chunkContext.getStepContext().getJobParameters()
				.get(FileIntegrationConstants.TRANSACTION_DATE);
		if (!StringUtils.isEmpty(transactionDateString)) {
			LocalDate transactionDate = CalendarUtils.convertStringToLocalDate(transactionDateString, "yyyy-MM-dd");
			if (transactionDate.isAfter(LocalDate.now())) {
				stopJob = true;
			}
		}
		return RepeatStatus.FINISHED;
	}

}
