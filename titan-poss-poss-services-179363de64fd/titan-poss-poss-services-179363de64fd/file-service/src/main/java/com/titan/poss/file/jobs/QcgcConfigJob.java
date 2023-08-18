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

import com.titan.poss.file.dto.QcgcConfigDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.processor.QcgcConfigIngestionProcessor;
import com.titan.poss.file.jobs.processor.QcgcConfigStagingProcessor;
import com.titan.poss.file.jobs.reader.QcgcConfigJobReader;
import com.titan.poss.file.jobs.tasklet.VendorConfigDatasyncTasklet;
import com.titan.poss.file.jobs.writer.QcgcConfigJobStagingWriter;
import com.titan.poss.file.jobs.writer.QcgcConfigJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class QcgcConfigJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private QcgcConfigJobReader qcgcConfigJobReader;

	private static final String WILL_BE_INJECTED = null;

	@Bean(name = "QCGC_CONFIG")
	public Job qcgcConfigJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			QcgcConfigIngestionProcessor qcgcConfigProcessor, QcgcConfigJobWriter qcgcConfigJobWriter) {

		return jobBuilderFactory.get("QCGC_CONFIG").incrementer(new RunIdIncrementer())
				.listener(getQcgcConfigJobListener()).start(qcgcConfigStagingStep(getQcgcConfigStagingProcessor(), env))
				.next(qcgcConfigIngestionStep(qcgcConfigProcessor, dataSource, integrationDataSource,
						qcgcConfigJobWriter))
				.next(qcgcConfigDataSyncStep()).build();
	}

	@Bean
	public Step qcgcConfigStagingStep(QcgcConfigStagingProcessor qcgcConfigStagingProcessor, Environment env) {
		return stepBuilderFactory.get("qcgcConfigStagingStep").<QcgcConfigDto, QcgcConfigDto>chunk(100)
				.reader(qcgcConfigJobReader.qcgcConfigFileReader(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.processor(qcgcConfigStagingProcessor).writer(getQcgcConfigJobStagingWriter()).build();
	}

	@Bean
	public Step qcgcConfigIngestionStep(QcgcConfigIngestionProcessor qcgcConfigProcessor, DataSource dataSource,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			QcgcConfigJobWriter qcgcConfigJobWriter) {
		return stepBuilderFactory.get("qcgcConfigIngestionStep").<QcgcConfigDto, QcgcConfigDto>chunk(100)
				.reader(qcgcConfigJobReader.qcgcConfigIngestionReader(WILL_BE_INJECTED, dataSource))
				.processor(qcgcConfigProcessor).writer(qcgcConfigJobWriter.qcgcConfigIngestionWriter(WILL_BE_INJECTED,
						integrationDataSource, WILL_BE_INJECTED))
				.build();
	}

	@Bean
	public Step qcgcConfigDataSyncStep() {
		return stepBuilderFactory.get("qcgcConfigDataSyncStep").tasklet(getQcgcConfigDatasyncTasklet()).build();
	}

	@Bean
	public FileUploadJobListener getQcgcConfigJobListener() {
		return new FileUploadJobListener("Qcgc config", "DELETE from qcgc_config_stage where file_id = '");
	}

	@Bean
	public QcgcConfigStagingProcessor getQcgcConfigStagingProcessor() {
		return new QcgcConfigStagingProcessor();
	}

	@Bean
	public QcgcConfigJobStagingWriter getQcgcConfigJobStagingWriter() {
		return new QcgcConfigJobStagingWriter();
	}

	@Bean
	public VendorConfigDatasyncTasklet getQcgcConfigDatasyncTasklet() {
		return new VendorConfigDatasyncTasklet();
	}
}
