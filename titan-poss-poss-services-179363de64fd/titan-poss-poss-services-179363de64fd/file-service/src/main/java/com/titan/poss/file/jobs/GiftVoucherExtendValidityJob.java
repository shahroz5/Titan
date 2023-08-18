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
import com.titan.poss.file.dto.GiftVoucherExtendValidityDto;
import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.GiftVoucherExtendValidityFailureListener;
import com.titan.poss.file.jobs.processor.GiftVoucherExtendValidityIngestionProcessor;
import com.titan.poss.file.jobs.processor.GiftVoucherExtendValidityStageProcessor;
import com.titan.poss.file.jobs.reader.GiftVoucherExtendValidityJobReader;
import com.titan.poss.file.jobs.writer.GiftVoucherExtendValidityJobStagingWriter;
import com.titan.poss.file.jobs.writer.GiftVoucherExtendValidityJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherExtendValidityJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private GiftVoucherExtendValidityJobReader giftVoucherExtendValidityJobReader;

	@Bean(name = "GIFT_VOUCHER_EXTEND_VALIDITY")
	public Job giftVoucherExtendValidityJob(JobBuilderFactory jobBuilderFactory, Environment env,
			DataSource dataSource) {

		return jobBuilderFactory.get("GIFT_VOUCHER_EXTEND_VALIDITY").incrementer(new RunIdIncrementer())
				.listener(getGiftVoucherExtendValidityJobListener())
				.start(giftVoucherExtendValidityStagingStep(getGiftVoucherExtendValidityStagingProcessor(),
						getGiftVoucherExtendValidityFailureListener(), env))
				.next(giftVoucherExtendValidityIngestionStep(getGiftVoucherExtendValidityIngestionProcessor(),
						getGiftVoucherExtendValidityFailureListener(), dataSource))
				.build();
	}

	@Bean
	public Step giftVoucherExtendValidityStagingStep(
			GiftVoucherExtendValidityStageProcessor giftVoucherExtendValidityStageProcessor,
			GiftVoucherExtendValidityFailureListener giftVoucherExtendValidityFailureListener, Environment env) {
		return stepBuilderFactory.get("giftVoucherExtendValidityStagingStep")
				.<GiftVoucherExtendValidityDto, GiftVoucherExtendValidityIngestionDto>chunk(500)
				.reader(giftVoucherExtendValidityJobReader.giftVoucherExtendValidityFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(giftVoucherExtendValidityStageProcessor).writer(getGiftVoucherExtendValidityStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(giftVoucherExtendValidityFailureListener).build();
	}

	@Bean
	public Step giftVoucherExtendValidityIngestionStep(
			GiftVoucherExtendValidityIngestionProcessor giftVoucherExtendValidityProcessor,
			GiftVoucherExtendValidityFailureListener giftVoucherExtendValidityFailureListener, DataSource dataSource) {
		return stepBuilderFactory.get("giftVoucherExtendValidityIngestionStep")
				.<GiftVoucherExtendValidityIngestionDto, GiftVoucherExtendValidityIngestionDto>chunk(500)
				.reader(giftVoucherExtendValidityJobReader.giftVoucherExtendValidityIngestionReader(
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(giftVoucherExtendValidityProcessor)
				.writer(getGiftVoucherExtendValidityJobWriter().giftVoucherExtendValidityIngestionWriter(dataSource))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(giftVoucherExtendValidityFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getGiftVoucherExtendValidityJobListener() {
		return new FileUploadJobListener("Gift voucer extend validity",
				"DELETE from gift_voucher_extend_validity_stage where file_audit_id = '");
	}

	@Bean
	public GiftVoucherExtendValidityStageProcessor getGiftVoucherExtendValidityStagingProcessor() {
		return new GiftVoucherExtendValidityStageProcessor();
	}

	@Bean
	public GiftVoucherExtendValidityIngestionProcessor getGiftVoucherExtendValidityIngestionProcessor() {
		return new GiftVoucherExtendValidityIngestionProcessor();
	}

	@Bean
	public GiftVoucherExtendValidityFailureListener getGiftVoucherExtendValidityFailureListener() {
		return new GiftVoucherExtendValidityFailureListener();
	}

	@Bean
	public GiftVoucherExtendValidityJobWriter getGiftVoucherExtendValidityJobWriter() {
		return new GiftVoucherExtendValidityJobWriter();
	}

	@Bean
	public GiftVoucherExtendValidityJobStagingWriter getGiftVoucherExtendValidityStagingWriter() {
		return new GiftVoucherExtendValidityJobStagingWriter();
	}

}