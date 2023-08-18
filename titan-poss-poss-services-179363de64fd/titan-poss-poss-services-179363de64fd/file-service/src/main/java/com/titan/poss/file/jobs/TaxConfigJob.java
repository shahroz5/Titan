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
import com.titan.poss.file.dto.TaxConfigDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.TaxConfigFailureListener;
import com.titan.poss.file.jobs.mapper.TaxConfigMapper;
import com.titan.poss.file.jobs.processor.TaxConfigIngestionProcessor;
import com.titan.poss.file.jobs.processor.TaxConfigStagingProcessor;
import com.titan.poss.file.jobs.reader.TaxConfigJobReader;
import com.titan.poss.file.jobs.writer.TaxConfigDataSyncWriter;
import com.titan.poss.file.jobs.writer.TaxConfigJobStagingWriter;
import com.titan.poss.file.jobs.writer.TaxConfigJobWriter;
import com.titan.poss.location.dao.TaxConfigsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class TaxConfigJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private TaxConfigJobReader taxConfigJobReader;

	@Bean(name = "TAX_CONFIG")
	public Job taxConfigJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			TaxConfigJobWriter taxConfigJobWriter, TaxConfigMapper taxConfigMapper) {

		return jobBuilderFactory.get("TAX_CONFIG").incrementer(new RunIdIncrementer())
				.listener(getTaxConfigJobListener())
				.start(taxConfigStagingStep(getTaxConfigStagingProcessor(), getTaxConfigFailureListener(), env))
				.next(taxConfigIngestionStep(getTaxConfigIngestionProcessor(), getTaxConfigFailureListener(),
						dataSource, taxConfigJobWriter))
				.next(taxConfigDataSyncStep(taxConfigMapper,dataSource)).build();
	}

	@Bean
	public Step taxConfigDataSyncStep(TaxConfigMapper taxConfigMapper, DataSource dataSource) {
		return stepBuilderFactory.get("taxConfigDataSyncStep").<TaxConfigsDao, TaxConfigsDao>chunk(100)
				.reader(taxConfigJobReader.taxConfigDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED, taxConfigMapper,dataSource))
				.writer(getTaxConfigDataSyncWriter()).listener(getTaxConfigJobListener()).build();
	}

	@Bean
	public TaxConfigDataSyncWriter getTaxConfigDataSyncWriter() {
		return new TaxConfigDataSyncWriter();
	}

	@Bean
	public Step taxConfigStagingStep(TaxConfigStagingProcessor taxConfigStagingProcessor,
			TaxConfigFailureListener taxConfigFailureListener, Environment env) {
		return stepBuilderFactory.get("taxConfigStagingStep").<TaxConfigDto, TaxConfigDto>chunk(500)
				.reader(taxConfigJobReader.taxConfigFileReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(taxConfigStagingProcessor).writer(getTaxConfigStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(taxConfigFailureListener).build();
	}

	@Bean
	public Step taxConfigIngestionStep(TaxConfigIngestionProcessor taxConfigProcessor,
			TaxConfigFailureListener taxConfigFailureListener, DataSource dataSource,
			TaxConfigJobWriter taxConfigJobWriter) {
		return stepBuilderFactory.get("taxConfigIngestionStep").<TaxConfigDto, TaxConfigDto>chunk(500)
				.reader(taxConfigJobReader.taxConfigIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(taxConfigProcessor)
				.writer(taxConfigJobWriter.taxConfigIngestionWriter(dataSource)).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(taxConfigFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getTaxConfigJobListener() {
		return new FileUploadJobListener("Tax config", "DELETE from tax_configs_stage where file_audit_id = '");
	}

	@Bean
	public TaxConfigStagingProcessor getTaxConfigStagingProcessor() {
		return new TaxConfigStagingProcessor();
	}

	@Bean
	public TaxConfigIngestionProcessor getTaxConfigIngestionProcessor() {
		return new TaxConfigIngestionProcessor();
	}

	@Bean
	public TaxConfigFailureListener getTaxConfigFailureListener() {
		return new TaxConfigFailureListener();
	}

	@Bean
	public TaxConfigJobStagingWriter getTaxConfigStagingWriter() {
		return new TaxConfigJobStagingWriter();
	}

}