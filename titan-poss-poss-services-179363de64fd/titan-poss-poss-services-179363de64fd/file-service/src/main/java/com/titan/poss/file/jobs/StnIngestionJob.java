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
import org.springframework.core.env.Environment;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dto.StnFileStageDto;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.jobs.listener.StnAndInvoiceJobListener;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.file.jobs.processor.StnStageProcessor;
import com.titan.poss.file.jobs.reader.StnJobReader;
import com.titan.poss.file.jobs.tasklet.StnDeciderTasklet;
import com.titan.poss.file.jobs.tasklet.StnIngestionTasklet;
import com.titan.poss.file.jobs.writer.StnAndInvoiceLotMaterialDetailsDataSyncWriter;
import com.titan.poss.file.jobs.writer.StnAndInvoiceLotStoneDetailsDataSyncWriter;
import com.titan.poss.file.jobs.writer.StnStagingWriter;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StnIngestionJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private StnJobReader stnJobReader;

	private static final String STN_JOB_SOURCE_FILE_PATH = "stn.file.source.path";

	private static final String STN_JOB_SUCCESS_PATH = "stn.file.success.path";

	private static final String STN_JOB_FAILURE_PATH = "stn.file.failure.path";

	@Bean(name = "stnJob")
	public Job stnJob(JobBuilderFactory jobBuilderFactory, Environment env, LotStoneDetailsMapper lotStoneDetailsMapper,
			LotMaterialDetailsMapper lotMaterialDetailsMapper) {

		Flow stnStagingFlow = new FlowBuilder<SimpleFlow>("stnStagingFlow").start(stnStagingStep(env)).build();
		Flow deciderFlow = new FlowBuilder<SimpleFlow>("deciderFlow").start(stnDeciderStep()).on("COMPLETED")
				.to(stnIngestionStep()).next(stnLotStoneDetailsDataSyncStep(lotStoneDetailsMapper))
				.next(stnLotMaterialDetailsDataSyncStep(lotMaterialDetailsMapper)).from(stnDeciderStep()).on("STOPPED")
				.end().build();

		return jobBuilderFactory.get("stnJob").incrementer(new RunIdIncrementer()).listener(getStnJobListener())
				.start(stnStagingFlow).next(deciderFlow).end().build();
	}

	@SuppressWarnings("unchecked")
	@Bean
	public Step stnStagingStep(Environment env) {
		return stepBuilderFactory.get("stnStagingStep").<StnFileStageDto, StnStageDto>chunk(Integer.MAX_VALUE)
				.reader(stnJobReader.stnFileReader(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(getStnStageProcessor()).writer(getStnStagingWriter()).build();
	}

	@Bean
	public Step stnDeciderStep() {
		return stepBuilderFactory.get("stnDeciderStep").tasklet(getStnDeciderTasklet()).build();
	}

	@Bean
	public Step stnIngestionStep() {
		return stepBuilderFactory.get("stnIngestionStep").tasklet(getStnIngestionTasklet()).build();
	}

	@Bean
	public Step stnLotStoneDetailsDataSyncStep(LotStoneDetailsMapper lotStoneDetailsMapper) {
		return stepBuilderFactory.get("stnLotStoneDetailsDataSyncStep").<LotDetailsDao, LotDetailsDao>chunk(100)
				.reader(stnJobReader.stnLotStoneDetailsDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						lotStoneDetailsMapper))
				.writer(getStnLotStoneDetailsDataSyncWriter()).build();
	}

	@Bean
	public Step stnLotMaterialDetailsDataSyncStep(LotMaterialDetailsMapper lotMaterialDetailsMapper) {
		return stepBuilderFactory.get("stnLotMaterialDetailsDataSyncStep")
				.<LotMaterialDetailsDao, LotMaterialDetailsDao>chunk(100)
				.reader(stnJobReader.stnLotMaterialsDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						lotMaterialDetailsMapper))
				.writer(getStnLotMaterialDetailsDataSyncWriter()).build();
	}

	@Bean
	public StnDeciderTasklet getStnDeciderTasklet() {
		return new StnDeciderTasklet();
	}

	@Bean
	public StnIngestionTasklet getStnIngestionTasklet() {
		return new StnIngestionTasklet();
	}

	@Bean
	public StnAndInvoiceJobListener getStnJobListener() {
		return new StnAndInvoiceJobListener(STN_JOB_SOURCE_FILE_PATH, STN_JOB_SUCCESS_PATH, STN_JOB_FAILURE_PATH, "Stn",
				JobFileNameEnum.STN_FILE_NAME.getValue(), "stnFileAuditId");
	}

	@Bean
	public StnStageProcessor getStnStageProcessor() {
		return new StnStageProcessor();
	}

	@Bean
	public StnStagingWriter getStnStagingWriter() {
		return new StnStagingWriter();
	}

	@Bean
	public StnAndInvoiceLotStoneDetailsDataSyncWriter getStnLotStoneDetailsDataSyncWriter() {
		return new StnAndInvoiceLotStoneDetailsDataSyncWriter();
	}

	@Bean
	public StnAndInvoiceLotMaterialDetailsDataSyncWriter getStnLotMaterialDetailsDataSyncWriter() {
		return new StnAndInvoiceLotMaterialDetailsDataSyncWriter();
	}
}
