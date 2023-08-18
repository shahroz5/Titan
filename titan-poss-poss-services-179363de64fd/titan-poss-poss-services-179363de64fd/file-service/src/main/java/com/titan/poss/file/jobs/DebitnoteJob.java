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
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.job.flow.support.SimpleFlow;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.task.SimpleAsyncTaskExecutor;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;
import com.titan.poss.file.jobs.listener.DebitNoteJobListener;
import com.titan.poss.file.jobs.reader.DebitNoteJobReader;
import com.titan.poss.file.jobs.tasklet.DebitNoteDbUpdateTasklet;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.writer.DebitNoteJobWriter;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class DebitnoteJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "debitNoteJob")
	public Job debitNoteJob(JobBuilderFactory jobBuilderFactory, DebitNoteJobListener debitNoteJobListener,
			DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter, DataSource dataSource,
			FileService fileService, Environment env) {

		Flow cmRoundingOffFlow = new FlowBuilder<SimpleFlow>("cmRoundingOffFlow")
				.start(cmRoundingOffStagingStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow paymentReversalFlow = new FlowBuilder<SimpleFlow>("paymentReversalFlow")
				.start(paymentReversalStagingStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow creditNoteFlow = new FlowBuilder<SimpleFlow>("creditNoteFlow")
				.start(creditNoteStagingStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow goodsReturnFlow = new FlowBuilder<SimpleFlow>("goodsReturnFlow")
				.start(goodsReturnStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow goodsReturnEncircleFlow = new FlowBuilder<SimpleFlow>("goodsReturnEncircleFlow")
				.start(goodsReturnEncircleStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow tcsCollectedFlow = new FlowBuilder<SimpleFlow>("tcsCollectedFlow")
				.start(tcsCollectedStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();
		Flow tcsReversalFlow = new FlowBuilder<SimpleFlow>("tcsReversalFlow")
				.start(tcsReversalStep(debitNoteJobReader, debitNoteJobWriter, dataSource)).build();

		Flow splitFlow = new FlowBuilder<SimpleFlow>("splitFlow").split(new SimpleAsyncTaskExecutor())
				.add(cmRoundingOffFlow, paymentReversalFlow, creditNoteFlow,goodsReturnFlow,goodsReturnEncircleFlow,tcsCollectedFlow,tcsReversalFlow).build();

		return jobBuilderFactory.get("debitNoteJob").incrementer(new RunIdIncrementer()).listener(debitNoteJobListener)
				.start(splitFlow).next(debitNoteFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(debitNoteUpdateTasklet())
				.next(debitNoteFileWritingStep(debitNoteJobReader, debitNoteJobWriter, env, fileService))
				.from(debitNoteFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();

	}

	@Bean
	public Step cmRoundingOffStagingStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("cmRoundingOffStagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.cmRoundingOffStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step paymentReversalStagingStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("paymentReversalStagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.paymentReversalStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step creditNoteStagingStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("creditNoteStagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.creditNoteStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step goodsReturnStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("goodsReturnStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.goodsReturnReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step goodsReturnEncircleStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("goodsReturnEncircleStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.goodsReturnEncircleReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step tcsCollectedStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("tcsCollectedStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.tcsCollectedReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step tcsReversalStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("tcsReversalStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.tcsReversalReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step debitNoteFileWritingStep(DebitNoteJobReader debitNoteJobReader, DebitNoteJobWriter debitNoteJobWriter,
			Environment env, FileService fileService) {
		return stepBuilderFactory.get("debitNoteFileWritingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.debitNoteFileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteFileWriter(FileIntegrationConstants.WILL_BE_INJECTED, fileService,
						env))
				.build();
	}

	@Bean
	public Step debitNoteFileCheckTasklet() {
		return stepBuilderFactory.get("debitNoteFileCheckTasklet").tasklet(getDebitNoteFileWritingCheckTasklet())
				.build();
	}

	@Bean
	public Step debitNoteUpdateTasklet() {
		return stepBuilderFactory.get("debitNoteUpdateTasklet").tasklet(getDebitNoteDbUpdateTasklet()).build();
	}

	@Bean
	public FileWritingCheckTasklet getDebitNoteFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.debit_note_stage where file_id = ?",
				"debitNoteTransactionId");
	}

	@Bean
	public DebitNoteDbUpdateTasklet getDebitNoteDbUpdateTasklet() {
		return new DebitNoteDbUpdateTasklet();
	}
}