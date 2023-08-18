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
import com.titan.poss.file.dto.GiftVoucherStatusUpdateDto;
import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.GiftVoucherStatusUpdateFailureListener;
import com.titan.poss.file.jobs.processor.GiftVoucherStatusUpdateIngestionProcessor;
import com.titan.poss.file.jobs.processor.GiftVoucherStatusUpdateStageProcessor;
import com.titan.poss.file.jobs.reader.GiftVoucherStatusUpdateJobReader;
import com.titan.poss.file.jobs.writer.GiftVoucherStatusUpdateJobStagingWriter;
import com.titan.poss.file.jobs.writer.GiftVoucherStatusUpdateJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherStatusUpdateJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private GiftVoucherStatusUpdateJobReader giftVoucherStatusUpdateJobReader;

	@Bean(name = "GIFT_VOUCHER_STATUS_UPDATE")
	public Job giftVoucherStatusUpdateJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource) {

		return jobBuilderFactory.get("GIFT_VOUCHER_STATUS_UPDATE").incrementer(new RunIdIncrementer())
				.listener(getGiftVoucherStatusUpdateJobListener())
				.start(giftVoucherStatusUpdateStagingStep(getGiftVoucherStatusUpdateStagingProcessor(),
						getGiftVoucherStatusUpdateFailureListener(), env))
				.next(giftVoucherStatusUpdateIngestionStep(getGiftVoucherStatusUpdateIngestionProcessor(),
						getGiftVoucherStatusUpdateFailureListener(), dataSource))
				.build();
	}

	@Bean
	public Step giftVoucherStatusUpdateStagingStep(
			GiftVoucherStatusUpdateStageProcessor giftVoucherStatusUpdateStageProcessor,
			GiftVoucherStatusUpdateFailureListener giftVoucherStatusUpdateFailureListener, Environment env) {
		return stepBuilderFactory.get("giftVoucherStatusUpdateStagingStep")
				.<GiftVoucherStatusUpdateDto, GiftVoucherStatusUpdateIngestionDto>chunk(500)
				.reader(giftVoucherStatusUpdateJobReader.giftVoucherStatusUpdateFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(giftVoucherStatusUpdateStageProcessor).writer(getGiftVoucherStatusUpdateStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(giftVoucherStatusUpdateFailureListener).build();
	}

	@Bean
	public Step giftVoucherStatusUpdateIngestionStep(
			GiftVoucherStatusUpdateIngestionProcessor giftVoucherStatusUpdateProcessor,
			GiftVoucherStatusUpdateFailureListener giftVoucherStatusUpdateFailureListener, DataSource dataSource) {
		return stepBuilderFactory.get("giftVoucherStatusUpdateIngestionStep")
				.<GiftVoucherStatusUpdateIngestionDto, GiftVoucherStatusUpdateIngestionDto>chunk(500)
				.reader(giftVoucherStatusUpdateJobReader
						.giftVoucherStatusUpdateIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(giftVoucherStatusUpdateProcessor)
				.writer(getGiftVoucherStatusUpdateJobWriter().giftVoucherStatusUpdateIngestionWriter(dataSource))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(giftVoucherStatusUpdateFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getGiftVoucherStatusUpdateJobListener() {
		return new FileUploadJobListener("Gift voucher status update",
				"DELETE from gift_voucher_status_update_stage where file_audit_id = '");
	}

	@Bean
	public GiftVoucherStatusUpdateStageProcessor getGiftVoucherStatusUpdateStagingProcessor() {
		return new GiftVoucherStatusUpdateStageProcessor();
	}

	@Bean
	public GiftVoucherStatusUpdateIngestionProcessor getGiftVoucherStatusUpdateIngestionProcessor() {
		return new GiftVoucherStatusUpdateIngestionProcessor();
	}

	@Bean
	public GiftVoucherStatusUpdateFailureListener getGiftVoucherStatusUpdateFailureListener() {
		return new GiftVoucherStatusUpdateFailureListener();
	}

	@Bean
	public GiftVoucherStatusUpdateJobWriter getGiftVoucherStatusUpdateJobWriter() {
		return new GiftVoucherStatusUpdateJobWriter();
	}

	@Bean
	public GiftVoucherStatusUpdateJobStagingWriter getGiftVoucherStatusUpdateStagingWriter() {
		return new GiftVoucherStatusUpdateJobStagingWriter();
	}

}
