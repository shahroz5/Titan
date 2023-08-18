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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.titan.poss.file.dto.RazorpayConfigDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.RazorpayConfigFailureListener;
import com.titan.poss.file.jobs.processor.RazorpayConfigIngestionProcessor;
import com.titan.poss.file.jobs.processor.RazorpayConfigStagingProcessor;
import com.titan.poss.file.jobs.reader.RazorpayConfigJobReader;
import com.titan.poss.file.jobs.tasklet.VendorConfigDatasyncTasklet;
import com.titan.poss.file.jobs.writer.RazorpayConfigJobStagingWriter;
import com.titan.poss.file.jobs.writer.RazorpayConfigJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class RazorpayConfigJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private RazorpayConfigJobReader razorpayConfigJobReader;

	private static final String WILL_BE_INJECTED = null;

	@Bean(name = "RAZORPAY_CONFIG")
	public Job razorpayConfigJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			RazorpayConfigJobWriter razorpayConfigJobWriter) {

		return jobBuilderFactory.get("RAZORPAY_CONFIG").incrementer(new RunIdIncrementer())
				.listener(getRazorpayConfigJobListener())
				.start(razorpayConfigStagingStep(getRazorpayConfigStagingProcessor(),
						getRazorpayConfigFailureListener(), env))
				.next(razorpayConfigIngestionStep(getRazorpayConfigIngestionProcessor(), dataSource,
						integrationDataSource, razorpayConfigJobWriter))
				.next(razorpayConfigDataSyncStep()).build();
	}

	@Bean
	public Step razorpayConfigStagingStep(RazorpayConfigStagingProcessor razorpayConfigStagingProcessor,
			RazorpayConfigFailureListener razorpayConfigFailureListener, Environment env) {
		return stepBuilderFactory.get("razorpayConfigStagingStep").<RazorpayConfigDto, RazorpayConfigDto>chunk(500)
				.reader(razorpayConfigJobReader.razorpayConfigFileReader(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.processor(razorpayConfigStagingProcessor).writer(getRazorpayConfigStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(razorpayConfigFailureListener).build();
	}

	@Bean
	public Step razorpayConfigIngestionStep(RazorpayConfigIngestionProcessor razorpayConfigProcessor,
			DataSource dataSource, @Qualifier("configIntgDataSource") DataSource integrationDataSource,
			RazorpayConfigJobWriter razorpayConfigJobWriter) {
		return stepBuilderFactory.get("razorpayConfigIngestionStep").<RazorpayConfigDto, RazorpayConfigDto>chunk(500)
				.reader(razorpayConfigJobReader.razorpayConfigIngestionReader(WILL_BE_INJECTED, dataSource))
				.processor(razorpayConfigProcessor)
				.writer(razorpayConfigJobWriter.razorpayConfigIngestionWriter(integrationDataSource, WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step razorpayConfigDataSyncStep() {
		return stepBuilderFactory.get("razorpayConfigDataSyncStep").tasklet(getRazorpayConfigDatasyncTasklet()).build();
	}

	@Bean
	public FileUploadJobListener getRazorpayConfigJobListener() {
		return new FileUploadJobListener("Razorpay config",
				"DELETE from razorpay_config_stage where file_audit_id = '");
	}

	@Bean
	public VendorConfigDatasyncTasklet getRazorpayConfigDatasyncTasklet() {
		return new VendorConfigDatasyncTasklet();
	}

	@Bean
	public RazorpayConfigStagingProcessor getRazorpayConfigStagingProcessor() {
		return new RazorpayConfigStagingProcessor();
	}

	@Bean
	public RazorpayConfigIngestionProcessor getRazorpayConfigIngestionProcessor() {
		return new RazorpayConfigIngestionProcessor();
	}

	@Bean
	public RazorpayConfigFailureListener getRazorpayConfigFailureListener() {
		return new RazorpayConfigFailureListener();
	}

	@Bean
	public RazorpayConfigJobStagingWriter getRazorpayConfigStagingWriter() {
		return new RazorpayConfigJobStagingWriter();
	}

}
