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

import com.titan.poss.file.jobs.listener.AirpayConfigFailureListener;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.processor.AirpayConfigIngestionProcessor;
import com.titan.poss.file.jobs.processor.AirpayConfigStagingProcessor;
import com.titan.poss.file.jobs.reader.AirpayConfigJobReader;
import com.titan.poss.file.jobs.tasklet.VendorConfigDatasyncTasklet;
import com.titan.poss.file.jobs.writer.AirpayConfigJobStagingWriter;
import com.titan.poss.file.jobs.writer.AirpayConfigJobWriter;
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class AirpayConfigJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private AirpayConfigJobReader airpayConfigJobReader;

	private static final String WILL_BE_INJECTED = null;

	@Bean(name = "AIRPAY_CONFIG")
	public Job airpayConfigJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			AirpayConfigJobWriter airpayConfigJobWriter) {

		return jobBuilderFactory.get("AIRPAY_CONFIG").incrementer(new RunIdIncrementer())
				.listener(getAirpayConfigJobListener())
				.start(airpayConfigStagingStep(getAirpayConfigStagingProcessor(), getAirpayConfigFailureListener(),
						env))
				.next(airpayConfigIngestionStep(getAirpayConfigIngestionProcessor(), dataSource, integrationDataSource,
						airpayConfigJobWriter))
				.next(airpayConfigDataSyncStep()).build();
	}

	@Bean
	public Step airpayConfigStagingStep(AirpayConfigStagingProcessor airpayConfigStagingProcessor,
			AirpayConfigFailureListener airpayConfigFailureListener, Environment env) {
		return stepBuilderFactory.get("airpayConfigStagingStep").<AirpayConfigDto, AirpayConfigDto>chunk(500)
				.reader(airpayConfigJobReader.airpayConfigFileReader(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.processor(airpayConfigStagingProcessor).writer(getAirpayConfigStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(airpayConfigFailureListener).build();
	}

	@Bean
	public Step airpayConfigIngestionStep(AirpayConfigIngestionProcessor airpayConfigProcessor, DataSource dataSource,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			AirpayConfigJobWriter airpayConfigJobWriter) {
		return stepBuilderFactory.get("airpayConfigIngestionStep").<AirpayConfigDto, AirpayConfigDto>chunk(500)
				.reader(airpayConfigJobReader.airpayConfigIngestionReader(WILL_BE_INJECTED, dataSource))
				.processor(airpayConfigProcessor).writer(airpayConfigJobWriter
						.airpayConfigIngestionWriter(WILL_BE_INJECTED, integrationDataSource, WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step airpayConfigDataSyncStep() {
		return stepBuilderFactory.get("airpayConfigDataSyncStep").tasklet(getAirpayConfigDatasyncTasklet()).build();
	}

	@Bean
	public FileUploadJobListener getAirpayConfigJobListener() {
		return new FileUploadJobListener("Airpay config", "DELETE from airpay_config_stage where file_audit_id = '");
	}

	@Bean
	public VendorConfigDatasyncTasklet getAirpayConfigDatasyncTasklet() {
		return new VendorConfigDatasyncTasklet();
	}

	@Bean
	public AirpayConfigStagingProcessor getAirpayConfigStagingProcessor() {
		return new AirpayConfigStagingProcessor();
	}

	@Bean
	public AirpayConfigIngestionProcessor getAirpayConfigIngestionProcessor() {
		return new AirpayConfigIngestionProcessor();
	}

	@Bean
	public AirpayConfigFailureListener getAirpayConfigFailureListener() {
		return new AirpayConfigFailureListener();
	}

	@Bean
	public AirpayConfigJobStagingWriter getAirpayConfigStagingWriter() {
		return new AirpayConfigJobStagingWriter();
	}

}
