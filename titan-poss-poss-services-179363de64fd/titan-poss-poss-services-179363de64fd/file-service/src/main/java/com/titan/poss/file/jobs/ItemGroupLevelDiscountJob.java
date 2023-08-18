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

import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.ItemGroupLevelDiscountIngestionFailureListener;
import com.titan.poss.file.jobs.listener.ItemGroupLevelDiscountStagingFailureListener;
import com.titan.poss.file.jobs.mapper.ItemGroupLevelDiscountMapper;
import com.titan.poss.file.jobs.processor.ItemGroupLevelDiscountIngestionProcessor;
import com.titan.poss.file.jobs.processor.ItemGroupLevelDiscountStagingProcessor;
import com.titan.poss.file.jobs.reader.ItemGroupLevelDiscountJobReader;
import com.titan.poss.file.jobs.writer.ItemGroupLevelDiscountDataSyncWriter;
import com.titan.poss.file.jobs.writer.ItemGroupLevelDiscountJobWriter;
import com.titan.poss.file.jobs.writer.ItemGroupLevelDiscountStagingWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ItemGroupLevelDiscountJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private ItemGroupLevelDiscountJobReader itemGroupLevelDiscountJobReader;

	@Bean(name = "ITEM_GROUP_LEVEL_DISCOUNT")
	public Job itemGroupLevelDiscountJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			ItemGroupLevelDiscountMapper itemGroupLevelDiscountMapper) {

		return jobBuilderFactory.get("ITEM_GROUP_LEVEL_DISCOUNT").incrementer(new RunIdIncrementer())
				.listener(getItemGroupLevelDiscountJobListener())
				.start(itemGroupLevelDiscountStagingStep(getItemGroupLevelDiscountStagingProcessor(),
						getItemGroupLevelDiscountStageFailureListener(), env))
				.next(itemGroupLevelDiscountIngestionStep(getItemGroupLevelDiscountIngestionProcessor(),
						getItemGroupLevelDiscountIngestionFailureListener(), dataSource))
				.next(itemGroupLevelDiscountDataSyncStep(itemGroupLevelDiscountMapper, dataSource)).build();
	}

	/**
	 * @param itemGroupLevelDiscountMapper
	 * @param dataSource
	 * @return
	 */
	@Bean
	public Step itemGroupLevelDiscountDataSyncStep(ItemGroupLevelDiscountMapper itemGroupLevelDiscountMapper,
			DataSource dataSource) {
		return stepBuilderFactory.get("itemGroupLevelDiscountDataSyncStep")
				.<DiscountItemMappingDao, DiscountItemMappingDao>chunk(100)
				.reader(itemGroupLevelDiscountJobReader.itemGroupLevelDiscountDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, itemGroupLevelDiscountMapper, dataSource))
				.writer(getItemGroupLevelDiscountDataSyncWriter()).build();
	}

	/**
	 * @return
	 */
	@Bean
	public ItemGroupLevelDiscountDataSyncWriter getItemGroupLevelDiscountDataSyncWriter() {
		return new ItemGroupLevelDiscountDataSyncWriter();
	}

	/**
	 * @return
	 */
	@Bean
	public ItemGroupLevelDiscountIngestionFailureListener getItemGroupLevelDiscountIngestionFailureListener() {
		return new ItemGroupLevelDiscountIngestionFailureListener();
	}

	@Bean
	public Step itemGroupLevelDiscountIngestionStep(
			ItemGroupLevelDiscountIngestionProcessor itemGroupLevelDiscountProcessor,
			ItemGroupLevelDiscountIngestionFailureListener itemGroupLevelDiscountFailureListener,
			DataSource dataSource) {
		return stepBuilderFactory.get("itemGroupLevelDiscountIngestionStep")
				.<ItemGroupLevelDiscountDto, DiscountItemMappingDao>chunk(500)
				.reader(itemGroupLevelDiscountJobReader
						.itemGroupLevelDiscountIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(itemGroupLevelDiscountProcessor)
				.writer(getItemGroupLevelDiscountJobWriter().itemGroupLevelDiscountIngestionWriter(dataSource,
						"WILL_BE_INJECTED"))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(itemGroupLevelDiscountFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getItemGroupLevelDiscountJobListener() {

		return new FileUploadJobListener("ITEM_GROUP_LEVEL_DISCOUNT",
				"DELETE from discount_item_mapping_stage where file_audit_id = '");
	}

	@Bean
	public ItemGroupLevelDiscountStagingProcessor getItemGroupLevelDiscountStagingProcessor() {
		return new ItemGroupLevelDiscountStagingProcessor();
	}

	@Bean
	public ItemGroupLevelDiscountStagingFailureListener getItemGroupLevelDiscountStageFailureListener() {
		return new ItemGroupLevelDiscountStagingFailureListener();
	}

	@Bean
	public ItemGroupLevelDiscountIngestionProcessor getItemGroupLevelDiscountIngestionProcessor() {
		return new ItemGroupLevelDiscountIngestionProcessor();
	}

	@Bean
	public Step itemGroupLevelDiscountStagingStep(
			ItemGroupLevelDiscountStagingProcessor groupLevelDiscountStagingProcessor,
			ItemGroupLevelDiscountStagingFailureListener discountStagingFailureListener, Environment env) {
		return stepBuilderFactory.get("itemGroupLevelDiscountStagingStep")
				.<ItemGroupLevelDiscountDto, ItemGroupLevelDiscountDto>chunk(500)
				.reader(itemGroupLevelDiscountJobReader.itemGroupLevelDiscountFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(groupLevelDiscountStagingProcessor).writer(getItemGroupLevelDiscountStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(discountStagingFailureListener).build();
	}

	/**
	 * @return
	 */
	@Bean
	public ItemGroupLevelDiscountStagingWriter getItemGroupLevelDiscountStagingWriter() {
		return new ItemGroupLevelDiscountStagingWriter();
	}

	@Bean
	public ItemGroupLevelDiscountJobWriter getItemGroupLevelDiscountJobWriter() {
		return new ItemGroupLevelDiscountJobWriter();
	}

}
