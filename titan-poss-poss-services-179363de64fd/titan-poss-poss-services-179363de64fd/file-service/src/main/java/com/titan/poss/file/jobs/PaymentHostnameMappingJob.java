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
import com.titan.poss.file.dto.PaymentHostnameMappingDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.listener.PaymentHostnameMappingFailureListener;
import com.titan.poss.file.jobs.mapper.PaymentHostnameMapper;
import com.titan.poss.file.jobs.processor.PaymentHostnameMappingIngestionProcessor;
import com.titan.poss.file.jobs.processor.PaymentHostnameMappingStagingProcessor;
import com.titan.poss.file.jobs.reader.PaymentHostnameMappingJobReader;
import com.titan.poss.file.jobs.writer.PaymentHostnameMappingDataSyncWriter;
import com.titan.poss.file.jobs.writer.PaymentHostnameMappingJobStagingWriter;
import com.titan.poss.file.jobs.writer.PaymentHostnameMappingJobWriter;
import com.titan.poss.payment.dao.PaymentHostnameMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PaymentHostnameMappingJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private PaymentHostnameMappingJobReader paymentHostnameMappingJobReader;

	@Bean(name = "PAYMENT_HOSTNAME_MAPPING")
	public Job paymentHostnameMappingJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			PaymentHostnameMapper paymentHostnameMapper) {

		return jobBuilderFactory.get("PAYMENT_HOSTNAME_MAPPING").incrementer(new RunIdIncrementer())
				.listener(getPaymentHostnameMappingJobListener())
				.start(paymentHostnameMappingStagingStep(getPaymentHostnameMappingStagingProcessor(),
						getPaymentHostnameMappingFailureListener(), env))
				.next(paymentHostnameMappingIngestionStep(getPaymentHostnameMappingIngestionProcessor(),
						getPaymentHostnameMappingFailureListener(), dataSource))
				.next(paymentHostnameMappingDataSyncStep(paymentHostnameMapper, dataSource)).build();
	}

	@Bean
	public Step paymentHostnameMappingDataSyncStep(PaymentHostnameMapper paymentHostnameMapper, DataSource dataSource) {
		return stepBuilderFactory.get("paymentHostnameMappingDataSyncStep")
				.<PaymentHostnameMappingDaoExt, PaymentHostnameMappingDaoExt>chunk(100)
				.reader(paymentHostnameMappingJobReader.paymentHostnameMappingDataSyncReader(
						FileIntegrationConstants.WILL_BE_INJECTED, paymentHostnameMapper, dataSource))
				.writer(getPaymentHostnameMappingDataSyncWriter()).build();
	}

	@Bean
	public PaymentHostnameMappingDataSyncWriter getPaymentHostnameMappingDataSyncWriter() {
		return new PaymentHostnameMappingDataSyncWriter();
	}

	@Bean
	public Step paymentHostnameMappingStagingStep(
			PaymentHostnameMappingStagingProcessor paymentHostnameMappingStagingProcessor,
			PaymentHostnameMappingFailureListener paymentHostnameMappingFailureListener, Environment env) {
		return stepBuilderFactory.get("paymentHostnameMappingStagingStep")
				.<PaymentHostnameMappingDto, PaymentHostnameMappingDto>chunk(500)
				.reader(paymentHostnameMappingJobReader.paymentHostnameMappingFileReader(
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(paymentHostnameMappingStagingProcessor).writer(getPaymentHostnameMappingStagingWriter())
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(paymentHostnameMappingFailureListener).build();
	}

	@Bean
	public Step paymentHostnameMappingIngestionStep(
			PaymentHostnameMappingIngestionProcessor paymentHostnameMappingProcessor,
			PaymentHostnameMappingFailureListener paymentHostnameMappingFailureListener, DataSource dataSource) {
		return stepBuilderFactory.get("paymentHostnameMappingIngestionStep")
				.<PaymentHostnameMappingDto, PaymentHostnameMappingDto>chunk(500)
				.reader(paymentHostnameMappingJobReader
						.paymentHostnameMappingIngestionReader(FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.processor(paymentHostnameMappingProcessor)
				.writer(getPaymentHostnameMappingJobWriter().paymentHostnameMappingIngestionWriter(dataSource))
				.faultTolerant().skipLimit(Integer.MAX_VALUE).skip(Exception.class)
				.listener(paymentHostnameMappingFailureListener).build();
	}

	@Bean
	public FileUploadJobListener getPaymentHostnameMappingJobListener() {
		return new FileUploadJobListener("Payment hostname",
				"DELETE from payment_hostname_mapping_stage where file_audit_id = '");
	}

	@Bean
	public PaymentHostnameMappingStagingProcessor getPaymentHostnameMappingStagingProcessor() {
		return new PaymentHostnameMappingStagingProcessor();
	}

	@Bean
	public PaymentHostnameMappingIngestionProcessor getPaymentHostnameMappingIngestionProcessor() {
		return new PaymentHostnameMappingIngestionProcessor();
	}

	@Bean
	public PaymentHostnameMappingFailureListener getPaymentHostnameMappingFailureListener() {
		return new PaymentHostnameMappingFailureListener();
	}

	@Bean
	public PaymentHostnameMappingJobWriter getPaymentHostnameMappingJobWriter() {
		return new PaymentHostnameMappingJobWriter();
	}

	@Bean
	public PaymentHostnameMappingJobStagingWriter getPaymentHostnameMappingStagingWriter() {
		return new PaymentHostnameMappingJobStagingWriter();
	}

}
