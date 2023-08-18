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

import com.titan.poss.file.jobs.listener.StnIbtJobListener;
import com.titan.poss.file.jobs.tasklet.StnIbtFileWritingTasklet;
import com.titan.poss.file.jobs.tasklet.StnIbtStagingTasklet;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StnIbtJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "ibtStnJob")
	public Job ibtStnoiceJob(JobBuilderFactory jobBuilderFactory, StnIbtJobListener ibtStnoiceJobListener,
			Environment env, DataSource dataSource) {

		return jobBuilderFactory.get("ibtStnJob").incrementer(new RunIdIncrementer())
				.listener(ibtStnoiceJobListener).start(ibtStnStagingTasklet()).next(ibtStnFileWritingTasklet())
				.build();
	}

	@Bean
	public Step ibtStnStagingTasklet() {
		return stepBuilderFactory.get("ibtStnStagingTasklet").tasklet(getStnIbtStagingTasklet()).build();
	}

	@Bean
	public Step ibtStnFileWritingTasklet() {
		return stepBuilderFactory.get("ibtStnFileWritingTasklet").tasklet(getStnIbtFileWritingTasklet())
				.build();
	}

	@Bean
	public StnIbtStagingTasklet getStnIbtStagingTasklet() {
		return new StnIbtStagingTasklet();
	}

	@Bean
	public StnIbtFileWritingTasklet getStnIbtFileWritingTasklet() {
		return new StnIbtFileWritingTasklet();
	}
}
