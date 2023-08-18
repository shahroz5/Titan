/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.jobs.listener.TepApJobListener;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.tasklet.TepApFileWritingTasklet;
import com.titan.poss.file.jobs.tasklet.TepApStagingTasklet;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class TepJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "tepApJob")
	public Job tepApJob(JobBuilderFactory jobBuilderFactory, TepApJobListener tepApJobListener, Environment env,
			DataSource dataSource) {

		return jobBuilderFactory.get("tepApJob").incrementer(new RunIdIncrementer()).listener(tepApJobListener)
				.start(tepApStagingTasklet()).next(tepApFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(tepApFileWritingTasklet()).from(tepApFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end()
				.end().build();
	}

	@Bean
	public Step tepApStagingTasklet() {
		return stepBuilderFactory.get("tepApStagingTasklet").tasklet(getTepApStagingTasklet()).build();
	}

	@Bean
	public Step tepApFileWritingTasklet() {
		return stepBuilderFactory.get("tepApFileWritingTasklet").tasklet(getTepApFileWritingTasklet()).build();
	}

	@Bean
	public TepApStagingTasklet getTepApStagingTasklet() {
		return new TepApStagingTasklet();
	}

	@Bean
	public TepApFileWritingTasklet getTepApFileWritingTasklet() {
		return new TepApFileWritingTasklet();
	}

	@Bean
	public Step tepApFileCheckTasklet() {
		return stepBuilderFactory.get("tepApFileCheckTasklet").tasklet(getTepApFileWritingCheckTasklet()).build();
	}

	@Bean
	public FileWritingCheckTasklet getTepApFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.tep_ap_header_stage where file_id = ?",
				"tepApTransactionId");
	}
}
