/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.job.flow.support.SimpleFlow;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;
import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dto.ItemMaterialFileStageDto;
import com.titan.poss.file.dto.ItemMaterialStageDto;
import com.titan.poss.file.dto.ItemStoneFileStageDto;
import com.titan.poss.file.dto.ItemStoneStageDto;
import com.titan.poss.file.dto.PriceMasterFileStageDto;
import com.titan.poss.file.dto.PriceMasterStageDto;
import com.titan.poss.file.jobs.listener.MasterIngestionJobListener;
import com.titan.poss.file.jobs.listener.MasterIngestionListener;
import com.titan.poss.file.jobs.mapper.ItemMaterialDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.ItemStoneDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.PriceMasterMapper;
import com.titan.poss.file.jobs.processor.ItemMaterialMappingStageProcessor;
import com.titan.poss.file.jobs.processor.ItemStoneMappingStageProcessor;
import com.titan.poss.file.jobs.processor.PriceMasterStageProcessor;
import com.titan.poss.file.jobs.reader.MasterIngestionJobReader;
import com.titan.poss.file.jobs.tasklet.ItemMaterialMappingIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.ItemMaterialMappingValidationTaskletFileJobs;
import com.titan.poss.file.jobs.tasklet.ItemStoneMappingIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.ItemStoneMappingValidationTasklet;
import com.titan.poss.file.jobs.tasklet.MasterJobTasklet;
import com.titan.poss.file.jobs.tasklet.PriceMasterIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.PriceMasterValidationTasklet;
import com.titan.poss.file.jobs.writer.ItemMaterialMappingDataSyncWriter;
import com.titan.poss.file.jobs.writer.ItemStoneMappingDataSyncWriter;
import com.titan.poss.file.jobs.writer.MasterIngestionJobWriter;
import com.titan.poss.file.jobs.writer.PriceMasterDataSyncWriter;
import com.titan.poss.product.dao.PriceDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class MasterMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private MasterIngestionJobWriter masterIngestionJobWriter;

	@Autowired
	private MasterIngestionJobReader masterIngestionJobReader;

	private static final String SOURCE_FILE_FOLDER = "masterJob.source.path";

	@Bean(name = "masterMappingIngestionJob")
	public Job masterMappingIngestionJob(JobBuilderFactory jobBuilderFactory, PriceMasterMapper priceMasterMapper,
			ItemMaterialDatasyncStageMapper itemMaterialDatasyncStageMapper,
			ItemStoneDatasyncStageMapper itemStoneDatasyncStageMapper) {

		Flow priceMasterFlow = new FlowBuilder<SimpleFlow>("priceMasterFlow").start(priceMasterTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(priceMasterStagingStep()).next(priceMasterValidateTasklet())
				.next(priceMasterIngestionCopyTasklet()).from(priceMasterTasklet()).on(FileIntegrationConstants.STOPPED)
				.end().build();

		Flow itemStoneMappingFlow = new FlowBuilder<SimpleFlow>("itemStoneMappingFlow").start(itemStoneMappingTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(itemStoneMappingStagingStep())
				.next(itemStoneMappingValidateTasklet()).next(itemStoneMappingIngestionTasklet())
				.next(itemStoneMappingDataSyncStep(itemStoneDatasyncStageMapper)).from(itemStoneMappingTasklet())
				.on(FileIntegrationConstants.STOPPED).end().build();

		Flow itemMaterialMappingFlow = new FlowBuilder<SimpleFlow>("itemMaterialMappingFlow")
				.start(itemMaterialMappingTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(itemMaterialMappingStagingStep()).next(itemMaterialMappingValidateTasklet())
				.next(itemMaterialMappingIngestionTasklet())
				.next(itemMaterialMappingDataSyncStep(itemMaterialDatasyncStageMapper))
				.from(itemMaterialMappingTasklet()).on(FileIntegrationConstants.STOPPED).end().build();

		Flow splitFlow = new FlowBuilder<SimpleFlow>("splitFlow").split(new SimpleAsyncTaskExecutor())
				.add(priceMasterFlow, itemStoneMappingFlow, itemMaterialMappingFlow).build();

		return jobBuilderFactory.get("masterMappingIngestionJob").incrementer(new RunIdIncrementer())
				.listener(getMasterIngestionJobListener()).start(splitFlow).end().build();
	}

	@Bean
	public Step itemMaterialMappingDataSyncStep(ItemMaterialDatasyncStageMapper itemMaterialDatasyncStageMapper) {
		return stepBuilderFactory.get("itemMaterialMappingDataSyncStep")
				.<ItemMaterialDatasyncStageDao, ItemMaterialDatasyncStageDao>chunk(100)
				.reader(masterIngestionJobReader.itemMaterialMappingDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, itemMaterialDatasyncStageMapper))
				.writer(getItemMaterialMappingDataSyncWriter()).listener(getItemMaterialMappingIngestionListener())
				.build();
	}

	@Bean
	public Step itemStoneMappingDataSyncStep(ItemStoneDatasyncStageMapper itemStoneDatasyncStageMapper) {
		return stepBuilderFactory.get("itemStoneMappingDataSyncStep")
				.<ItemStoneDatasyncStageDao, ItemStoneDatasyncStageDao>chunk(500)
				.reader(masterIngestionJobReader.itemStoneMappingDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, itemStoneDatasyncStageMapper))
				.writer(getItemStoneMappingDataSyncWriter()).listener(getItemStoneMappingIngestionListener()).build();
	}

	@Bean
	public Step priceMasterDataSyncStep(PriceMasterMapper priceMasterMapper) {
		return stepBuilderFactory.get("priceMasterDataSyncStep").<PriceDao, PriceDao>chunk(500)
				.reader(masterIngestionJobReader.priceMasterDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						priceMasterMapper))
				.writer(getPriceMasterDataSyncWriter()).listener(getPriceMasterIngestionListener()).build();

	}

	@Bean(name = "masterMappingIngestionJobListener")
	public MasterIngestionJobListener getMasterIngestionJobListener() {
		return new MasterIngestionJobListener();
	}

	@Bean
	public ItemMaterialMappingDataSyncWriter getItemMaterialMappingDataSyncWriter() {
		return new ItemMaterialMappingDataSyncWriter();
	}

	@Bean
	public ItemStoneMappingDataSyncWriter getItemStoneMappingDataSyncWriter() {
		return new ItemStoneMappingDataSyncWriter();
	}

	@Bean
	public PriceMasterDataSyncWriter getPriceMasterDataSyncWriter() {
		return new PriceMasterDataSyncWriter();
	}

	@Bean
	public Step priceMasterTasklet() {
		return stepBuilderFactory.get("priceMasterTasklet").tasklet(getPriceMasterTasklet()).build();
	}

	@Bean
	public Step priceMasterStagingStep() {
		return stepBuilderFactory.get("priceMasterStagingStep").<PriceMasterFileStageDto, PriceMasterStageDto>chunk(500)
				.reader(masterIngestionJobReader.priceMasterStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getPriceMasterStageProcessor()).writer(masterIngestionJobWriter.priceMasterStagingWriter())
				.build();
	}

	@Bean
	public MasterJobTasklet getPriceMasterTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.PRICE_MASTER_FILE_NAME.getValue(),
				FileMasterJobNameEnum.PRICE_MASTER.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.PRICE_MASTER_COLUMN_COUNT, "priceMasterFileAuditId");
	}

	@Bean
	public Step priceMasterValidateTasklet() {
		return stepBuilderFactory.get("priceMasterValidateTasklet").tasklet(getPriceMasterValidationTasklet()).build();
	}

	@Bean
	public Step itemStoneMappingValidateTasklet() {
		return stepBuilderFactory.get("itemStoneMappingValidateTasklet").tasklet(getItemStoneMappingValidationTasklet())
				.build();
	}

	@Bean
	public Step itemMaterialMappingValidateTasklet() {
		return stepBuilderFactory.get("itemMaterialMappingValidateTasklet")
				.tasklet(getItemMaterialMappingValidationTasklet()).build();
	}

	@Bean
	public PriceMasterStageProcessor getPriceMasterStageProcessor() {
		return new PriceMasterStageProcessor();
	}

	@Bean
	public MasterIngestionListener getPriceMasterIngestionListener() {
		return new MasterIngestionListener("priceMasterFileName", "priceMasterFileAuditId", "price_master_stage",
				"DELETE from price_master_stage where file_audit_id = '");
	}

	@Bean
	public Step priceMasterIngestionCopyTasklet() {
		return stepBuilderFactory.get("priceMasterIngestionCopyTasklet").tasklet(getPriceMasterIngestionTasklet())
				.listener(getPriceMasterIngestionListener()).build();
	}

	@Bean
	public Step itemStoneMappingTasklet() {
		return stepBuilderFactory.get("itemStoneMappingTasklet").tasklet(getItemStoneMappingTasklet()).build();
	}

	@Bean
	public PriceMasterIngestionTasklet getPriceMasterIngestionTasklet() {
		return new PriceMasterIngestionTasklet();
	}

	@Bean
	public Step itemStoneMappingStagingStep() {
		return stepBuilderFactory.get("itemStoneMappingStagingStep")
				.<ItemStoneFileStageDto, ItemStoneStageDto>chunk(500)
				.reader(masterIngestionJobReader
						.itemStoneMappingStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getItemStoneMappingStageProcessor())
				.writer(masterIngestionJobWriter.itemStoneMappingStagingWriter()).build();
	}

	@Bean
	public Step itemStoneMappingIngestionTasklet() {
		return stepBuilderFactory.get("itemStoneMappingIngestionTasklet").tasklet(getItemStoneMappingIngestionTasklet())
				.build();
	}

	@Bean
	public MasterJobTasklet getItemStoneMappingTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.ITEM_STONE_MAPPING_FILE_NAME.getValue(),
				FileMasterJobNameEnum.ITEM_STONE_MAPPING.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.ITEM_STONE_MAPPING_COLUMN_COUNT, "itemStoneMappingFileAuditId");
	}

	@Bean
	public ItemStoneMappingIngestionTasklet getItemStoneMappingIngestionTasklet() {
		return new ItemStoneMappingIngestionTasklet();
	}

	@Bean
	public ItemStoneMappingStageProcessor getItemStoneMappingStageProcessor() {
		return new ItemStoneMappingStageProcessor();
	}

	@Bean
	public MasterIngestionListener getItemStoneMappingIngestionListener() {
		return new MasterIngestionListener("itemStoneMappingFileName", "itemStoneMappingFileAuditId",
				"item_stone_mapping_stage", "DELETE from item_stone_mapping_stage where file_audit_id = '");
	}

	@Bean
	public Step itemMaterialMappingTasklet() {
		return stepBuilderFactory.get("itemMaterialMappingTasklet").tasklet(getItemMaterialMappingTasklet()).build();
	}

	@Bean
	public Step itemMaterialMappingStagingStep() {
		return stepBuilderFactory.get("itemMaterialMappingStagingStep")
				.<ItemMaterialFileStageDto, ItemMaterialStageDto>chunk(500)
				.reader(masterIngestionJobReader
						.itemMaterialMappingStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getItemMaterialMappingStageProcessor())
				.writer(masterIngestionJobWriter.itemMaterialMappingStagingWriter()).build();
	}

	@Bean
	public Step itemMaterialMappingIngestionTasklet() {
		return stepBuilderFactory.get("itemMaterialMappingIngestionTasklet")
				.tasklet(getItemMaterialMappingIngestionTasklet()).build();
	}

	@Bean
	public MasterJobTasklet getItemMaterialMappingTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.ITEM_MATERIAL_MAPPING_FILE_NAME.getValue(),
				FileMasterJobNameEnum.ITEM_MATERIAL_MAPPING.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.ITEM_MATERIAL_MAPPING_COLUMN_COUNT, "itemMaterialMappingFileAuditId");
	}

	@Bean
	public ItemMaterialMappingIngestionTasklet getItemMaterialMappingIngestionTasklet() {
		return new ItemMaterialMappingIngestionTasklet();
	}

	@Bean
	public ItemMaterialMappingStageProcessor getItemMaterialMappingStageProcessor() {
		return new ItemMaterialMappingStageProcessor();
	}

	@Bean
	public MasterIngestionListener getItemMaterialMappingIngestionListener() {
		return new MasterIngestionListener("itemMaterialMappingFileName", "itemMaterialMappingFileAuditId",
				"item_material_mapping_stage", "DELETE from item_material_mapping_stage where file_audit_id = '");
	}

	@Bean
	public PriceMasterValidationTasklet getPriceMasterValidationTasklet() {
		return new PriceMasterValidationTasklet();
	}

	@Bean
	public ItemStoneMappingValidationTasklet getItemStoneMappingValidationTasklet() {
		return new ItemStoneMappingValidationTasklet();
	}

	@Bean
	public ItemMaterialMappingValidationTaskletFileJobs getItemMaterialMappingValidationTasklet() {
		return new ItemMaterialMappingValidationTaskletFileJobs();
	}

}
