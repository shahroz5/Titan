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
import com.titan.poss.datasync.dao.ItemDatasyncStageDao;
import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;
import com.titan.poss.datasync.dao.StoneDataSyncStageDao;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dto.ItemMasterFileStageDto;
import com.titan.poss.file.dto.ItemMasterStageDto;
import com.titan.poss.file.dto.MaterialMasterFileStageDto;
import com.titan.poss.file.dto.MaterialMasterStageDto;
import com.titan.poss.file.dto.StoneMasterFileStageDto;
import com.titan.poss.file.dto.StoneMasterStageDto;
import com.titan.poss.file.jobs.listener.MasterIngestionJobListener;
import com.titan.poss.file.jobs.listener.MasterIngestionListener;
import com.titan.poss.file.jobs.mapper.ItemMasterDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.MaterialMasterDataSyncStageMapper;
import com.titan.poss.file.jobs.mapper.StoneMasterDatasyncStageMapper;
import com.titan.poss.file.jobs.processor.ItemMasterStagingProcessor;
import com.titan.poss.file.jobs.processor.MaterialMasterStageProcessor;
import com.titan.poss.file.jobs.processor.StoneMasterStageProcessor;
import com.titan.poss.file.jobs.reader.MasterIngestionJobReader;
import com.titan.poss.file.jobs.tasklet.ItemMasterIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.ItemMasterValidationTasklet;
import com.titan.poss.file.jobs.tasklet.MasterJobTasklet;
import com.titan.poss.file.jobs.tasklet.MaterialMasterIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.MaterialMasterValidationTasklet;
import com.titan.poss.file.jobs.tasklet.StoneMasterIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.StoneMasterValidationTasklet;
import com.titan.poss.file.jobs.writer.ItemMasterDataSyncWriter;
import com.titan.poss.file.jobs.writer.MasterIngestionJobWriter;
import com.titan.poss.file.jobs.writer.MaterialMasterDataSyncWriter;
import com.titan.poss.file.jobs.writer.StoneMasterDataSyncWriter;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
@Slf4j
public class MasterJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private MasterIngestionJobWriter masterIngestionJobWriter;

	@Autowired
	private MasterIngestionJobReader masterIngestionJobReader;

	private static final String SOURCE_FILE_FOLDER = "masterJob.source.path";

	@Bean(name = FileIntegrationConstants.MASTER_INGESTION_JOB)
	public Job masterJob(JobBuilderFactory jobBuilderFactory, ItemMasterDatasyncStageMapper itemMasterMapper,
			MaterialMasterDataSyncStageMapper materialMasterDataSyncStageMapper,
			StoneMasterDatasyncStageMapper stoneMasterDatasyncStageMapper) {

		Flow itemMasterFlow = new FlowBuilder<SimpleFlow>("itemMasterFlow").start(itemMasterTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(itemMasterStagingStep()).next(itemMasterValidateTasklet())
				.next(itemMasterIngestionCopyTasklet()).next(itemMasterDataSyncStep(itemMasterMapper))
				.from(itemMasterTasklet()).on(FileIntegrationConstants.STOPPED).end().build();

		Flow stoneMasterFlow = new FlowBuilder<SimpleFlow>("stoneMasterFlow").start(stoneMasterTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(stoneMasterStagingStep()).next(stoneMasterValidateTasklet())
				.next(stoneMasterIngestionCopyTasklet()).next(stoneMasterDataSyncStep(stoneMasterDatasyncStageMapper))
				.from(stoneMasterTasklet()).on(FileIntegrationConstants.STOPPED).end().build();

		Flow materialMasterFlow = new FlowBuilder<SimpleFlow>("materialMasterFlow").start(materialMasterTasklet())
				.on(FileIntegrationConstants.COMPLETED).to(materialMasterStagingStep())
				.next(materialMasterValidateTasklet()).next(materialMasterIngestionCopyTasklet())
				.next(materialMasterDataSyncStep(materialMasterDataSyncStageMapper)).from(materialMasterTasklet())
				.on(FileIntegrationConstants.STOPPED).end().build();

		Flow splitFlow = new FlowBuilder<SimpleFlow>("splitFlow").split(new SimpleAsyncTaskExecutor())
				.add(itemMasterFlow, stoneMasterFlow, materialMasterFlow).build();

		return jobBuilderFactory.get(FileIntegrationConstants.MASTER_INGESTION_JOB).incrementer(new RunIdIncrementer())
				.listener(getMasterIngestionJobListener()).start(splitFlow).end().build();
	}

	@Bean
	public MasterJobTasklet getItemMasterJobTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.ITEM_MASTER_FILE_NAME.getValue(),
				FileMasterJobNameEnum.ITEM_MASTER.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(), null, "itemMasterFileAuditId");
	}

	@Bean
	public Step itemMasterValidateTasklet() {
		return stepBuilderFactory.get("itemMasterValidateTasklet").tasklet(getItemMasterValidationTasklet()).build();
	}

	@Bean
	public Step itemMasterIngestionCopyTasklet() {
		return stepBuilderFactory.get("itemMasterIngestionCopyTasklet").tasklet(getItemMasterIngestionTasklet())
				.build();
	}

	@Bean
	public Step stoneMasterIngestionCopyTasklet() {
		return stepBuilderFactory.get("stoneMasterIngestionCopyTasklet").tasklet(getStoneMasterIngestionTasklet())
				.build();
	}

	@Bean
	public Step materialMasterIngestionCopyTasklet() {
		return stepBuilderFactory.get("materialMasterIngestionCopyTasklet").tasklet(getMaterialMasterIngestionTasklet())
				.build();
	}

	@Bean
	public Step itemMasterDataSyncStep(ItemMasterDatasyncStageMapper itemMasterDatasyncStageMapper) {
		return stepBuilderFactory.get("itemMasterDataSyncStep").<ItemDatasyncStageDao, ItemDatasyncStageDao>chunk(100)
				.reader(masterIngestionJobReader.itemMasterDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						itemMasterDatasyncStageMapper))
				.writer(getItemMasterDataSyncWriter()).listener(getItemMasterIngestionListener()).build();
	}

	@Bean
	public Step materialMasterDataSyncStep(MaterialMasterDataSyncStageMapper materialMasterDataSyncStageMapper) {
		return stepBuilderFactory.get("materialMasterDataSyncStep")
				.<MaterialDatasyncStageDao, MaterialDatasyncStageDao>chunk(100)
				.reader(masterIngestionJobReader.materialMasterDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						materialMasterDataSyncStageMapper))
				.writer(getMaterialMasterDataSyncWriter()).listener(getMaterialMasterIngestionListener()).build();
	}

	@Bean
	public Step stoneMasterDataSyncStep(StoneMasterDatasyncStageMapper stoneMasterDatasyncStageMapper) {
		return stepBuilderFactory.get("stoneMasterDataSyncStep")
				.<StoneDataSyncStageDao, StoneDataSyncStageDao>chunk(100)
				.reader(masterIngestionJobReader.stoneMasterDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						stoneMasterDatasyncStageMapper))
				.writer(getStoneMasterDataSyncWriter()).listener(getStoneMasterIngestionListener()).build();
	}

	@Bean
	public ItemMasterDataSyncWriter getItemMasterDataSyncWriter() {
		return new ItemMasterDataSyncWriter();
	}

	@Bean
	public ItemMasterStagingProcessor getItemMasterStagingProcessor() {
		log.info("item master stagging ");
		return new ItemMasterStagingProcessor();
	}

	@Bean
	public ItemMasterValidationTasklet getItemMasterValidationTasklet() {
		return new ItemMasterValidationTasklet();
	}

	@Bean
	public ItemMasterIngestionTasklet getItemMasterIngestionTasklet() {
		return new ItemMasterIngestionTasklet();
	}

	@Bean
	public StoneMasterIngestionTasklet getStoneMasterIngestionTasklet() {
		return new StoneMasterIngestionTasklet();
	}

	@Bean
	public MaterialMasterIngestionTasklet getMaterialMasterIngestionTasklet() {
		return new MaterialMasterIngestionTasklet();
	}

	@Bean
	public StoneMasterValidationTasklet getStoneMasterValidationTasklet() {
		return new StoneMasterValidationTasklet();
	}

	@Bean
	public MaterialMasterValidationTasklet getMaterialMasterValidationTasklet() {
		return new MaterialMasterValidationTasklet();
	}

	@Bean
	public Step itemMasterTasklet() {
		return stepBuilderFactory.get("itemMasterTasklet").tasklet(getItemMasterJobTasklet()).build();
	}

	@Bean
	public Step itemMasterStagingStep() {
		return stepBuilderFactory.get("itemMasterStagingStep").<ItemMasterFileStageDto, ItemMasterStageDto>chunk(500)
				.reader(masterIngestionJobReader.itemMasterStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getItemMasterStagingProcessor()).writer(masterIngestionJobWriter.itemMasterStagingWriter())
				.build();
	}

	@Bean
	public MasterIngestionJobListener getMasterIngestionJobListener() {
		return new MasterIngestionJobListener();
	}

	@Bean
	public MasterIngestionListener getItemMasterIngestionListener() {
		return new MasterIngestionListener("itemMasterFileName", "itemMasterFileAuditId", "item_master_stage",
				"DELETE from item_master_stage where file_audit_id = '");
	}

	@Bean
	public Step stoneMasterValidateTasklet() {
		return stepBuilderFactory.get("stoneMasterValidateTasklet").tasklet(getStoneMasterValidationTasklet()).build();
	}

	@Bean
	public Step stoneMasterTasklet() {
		return stepBuilderFactory.get("stoneMasterTasklet").tasklet(getStoneMasterTasklet()).build();
	}

	@Bean
	public Step stoneMasterStagingStep() {
		return stepBuilderFactory.get("stoneMasterStagingStep").<StoneMasterFileStageDto, StoneMasterStageDto>chunk(500)
				.reader(masterIngestionJobReader.stoneMasterStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getStoneMasterStageProcessor()).writer(masterIngestionJobWriter.stoneMasterStagingWriter())
				.build();
	}

	@Bean
	public MasterJobTasklet getStoneMasterTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.STONE_MASTER_FILE_NAME.getValue(),
				FileMasterJobNameEnum.STONE_MASTER.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.STONE_MASTER_COLUMN_COUNT, "stoneMasterFileAuditId");
	}

	@Bean
	public StoneMasterDataSyncWriter getStoneMasterDataSyncWriter() {
		return new StoneMasterDataSyncWriter();
	}

	@Bean
	public StoneMasterStageProcessor getStoneMasterStageProcessor() {
		return new StoneMasterStageProcessor();
	}

	@Bean
	public MasterIngestionListener getStoneMasterIngestionListener() {
		return new MasterIngestionListener("stoneMasterFileName", "stoneMasterFileAuditId", "stone_master_stage",
				"DELETE from stone_master_stage where file_audit_id = '");
	}

	@Bean
	public Step materialMasterTasklet() {
		return stepBuilderFactory.get("materialMasterTasklet").tasklet(getMaterialMasterTasklet()).build();
	}

	@Bean
	public Step materialMasterValidateTasklet() {
		return stepBuilderFactory.get("materialMasterValidateTasklet").tasklet(getMaterialMasterValidationTasklet())
				.build();
	}

	@Bean
	public Step materialMasterStagingStep() {
		return stepBuilderFactory.get("materialMasterStagingStep")
				.<MaterialMasterFileStageDto, MaterialMasterStageDto>chunk(500)
				.reader(masterIngestionJobReader.materialMasterStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getMaterialMasterStageProcessor())
				.writer(masterIngestionJobWriter.materialMasterStagingWriter()).build();
	}

	@Bean
	public MasterJobTasklet getMaterialMasterTasklet() {
		return new MasterJobTasklet(SOURCE_FILE_FOLDER, JobFileNameEnum.MATERIAL_MASTER_FILE_NAME.getValue(),
				FileMasterJobNameEnum.MATERIAL_MASTER.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.MATERIAL_MASTER_COLUMN_COUNT, "materialMasterFileAuditId");
	}

	@Bean
	public MaterialMasterDataSyncWriter getMaterialMasterDataSyncWriter() {
		return new MaterialMasterDataSyncWriter();
	}

	@Bean
	public MaterialMasterStageProcessor getMaterialMasterStageProcessor() {
		return new MaterialMasterStageProcessor();
	}

	@Bean
	public MasterIngestionListener getMaterialMasterIngestionListener() {
		return new MasterIngestionListener("materialMasterFileName", "materialMasterFileAuditId",
				"material_master_stage", "DELETE from material_master_stage where file_audit_id = '");
	}
}
