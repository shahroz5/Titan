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

import com.titan.poss.file.jobs.listener.ReturnInvoiceJobListener;
import com.titan.poss.file.jobs.tasklet.ReturnInvoiceFileWritingTasklet;
import com.titan.poss.file.jobs.tasklet.ReturnInvoiceStagingTasklet;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ReturnInvoicejob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "returnInvoiceJob")
	public Job returnInvoiceJob(JobBuilderFactory jobBuilderFactory, ReturnInvoiceJobListener returnInvoiceJobListener,
			Environment env, DataSource dataSource) {

		return jobBuilderFactory.get("returnInvoiceJob").incrementer(new RunIdIncrementer())
				.listener(returnInvoiceJobListener).start(returnInvStagingTasklet()).next(returnInvFileWritingTasklet())
				.build();
	}

	@Bean
	public Step returnInvStagingTasklet() {
		return stepBuilderFactory.get("returnInvStagingTasklet").tasklet(getReturnInvoiceStagingTasklet()).build();
	}

	@Bean
	public Step returnInvFileWritingTasklet() {
		return stepBuilderFactory.get("returnInvFileWritingTasklet").tasklet(getReturnInvoiceFileWritingTasklet())
				.build();
	}

	@Bean
	public ReturnInvoiceStagingTasklet getReturnInvoiceStagingTasklet() {
		return new ReturnInvoiceStagingTasklet();
	}

	@Bean
	public ReturnInvoiceFileWritingTasklet getReturnInvoiceFileWritingTasklet() {
		return new ReturnInvoiceFileWritingTasklet();
	}
}
