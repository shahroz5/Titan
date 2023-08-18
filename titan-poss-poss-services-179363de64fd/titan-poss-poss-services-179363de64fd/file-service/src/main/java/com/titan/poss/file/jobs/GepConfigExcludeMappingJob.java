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

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.GepConfigExcludeMappingDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.GepConfigExcludeMappingFailureListener;
import com.titan.poss.file.jobs.mapper.GepConfigExcludeMapper;
import com.titan.poss.file.jobs.processor.GepConfigExcludeMappingIngestionProcessor;
import com.titan.poss.file.jobs.processor.GepConfigExcludeMappingStagingProcessor;
import com.titan.poss.file.jobs.reader.GepConfigExcludeMappingJobReader;
import com.titan.poss.file.jobs.writer.GepConfigExcludeMappingDataSyncWriter;
import com.titan.poss.file.jobs.writer.GepConfigExcludeMappingJobStagingWriter;
import com.titan.poss.file.jobs.writer.GepConfigExcludeMappingJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GepConfigExcludeMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private GepConfigExcludeMappingJobReader gepConfigExcludeMappingJobReader;

	@Bean(name = "GEP_CONFIG_EXCLUDE_MAPPING")
	public Job gepConfigExcludeMappingJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			GepConfigExcludeMappingJobWriter gepConfigExcludeMappingJobWriter,
			GepConfigExcludeMapper gepConfigExcludeMapper) {

		return jobBuilderFactory.get("GEP_CONFIG_EXCLUDE_MAPPING").incrementer(new RunIdIncrementer())
				.listener(getGepConfigExcludeMappingJobListener())
				.start(gepConfigExcludeMappingStagingStep(getGepConfigExcludeMappingStagingProcessor(),
						getGepConfigExcludeMappingFailureListener(), env))
				.next(gepConfigExcludeMappingIngestionStep(getGepConfigExcludeMappingIngestionProcessor(),
						getGepConfigExcludeMappingFailureListener(), dataSource, gepConfigExcludeMappingJobWriter))
				.next(gepConfigExcludeMappingDataSyncStep(gepConfigExcludeMapper, dataSource)).build();

	}

	@Bean
	public Step gepConfigExcludeMappingDataSyncStep(GepConfigExcludeMapper gepConfigExcludeMapper,
			DataSource dataSource) {
		return stepBuilderFactory.get("gepConfigExcludeMappingDataSyncStep")
				.<ExchangeConfigExcludeMappingDaoExt, ExchangeConfigExcludeMappingDaoExt>chunk(100)
				.reader(gepConfigExcludeMappingJobReader.gepConfigExcludeMappingDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, gepConfigExcludeMapper, dataSource))
				.writer(getGepConfigExcludeMappingDataSyncWriter()).build();
	}

	@Bean
	public GepConfigExcludeMappingDataSyncWriter getGepConfigExcludeMappingDataSyncWriter() {
		return new GepConfigExcludeMappingDataSyncWriter();
	}

	@Bean
	public Step gepConfigExcludeMappingStagingStep(
			GepConfigExcludeMappingStagingProcessor gepConfigExcludeMappingStagingProcessor,
			GepConfigExcludeMappingFailureListener gepConfigExcludeMappingFailureListener, Environment env) {
		return stepBuilderFactory.get("gepConfigExcludeMappingStagingStep")
				.<GepConfigExcludeMappingDto, GepConfigExcludeMappingDto>chunk(500)
				.reader(gepConfigExcludeMappingJobReader.gepConfigExcludeMappingFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(gepConfigExcludeMappingStagingProcessor).writer(getGepConfigExcludeMappingStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(gepConfigExcludeMappingFailureListener).build();
	}

	@Bean
	public Step gepConfigExcludeMappingIngestionStep(
			GepConfigExcludeMappingIngestionProcessor gepConfigExcludeMappingProcessor,
			GepConfigExcludeMappingFailureListener gepConfigExcludeMappingFailureListener, DataSource dataSource,
			GepConfigExcludeMappingJobWriter gepConfigExcludeMappingJobWriter) {
		return stepBuilderFactory.get("gepConfigExcludeMappingIngestionStep")
				.<GepConfigExcludeMappingDto, GepConfigExcludeMappingDto>chunk(500)
				.reader(gepConfigExcludeMappingJobReader
						.gepConfigExcludeMappingIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(gepConfigExcludeMappingProcessor)
				.writer(gepConfigExcludeMappingJobWriter.gepConfigExcludeMappingIngestionWriter(dataSource))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(gepConfigExcludeMappingFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getGepConfigExcludeMappingJobListener() {
		return new FileUploadJobListener("Gep config exclude mapping",
				"DELETE from gep_config_exclude_mapping_stage where file_audit_id = '");
	}

	@Bean
	public GepConfigExcludeMappingStagingProcessor getGepConfigExcludeMappingStagingProcessor() {
		return new GepConfigExcludeMappingStagingProcessor();
	}

	@Bean
	public GepConfigExcludeMappingIngestionProcessor getGepConfigExcludeMappingIngestionProcessor() {
		return new GepConfigExcludeMappingIngestionProcessor();
	}

	@Bean
	public GepConfigExcludeMappingFailureListener getGepConfigExcludeMappingFailureListener() {
		return new GepConfigExcludeMappingFailureListener();
	}

	@Bean
	public GepConfigExcludeMappingJobStagingWriter getGepConfigExcludeMappingStagingWriter() {
		return new GepConfigExcludeMappingJobStagingWriter();
	}

}