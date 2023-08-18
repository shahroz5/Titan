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

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.file.dto.GiftVoucherStatusFileStageDto;
import com.titan.poss.file.dto.GiftVoucherStatusStageDto;
import com.titan.poss.file.jobs.listener.GiftMasterJobListener;
import com.titan.poss.file.jobs.processor.GiftVoucherStatusStageProcessor;
import com.titan.poss.file.jobs.reader.GiftMasterJobReader;
import com.titan.poss.file.jobs.tasklet.GiftVoucherStatusIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.GiftVoucherStatusValidationTasklet;
import com.titan.poss.file.jobs.tasklet.MasterJobTasklet;
import com.titan.poss.file.jobs.writer.GiftMasterJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GiftMasterStatusJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	private static final String GV_LOCAL_SOURCE_FILE_PATH = "gv.source.path";

	private static final String GV_LOCAL_SUCCESS_PATH = "gv.success.path";

	private static final String GV_LOCAL_FAILURE_PATH = "gv.failure.path";

	private static final String TRUNCATE_GIFT_VOUCHER_STATUS_STAGE_QUERY = "DELETE from gift_voucher_status_stage where file_audit_id = '";

	@Bean(name = FileIntegrationConstants.GV_STATUS_JOB)
	public Job giftMasterJob(JobBuilderFactory jobBuilderFactory, GiftMasterJobReader giftMasterJobReader,
			GiftMasterJobWriter giftMasterJobWriter) {

		Flow gvStatusFlow = new FlowBuilder<SimpleFlow>("giftStatusFlow").start(giftVoucherStatusTasklet())
				.on(FileIntegrationConstants.COMPLETED)
				.to(giftVoucherStatusStagingStep(giftMasterJobReader, giftMasterJobWriter))
				.next(giftVoucherStatusValidateTasklet()).next(giftVoucherStatusIngestionCopyTasklet())
				.from(giftVoucherStatusTasklet()).on(FileIntegrationConstants.STOPPED).end().build();

		return jobBuilderFactory.get(FileIntegrationConstants.GV_STATUS_JOB).incrementer(new RunIdIncrementer())
				.listener(getGiftMasterStatusJobListener()).start(gvStatusFlow).end().build();

	}

	@Bean
	public Step giftVoucherStatusTasklet() {
		return stepBuilderFactory.get("giftVoucherStatusTasklet").tasklet(getGiftVoucherStatusTasklet()).build();
	}

	@Bean
	public Step giftVoucherStatusValidateTasklet() {
		return stepBuilderFactory.get("giftVoucherStatusValidateTasklet")
				.tasklet(getGiftVoucherStatusValidationTasklet()).build();
	}

	@Bean
	public Step giftVoucherStatusIngestionCopyTasklet() {
		return stepBuilderFactory.get("giftVoucherStatusIngestionCopyTasklet")
				.tasklet(getGiftVoucherStatusIngestionTasklet()).build();
	}

	@Bean
	public Step giftVoucherStatusStagingStep(GiftMasterJobReader giftMasterJobReader,
			GiftMasterJobWriter giftMasterJobWriter) {
		return stepBuilderFactory.get("giftVoucherStatusStagingStep")
				.<GiftVoucherStatusFileStageDto, GiftVoucherStatusStageDto>chunk(100)
				.reader(giftMasterJobReader.giftVoucherStatusStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getGiftVoucherStatusStageProcessor())
				.writer(giftMasterJobWriter.giftVoucherStatusStagingWriter()).build();
	}

	@Bean
	public MasterJobTasklet getGiftVoucherStatusTasklet() {
		return new MasterJobTasklet(GV_LOCAL_SOURCE_FILE_PATH, FileIntegrationConstants.GIFT_VOUCHER_STATUS_FILE_NAME,
				FileMasterJobNameEnum.GIFT_VOUCHER_STATUS.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.GIFT_VOUCHER_STATUS_COLUMN_COUNT, "giftVoucherStatusSavedId");
	}

	@Bean
	public GiftVoucherStatusStageProcessor getGiftVoucherStatusStageProcessor() {
		return new GiftVoucherStatusStageProcessor();
	}

	@Bean
	public GiftVoucherStatusValidationTasklet getGiftVoucherStatusValidationTasklet() {
		return new GiftVoucherStatusValidationTasklet();
	}

	@Bean
	public GiftVoucherStatusIngestionTasklet getGiftVoucherStatusIngestionTasklet() {
		return new GiftVoucherStatusIngestionTasklet();
	}

	@Bean
	public GiftMasterJobListener getGiftMasterStatusJobListener() {
		return new GiftMasterJobListener(GV_LOCAL_SOURCE_FILE_PATH, GV_LOCAL_SUCCESS_PATH, GV_LOCAL_FAILURE_PATH,
				TRUNCATE_GIFT_VOUCHER_STATUS_STAGE_QUERY, FileIntegrationConstants.GIFT_VOUCHER_STATUS_FILE_NAME,
				"giftVoucherStatusSavedId");
	}

}
