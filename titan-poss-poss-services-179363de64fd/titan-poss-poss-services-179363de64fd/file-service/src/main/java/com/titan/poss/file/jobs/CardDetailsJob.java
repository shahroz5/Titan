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
import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.file.jobs.listener.CardDetailsIngestionFailureListener;
import com.titan.poss.file.jobs.listener.CardDetailsStagingFailureListener;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.mapper.CardDetailsMapper;
import com.titan.poss.file.jobs.processor.CardDetailsIngestionProcessor;
import com.titan.poss.file.jobs.processor.CardDetailsStagingProcessor;
import com.titan.poss.file.jobs.reader.CardDetailsJobReader;
import com.titan.poss.file.jobs.writer.CardDetailsDataSyncWriter;
import com.titan.poss.file.jobs.writer.CardDetailsJobStagingWriter;
import com.titan.poss.file.jobs.writer.CardDetailsJobWriter;
import com.titan.poss.payment.dao.CashbackCardDetailsDao;
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CardDetailsJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private CardDetailsJobReader cardDetailsJobReader;

	@Bean(name = "CARD_DETAILS")
	public Job cardDetailsJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			DataSource dataSourceIngestion, CardDetailsJobWriter cardDetailsJobWriter,
			CardDetailsMapper cardDetailsMapper) {

		return jobBuilderFactory.get("CARD_DETAILS").incrementer(new RunIdIncrementer())
				.listener(getCardDetailsJobListener())
				.start(cardDetailsStagingStep(getCardDetailsStagingProcessor(), getCardDetailsStagingFailureListener(),
						env))
				.next(cardDetailsIngestionStep(getCardDetailsIngestionProcessor(),
						getCardDetailsIngestionFailureListener(), dataSource, cardDetailsJobWriter))
				.next(cardDetailsDataSyncStep(cardDetailsMapper, dataSource)).build();
	}

	@Bean
	public Step cardDetailsDataSyncStep(CardDetailsMapper cardDetailsMapper, DataSource dataSource) {
		return stepBuilderFactory.get("cardDetailsDataSyncStep")
				.<CashbackCardDetailsDaoExt, CashbackCardDetailsDaoExt>chunk(100)
				.reader(cardDetailsJobReader.cardDetailsDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						cardDetailsMapper, dataSource))
				.writer(getCardDetailsDataSyncWriter()).build();
	}

	@Bean
	public CardDetailsDataSyncWriter getCardDetailsDataSyncWriter() {
		return new CardDetailsDataSyncWriter();
	}

	@Bean
	public Step cardDetailsStagingStep(CardDetailsStagingProcessor cardDetailsStagingProcessor,
			CardDetailsStagingFailureListener cardDetailsStagingFailureListener, Environment env) {
		return stepBuilderFactory.get("cardDetailsStagingStep").<CardDetailsDto, CardDetailsDto>chunk(500)
				.reader(cardDetailsJobReader.cardDetailsFileReader(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(cardDetailsStagingProcessor).writer(getCardDetailsStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(cardDetailsStagingFailureListener).build();
	}

	@Bean
	public Step cardDetailsIngestionStep(CardDetailsIngestionProcessor cardDetailsProcessor,
			CardDetailsIngestionFailureListener cardDetailsIngestionFailureListener, DataSource dataSource,
			CardDetailsJobWriter cardDetailsJobWriter) {
		return stepBuilderFactory.get("cardDetailsIngestionStep").<CardDetailsDto, CashbackCardDetailsDao>chunk(500)
				.reader(cardDetailsJobReader.cardDetailsIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.processor(cardDetailsProcessor)
				.writer(cardDetailsJobWriter.cardDetailsIngestionWriter(dataSource)).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(cardDetailsIngestionFailureListener)
				.build();
	}

	@Bean
	public FileUploadJobListener getCardDetailsJobListener() {
		return new FileUploadJobListener("Card details", "DELETE from card_details_stage where file_audit_id = '");
	}

	@Bean
	public CardDetailsStagingProcessor getCardDetailsStagingProcessor() {
		return new CardDetailsStagingProcessor();
	}

	@Bean
	public CardDetailsIngestionProcessor getCardDetailsIngestionProcessor() {
		return new CardDetailsIngestionProcessor();
	}

	@Bean
	public CardDetailsStagingFailureListener getCardDetailsStagingFailureListener() {
		return new CardDetailsStagingFailureListener();
	}

	@Bean
	public CardDetailsIngestionFailureListener getCardDetailsIngestionFailureListener() {
		return new CardDetailsIngestionFailureListener();
	}

	@Bean
	public CardDetailsJobStagingWriter getCardDetailsStagingWriter() {
		return new CardDetailsJobStagingWriter();
	}

}
