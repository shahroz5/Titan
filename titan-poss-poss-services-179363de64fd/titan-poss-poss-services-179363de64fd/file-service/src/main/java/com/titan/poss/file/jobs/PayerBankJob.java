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
import com.titan.poss.file.dto.PayerBankDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.PayerBankFailureListener;
import com.titan.poss.file.jobs.mapper.PayerBankMapper;
import com.titan.poss.file.jobs.processor.PayerBankIngestionProcessor;
import com.titan.poss.file.jobs.processor.PayerBankStagingProcessor;
import com.titan.poss.file.jobs.reader.PayerBankJobReader;
import com.titan.poss.file.jobs.writer.PayerBankDataSyncWriter;
import com.titan.poss.file.jobs.writer.PayerBankJobStagingWriter;
import com.titan.poss.file.jobs.writer.PayerBankJobWriter;
import com.titan.poss.payment.dao.PayerBankDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PayerBankJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private PayerBankJobReader payerBankJobReader;

	@Bean(name = "PAYER_BANK")
	public Job payerBankJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			PayerBankMapper payerBankMapper) {

		return jobBuilderFactory.get("PAYER_BANK").incrementer(new RunIdIncrementer())
				.listener(getPayerBankJobListener())
				.start(payerBankStagingStep(getPayerBankStagingProcessor(), getPayerBankFailureListener(), env))
				.next(payerBankIngestionStep(getPayerBankIngestionProcessor(), getPayerBankFailureListener(),
						dataSource))
				.next(payerBankDataSyncStep(payerBankMapper, dataSource)).build();
	}

	@Bean
	public Step payerBankDataSyncStep(PayerBankMapper payerBankMapper, DataSource dataSource) {
		return stepBuilderFactory.get("payerBankDataSyncStep").<PayerBankDao, PayerBankDao>chunk(100)
				.reader(payerBankJobReader.payerBankDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						payerBankMapper, dataSource))
				.writer(getPayerBankDataSyncWriter()).build();
	}

	@Bean
	public PayerBankDataSyncWriter getPayerBankDataSyncWriter() {
		return new PayerBankDataSyncWriter();
	}

	@Bean
	public Step payerBankStagingStep(PayerBankStagingProcessor payerBankStagingProcessor,
			PayerBankFailureListener payerBankFailureListener, Environment env) {
		return stepBuilderFactory.get("payerBankStagingStep").<PayerBankDto, PayerBankDto>chunk(500)
				.reader(payerBankJobReader.payerBankFileReader(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(payerBankStagingProcessor)
				.writer(getPayerBankStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(payerBankFailureListener).build();
	}

	@Bean
	public Step payerBankIngestionStep(PayerBankIngestionProcessor payerBankProcessor,
			PayerBankFailureListener payerBankFailureListener, DataSource dataSource) {
		return stepBuilderFactory.get("payerBankIngestionStep").<PayerBankDto, PayerBankDto>chunk(500)
				.reader(payerBankJobReader.payerBankIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.processor(payerBankProcessor)
				.writer(getPayerBankJobWriter().payerBankIngestionWriter(dataSource)).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(payerBankFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getPayerBankJobListener() {
		return new FileUploadJobListener("Payer bank", "DELETE from payer_bank_stage where file_audit_id = '");
	}

	@Bean
	public PayerBankStagingProcessor getPayerBankStagingProcessor() {
		return new PayerBankStagingProcessor();
	}

	@Bean
	public PayerBankIngestionProcessor getPayerBankIngestionProcessor() {
		return new PayerBankIngestionProcessor();
	}

	@Bean
	public PayerBankFailureListener getPayerBankFailureListener() {
		return new PayerBankFailureListener();
	}

	@Bean
	public PayerBankJobWriter getPayerBankJobWriter() {
		return new PayerBankJobWriter();
	}

	@Bean
	public PayerBankJobStagingWriter getPayerBankStagingWriter() {
		return new PayerBankJobStagingWriter();
	}

}
