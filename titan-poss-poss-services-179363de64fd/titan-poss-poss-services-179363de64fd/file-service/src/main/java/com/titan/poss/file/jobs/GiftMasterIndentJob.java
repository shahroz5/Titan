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
import com.titan.poss.file.dto.GiftVoucherIndentFileStageDto;
import com.titan.poss.file.dto.GiftVoucherIndentStageDto;
import com.titan.poss.file.jobs.listener.GiftMasterJobListener;
import com.titan.poss.file.jobs.processor.GiftVoucherIndentStageProcessor;
import com.titan.poss.file.jobs.reader.GiftMasterJobReader;
import com.titan.poss.file.jobs.tasklet.GiftVoucherIndentIngestionTasklet;
import com.titan.poss.file.jobs.tasklet.GiftVoucherIndentValidationTasklet;
import com.titan.poss.file.jobs.tasklet.MasterJobTasklet;
import com.titan.poss.file.jobs.writer.GiftMasterJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GiftMasterIndentJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	private static final String GV_LOCAL_SOURCE_FILE_PATH = "gv.source.path";

	private static final String GV_LOCAL_SUCCESS_PATH = "gv.success.path";

	private static final String GV_LOCAL_FAILURE_PATH = "gv.failure.path";

	private static final String TRUNCATE_GIFT_VOUCHER_INDENT_STAGE_QUERY = "DELETE from gift_voucher_indent_stage where file_audit_id = '";

	@Bean(name = FileIntegrationConstants.GV_INDENT_JOB)
	public Job giftMasterJob(JobBuilderFactory jobBuilderFactory, GiftMasterJobReader giftMasterJobReader,
			GiftMasterJobWriter giftMasterJobWriter) {

		Flow gvIndentFlow = new FlowBuilder<SimpleFlow>("giftIndentFlow").start(giftVoucherIndentTasklet())
				.on(FileIntegrationConstants.COMPLETED)
				.to(giftVoucherIndentStagingStep(giftMasterJobReader, giftMasterJobWriter))
				.next(giftVoucherIndentValidateTasklet()).next(giftVoucherIndentIngestionCopyTasklet())
				.from(giftVoucherIndentTasklet()).on(FileIntegrationConstants.STOPPED).end().build();

		return jobBuilderFactory.get(FileIntegrationConstants.GV_INDENT_JOB).incrementer(new RunIdIncrementer())
				.listener(getGiftMasterIndentJobListener()).start(gvIndentFlow).end().build();

	}

	@Bean
	public Step giftVoucherIndentTasklet() {
		return stepBuilderFactory.get("giftVoucherIndentTasklet").tasklet(getGiftVoucherIndentTasklet()).build();
	}

	@Bean
	public Step giftVoucherIndentValidateTasklet() {
		return stepBuilderFactory.get("giftVoucherIndentValidateTasklet")
				.tasklet(getGiftVoucherIndentValidationTasklet()).build();
	}

	@Bean
	public Step giftVoucherIndentIngestionCopyTasklet() {
		return stepBuilderFactory.get("giftVoucherIndentIngestionCopyTasklet")
				.tasklet(getGiftVoucherIndentIngestionTasklet()).build();
	}

	@Bean
	public Step giftVoucherIndentStagingStep(GiftMasterJobReader giftMasterJobReader,
			GiftMasterJobWriter giftMasterJobWriter) {
		return stepBuilderFactory.get("giftVoucherIndentStagingStep")
				.<GiftVoucherIndentFileStageDto, GiftVoucherIndentStageDto>chunk(100)
				.reader(giftMasterJobReader.giftVoucherIndentStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.processor(getGiftVoucherIndentStageProcessor())
				.writer(giftMasterJobWriter.giftVoucherIndentStagingWriter()).build();
	}

	@Bean
	public MasterJobTasklet getGiftVoucherIndentTasklet() {
		return new MasterJobTasklet(GV_LOCAL_SOURCE_FILE_PATH, FileIntegrationConstants.GIFT_VOUCHER_INDENT_FILE_NAME,
				FileMasterJobNameEnum.GIFT_VOUCHER_INDENT.getValue(), FileGroupEnum.ORACLE.toString(),
				FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(),
				FileIntegrationConstants.GIFT_VOUCHER_INDENT_COLUMN_COUNT, "giftVoucherIndentSavedId");
	}

	@Bean
	public GiftVoucherIndentStageProcessor getGiftVoucherIndentStageProcessor() {
		return new GiftVoucherIndentStageProcessor();
	}

	@Bean
	public GiftVoucherIndentValidationTasklet getGiftVoucherIndentValidationTasklet() {
		return new GiftVoucherIndentValidationTasklet();
	}

	@Bean
	public GiftVoucherIndentIngestionTasklet getGiftVoucherIndentIngestionTasklet() {
		return new GiftVoucherIndentIngestionTasklet();
	}

	@Bean
	public GiftMasterJobListener getGiftMasterIndentJobListener() {
		return new GiftMasterJobListener(GV_LOCAL_SOURCE_FILE_PATH, GV_LOCAL_SUCCESS_PATH, GV_LOCAL_FAILURE_PATH,
				TRUNCATE_GIFT_VOUCHER_INDENT_STAGE_QUERY, FileIntegrationConstants.GIFT_VOUCHER_INDENT_FILE_NAME,
				"giftVoucherIndentSavedId");
	}

}
