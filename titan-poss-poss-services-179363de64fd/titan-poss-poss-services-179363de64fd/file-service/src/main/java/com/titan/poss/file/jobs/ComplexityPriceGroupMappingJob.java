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

import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigWriterDto;
import com.titan.poss.file.jobs.listener.ComplexityPriceGroupMappingFailureListener;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.mapper.ComplexityPriceGroupMapper;
import com.titan.poss.file.jobs.processor.ComplexityPriceGroupMappingIngestionProcessor;
import com.titan.poss.file.jobs.processor.ComplexityPriceGroupMappingStagingProcessor;
import com.titan.poss.file.jobs.reader.ComplexityPriceGroupMappingJobReader;
import com.titan.poss.file.jobs.tasklet.ComplexityPriceGroupValidationTasklet;
import com.titan.poss.file.jobs.writer.ComplexityPriceGroupMappingDatayncWriter;
import com.titan.poss.file.jobs.writer.ComplexityPriceGroupMappingJobStagingWriter;
import com.titan.poss.file.jobs.writer.ComplexityPriceGroupMappingJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class ComplexityPriceGroupMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private ComplexityPriceGroupMappingJobReader complexityPriceGroupMappingJobReader;

	@Bean(name = "COMPLEXITY_PRICE_GROUP_DETAILS")
	public Job complexityPriceGroupMappingJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			ComplexityPriceGroupMappingJobWriter complexityPriceGroupMappingJobWriter, ComplexityPriceGroupMapper complexityPriceGroupMapper) {

		return jobBuilderFactory.get("COMPLEXITY_PRICE_GROUP_DETAILS").incrementer(new RunIdIncrementer())
				.listener(getComplexityPriceGroupMappingJobListener())
				.start(complexityPriceGroupMappingStagingStep(getComplexityPriceGroupMappingStagingProcessor(),
						getComplexityPriceGroupMappingFailureListener(), env))
				.next(complexityPriceGroupValidationTasklet())
				.next(complexityPriceGroupMappingIngestionStep(getComplexityPriceGroupMappingIngestionProcessor(),
						getComplexityPriceGroupMappingFailureListener(), dataSource, complexityPriceGroupMappingJobWriter))
				.next(complexityPriceGroupMappingDataSyncStep(complexityPriceGroupMapper, dataSource)).build();
	}

	@Bean
	public Step complexityPriceGroupMappingDataSyncStep(ComplexityPriceGroupMapper complexityPriceGroupMapper, DataSource dataSource) {
		return stepBuilderFactory.get("complexityPriceGroupMappingDataSyncStep")
				.<ComplexityPriceGroupDao, ComplexityPriceGroupDao>chunk(100)
				.reader(complexityPriceGroupMappingJobReader.complexityPriceGroupMappingDataSyncReader(
		FileIntegrationConstants.WILL_BE_INJECTED, complexityPriceGroupMapper, dataSource))
				.writer(getComplexityPriceGroupMappingDataSyncWriter()).build();
	}

	@Bean
	public ComplexityPriceGroupMappingDatayncWriter getComplexityPriceGroupMappingDataSyncWriter() {
		return new ComplexityPriceGroupMappingDatayncWriter();
	}

	@Bean
	public Step complexityPriceGroupMappingStagingStep(ComplexityPriceGroupMappingStagingProcessor complexityPriceGroupMappingStagingProcessor,
			ComplexityPriceGroupMappingFailureListener complexityPriceGroupMappingFailureListener, Environment env) {
		return stepBuilderFactory.get("complexityPriceGroupMappingStagingStep")
				.<ComplexityPriceGroupConfigReaderDto, ComplexityPriceGroupConfigReaderDto>chunk(500)
				.reader(complexityPriceGroupMappingJobReader.complexityPriceGroupMappingFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(complexityPriceGroupMappingStagingProcessor).writer(getComplexityPriceGroupMappingStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(complexityPriceGroupMappingFailureListener).build();
	}

	@Bean
	public Step complexityPriceGroupMappingIngestionStep(ComplexityPriceGroupMappingIngestionProcessor complexityPriceGroupMappingIngestionProcessor,
			ComplexityPriceGroupMappingFailureListener complexityPriceGroupMappingFailureListener, DataSource dataSource,
			ComplexityPriceGroupMappingJobWriter complexityPriceGroupMappingJobWriter) {
		return stepBuilderFactory.get("complexityPriceGroupMappingIngestionStep")
				.<ComplexityPriceGroupConfigWriterDto, ComplexityPriceGroupConfigWriterDto>chunk(500)
				.reader(complexityPriceGroupMappingJobReader
						.complexityPriceGroupMappingIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(complexityPriceGroupMappingIngestionProcessor)
				.writer(complexityPriceGroupMappingJobWriter.complexityPriceGroupMappingIngestionWriter(dataSource)).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(complexityPriceGroupMappingFailureListener)
				.build();
	}

	@Bean
	public Step complexityPriceGroupValidationTasklet() {
		return stepBuilderFactory.get("complexityPriceGroupValidationTasklet").tasklet(getComplexityPriceGroupValidationTasklet()).build();
	}

	@Bean
	public ComplexityPriceGroupValidationTasklet getComplexityPriceGroupValidationTasklet() {
		return new ComplexityPriceGroupValidationTasklet();
	}

	@Bean
	public FileUploadJobListener getComplexityPriceGroupMappingJobListener() {
		return new FileUploadJobListener("ComplexityPriceGroupMapping",
				"DELETE from complexity_price_group_mapping_stage where file_audit_id = '");
	}

	@Bean
	public ComplexityPriceGroupMappingStagingProcessor getComplexityPriceGroupMappingStagingProcessor() {
		return new ComplexityPriceGroupMappingStagingProcessor();
	}

	@Bean
	public ComplexityPriceGroupMappingIngestionProcessor getComplexityPriceGroupMappingIngestionProcessor() {
		return new ComplexityPriceGroupMappingIngestionProcessor();
	}

	@Bean
	public ComplexityPriceGroupMappingFailureListener getComplexityPriceGroupMappingFailureListener() {
		return new ComplexityPriceGroupMappingFailureListener();
	}

	@Bean
	public ComplexityPriceGroupMappingJobStagingWriter getComplexityPriceGroupMappingStagingWriter() {
		return new ComplexityPriceGroupMappingJobStagingWriter();
	}

}