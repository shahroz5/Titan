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
import com.titan.poss.file.dto.TepTransactionDto;
import com.titan.poss.file.jobs.listener.TepTransactionJobListener;
import com.titan.poss.file.jobs.reader.TepTransactionJobReader;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.tasklet.TepFileWritingTasklet;
import com.titan.poss.file.jobs.writer.TepTransactionJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class TeptransactionJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "tepTransactionJob")
	public Job tepTransactionJob(JobBuilderFactory jobBuilderFactory, TepTransactionJobListener tepJobListener,
			Environment env, DataSource dataSource, TepTransactionJobReader tepTransactionJobReader,
			TepTransactionJobWriter tepTransactionJobWriter) {

		return jobBuilderFactory.get("tepTransactionJob").incrementer(new RunIdIncrementer()).listener(tepJobListener)
				.start(tepTransactionHdrStagingStep(tepTransactionJobReader, tepTransactionJobWriter, dataSource))
				.next(tepTransactionDtlStagingStep(tepTransactionJobReader, tepTransactionJobWriter, dataSource))
				.next(tepTransactionCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(tepTransactionFileWritingTasklet()).from(tepTransactionCheckTasklet())
				.on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step tepTransactionHdrStagingStep(TepTransactionJobReader tepTransactionJobReader,
			TepTransactionJobWriter tepTransactionJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("tepTransactionHdrStagingStep").<TepTransactionDto, TepTransactionDto>chunk(500)
				.reader(tepTransactionJobReader.tepHdrTransactionReader(dataSource,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(tepTransactionJobWriter.tepTransactionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step tepTransactionDtlStagingStep(TepTransactionJobReader tepTransactionJobReader,
			TepTransactionJobWriter tepTransactionJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("tepTransactionDtlStagingStep").<TepTransactionDto, TepTransactionDto>chunk(500)
				.reader(tepTransactionJobReader.tepDetTransactionReader(dataSource,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(tepTransactionJobWriter.tepTransactionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step tepTransactionFileWritingTasklet() {
		return stepBuilderFactory.get("tepTransactionFileWritingTasklet").tasklet(getTepFileWritingTasklet()).build();
	}

	@Bean
	public TepFileWritingTasklet getTepFileWritingTasklet() {
		return new TepFileWritingTasklet();
	}

	@Bean
	public Step tepTransactionCheckTasklet() {
		return stepBuilderFactory.get("tepTransactionCheckTasklet").tasklet(getTepTransactionFileWritingCheckTasklet())
				.build();
	}

	@Bean
	public FileWritingCheckTasklet getTepTransactionFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.tep_transaction_stage where file_id = ?",
				"tepTransactionId");
	}
}
