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
import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;
import com.titan.poss.file.jobs.listener.DiscountExcludeItemMappingFailureListener;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.mapper.DiscountExcludeItemMapper;
import com.titan.poss.file.jobs.processor.DiscountExcludeItemMappingIngestionProcessor;
import com.titan.poss.file.jobs.processor.DiscountExcludeItemMappingStagingProcessor;
import com.titan.poss.file.jobs.reader.DiscountExcludeItemMappingJobReader;
import com.titan.poss.file.jobs.writer.DiscountExcludeItemMappingJobStagingWriter;
import com.titan.poss.file.jobs.writer.DiscountExcludeItemMappingJobWriter;
import com.titan.poss.file.jobs.writer.DiscountExcludeMappingDaoDataSyncWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class DiscountExcludeItemMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private DiscountExcludeItemMappingJobReader discountExcludeItemMappingJobReader;

	@Bean(name = "DISCOUNT_EXCLUDE_ITEM_MAPPING")
	public Job discountExcludeItemMappingJob(JobBuilderFactory jobBuilderFactory, Environment env,
			DataSource dataSource, DiscountExcludeItemMappingJobWriter discountExcludeItemMappingJobWriter,
			DiscountExcludeItemMapper discountExcludeItemMapper) {

		return jobBuilderFactory.get("DISCOUNT_EXCLUDE_ITEM_MAPPING").incrementer(new RunIdIncrementer())
				.listener(getDiscountExcludeItemMappingJobListener())
				.start(discountExcludeItemMappingStagingStep(getDiscountExcludeItemMappingStagingProcessor(),
						getDiscountExcludeItemMappingFailureListener(), env))
				.next(discountExcludeItemMappingIngestionStep(getDiscountExcludeItemMappingIngestionProcessor(),
						getDiscountExcludeItemMappingFailureListener(), dataSource,
						discountExcludeItemMappingJobWriter))
				.build();

	}

	@Bean
	public DiscountExcludeMappingDaoDataSyncWriter getDiscountExcludeItemMappingDataSyncWriter() {
		return new DiscountExcludeMappingDaoDataSyncWriter();
	}

	@Bean
	public Step discountExcludeItemMappingStagingStep(
			DiscountExcludeItemMappingStagingProcessor discountExcludeItemMappingStagingProcessor,
			DiscountExcludeItemMappingFailureListener discountExcludeItemMappingFailureListener, Environment env) {
		return stepBuilderFactory.get("discountExcludeItemMappingStagingStep")
				.<DiscountExcludeItemMappingDto, DiscountExcludeItemMappingDto>chunk(500)
				.reader(discountExcludeItemMappingJobReader.discountExcludeItemMappingFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(discountExcludeItemMappingStagingProcessor)
				.writer(getDiscountExcludeItemMappingStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(discountExcludeItemMappingFailureListener).build();
	}

	@Bean
	public Step discountExcludeItemMappingIngestionStep(
			DiscountExcludeItemMappingIngestionProcessor discountExcludeItemMappingProcessor,
			DiscountExcludeItemMappingFailureListener discountExcludeItemMappingFailureListener, DataSource dataSource,
			DiscountExcludeItemMappingJobWriter discountExcludeItemMappingJobWriter) {
		return stepBuilderFactory.get("discountExcludeItemMappingIngestionStep")
				.<DiscountExcludeItemMappingDto, DiscountExcludeItemMappingDto>chunk(500)
				.reader(discountExcludeItemMappingJobReader.discountExcludeItemMappingIngestionReader(
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(discountExcludeItemMappingProcessor)
				.writer(discountExcludeItemMappingJobWriter.discountExcludeItemMappingIngestionWriter(dataSource))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(discountExcludeItemMappingFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getDiscountExcludeItemMappingJobListener() {
		return new FileUploadJobListener("Discount exclude item mapping",
				"DELETE from discount_exclude_item_mapping_stage where file_audit_id = '");
	}

	@Bean
	public DiscountExcludeItemMappingStagingProcessor getDiscountExcludeItemMappingStagingProcessor() {
		return new DiscountExcludeItemMappingStagingProcessor();
	}

	@Bean
	public DiscountExcludeItemMappingIngestionProcessor getDiscountExcludeItemMappingIngestionProcessor() {
		return new DiscountExcludeItemMappingIngestionProcessor();
	}

	@Bean
	public DiscountExcludeItemMappingFailureListener getDiscountExcludeItemMappingFailureListener() {
		return new DiscountExcludeItemMappingFailureListener();
	}

	@Bean
	public DiscountExcludeItemMappingJobStagingWriter getDiscountExcludeItemMappingStagingWriter() {
		return new DiscountExcludeItemMappingJobStagingWriter();
	}

}
