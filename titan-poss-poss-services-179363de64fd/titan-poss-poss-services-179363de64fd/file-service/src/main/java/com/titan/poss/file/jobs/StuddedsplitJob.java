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
import com.titan.poss.file.jobs.listener.StuddedSplitJobListener;
import com.titan.poss.file.jobs.tasklet.StuddedSplitIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.StuddedSplitStagingTasklet;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StuddedsplitJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "studdedSplitJob")
	public Job tepApJob(JobBuilderFactory jobBuilderFactory, StuddedSplitJobListener studdedSplitJobListener,
			Environment env, DataSource dataSource) {

		return jobBuilderFactory.get("studdedSplitJob").incrementer(new RunIdIncrementer())
				.listener(studdedSplitJobListener).start(studdedSplitStageTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(studdedSplitFileWritingTasklet())
				.from(studdedSplitStageTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step studdedSplitStageTasklet() {
		return stepBuilderFactory.get("studdedSplitStageTasklet").tasklet(getStuddedSplitStagingTasklet()).build();
	}

	@Bean
	public Step studdedSplitFileWritingTasklet() {
		return stepBuilderFactory.get("studdedSplitFileWritingTasklet").tasklet(getStuddedSplitIngestionTasklet())
				.build();
	}

	@Bean
	public StuddedSplitStagingTasklet getStuddedSplitStagingTasklet() {
		return new StuddedSplitStagingTasklet();
	}

	@Bean
	public StuddedSplitIngestionTasklet getStuddedSplitIngestionTasklet() {
		return new StuddedSplitIngestionTasklet();
	}
}
