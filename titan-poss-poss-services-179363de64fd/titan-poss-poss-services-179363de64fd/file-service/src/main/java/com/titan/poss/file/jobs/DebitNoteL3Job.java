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
import com.titan.poss.file.jobs.listener.DebitNoteL3JobListener;
import com.titan.poss.file.jobs.reader.DebitNoteL3JobReader;
import com.titan.poss.file.jobs.tasklet.DebitNoteL3DbUpdateTasklet;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.writer.DebitNoteL3JobWriter;
import com.titan.poss.file.service.FileService;

@Configuration
public class DebitNoteL3Job {
	
	@Autowired
	private StepBuilderFactory stepBuilderFactory;
	
	@Bean(name = "debitNoteLthreeJob")
	public Job debitNoteL3Job(JobBuilderFactory jobBuilderFactory, DebitNoteL3JobListener debitNoteL3JobListener,
			DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter, DataSource dataSource,
			FileService fileService, Environment env) {
//		Flow giftVoucherSaleL3DebitNoteFlow = new FlowBuilder<SimpleFlow>("giftVoucherSaleL3DebitNoteFlow")
//				.start(giftVoucherSaleL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow giftVoucherRedeemL3DebitNoteFLow = new FlowBuilder<SimpleFlow>("giftVoucherRedeemL3DebitNoteFLow")
				.start(giftVoucherRedeemL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow giftCardQcgcSaleL3DebitNoteFlow = new FlowBuilder<SimpleFlow>("giftCardQcgcSaleL3DebitNoteFlow")
				.start(giftCardQcgcSaleL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow giftCardQcgcRedeemL3DebitNoteFlow = new FlowBuilder<SimpleFlow>("giftCardQcgcRedeemL3DebitNoteFlow")
				.start(giftCardQcgcRedeemL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow creditNoteTransferL3DebitNoteFlow = new FlowBuilder<SimpleFlow>("creditNoteTransferL3DebitNoteFlow")
				.start(creditNoteTransferL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow creditNoteL3ReceiptDebitNoteFlow = new FlowBuilder<SimpleFlow>("creditNoteL3ReceiptDebitNoteFlow")
				.start(creditNoteReceiptL3StagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();
		Flow digiGoldFlow = new FlowBuilder<SimpleFlow>("digiGoldFlow")
				.start(digiGoldStagingStep(debitNoteL3JobReader, debitNoteL3JobWriter, dataSource)).build();

		Flow splitFlow = new FlowBuilder<SimpleFlow>("splitFlow").split(new SimpleAsyncTaskExecutor())
				.add(giftVoucherRedeemL3DebitNoteFLow, giftCardQcgcSaleL3DebitNoteFlow, //giftVoucherSaleL3DebitNoteFlow,
						giftCardQcgcRedeemL3DebitNoteFlow,creditNoteTransferL3DebitNoteFlow, creditNoteL3ReceiptDebitNoteFlow,digiGoldFlow).build();
		return jobBuilderFactory.get("debitNoteL3Job").incrementer(new RunIdIncrementer())
				.listener(debitNoteL3JobListener)
				.start(splitFlow).next(debitNoteL3FileCheckTasklet())
				.on(FileIntegrationConstants.COMPLETED)
				.to(debitNoteL3UpdateTasklet())
				.next(debitNoteL3FileWritingStep(debitNoteL3JobReader, debitNoteL3JobWriter, env, fileService))
				.from(debitNoteL3FileCheckTasklet())
				.on(FileIntegrationConstants.STOPPED).end().end().build();

	}
		
//	@Bean
//	public Step giftVoucherSaleL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
//			DataSource dataSource) {
//		return stepBuilderFactory.get("giftVoucherSaleL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
//				.reader(debitNoteL3JobReader.giftVoucherSaleL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
//				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
//						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
//				.build();
//	}
	@Bean
	public Step giftVoucherRedeemL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("giftVoucherRedeemL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.giftVoucherRedeemL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step giftCardQcgcSaleL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("giftCardQcgcSaleL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.giftCardQcgcSaleL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step  giftCardQcgcRedeemL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("giftCardQcgcRedeemL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.giftCardQcgcRedeemL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step creditNoteTransferL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("creditNoteTransferL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.creditNoteTransferL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step creditNoteReceiptL3StagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("creditNoteReceiptL3StagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.creditNoteReceiptL3StagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step digiGoldStagingStep(DebitNoteL3JobReader debitNoteL3JobReader, DebitNoteL3JobWriter debitNoteL3JobWriter,
			DataSource dataSource) {
		return stepBuilderFactory.get("digiGoldStagingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteL3JobReader.digiGoldStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteL3JobWriter.debitNoteL3StagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
		
	}
	
	@Bean
	public FileWritingCheckTasklet getDebitNoteL3FileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.debitnote_level_three_stage where file_id = ?",
				"debitNoteL3TransactionId");
	}
	
	@Bean
	public DebitNoteL3DbUpdateTasklet getDebitNoteL3DbUpdateTasklet() {
		return new DebitNoteL3DbUpdateTasklet();
	}
	
	@Bean
	public Step debitNoteL3FileCheckTasklet() {
		return stepBuilderFactory.get("debitNoteL3FileCheckTasklet").tasklet(getDebitNoteL3FileWritingCheckTasklet())
				.build();
	}
	
	@Bean
	public Step debitNoteL3UpdateTasklet() {
		return stepBuilderFactory.get("debitNoteL3UpdateTasklet").tasklet(getDebitNoteL3DbUpdateTasklet()).build();
	}
	
	@Bean
	public Step debitNoteL3FileWritingStep(DebitNoteL3JobReader debitNoteJobReader, DebitNoteL3JobWriter debitNoteJobWriter,
			Environment env, FileService fileService) {
		return stepBuilderFactory.get("debitNoteFileWritingStep").<DebitNoteDto, DebitNoteDto>chunk(500)
				.reader(debitNoteJobReader.debitNoteL3FileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(debitNoteJobWriter.debitNoteL3FileWriter(FileIntegrationConstants.WILL_BE_INJECTED, fileService,
						env))
				.build();
	}
}
