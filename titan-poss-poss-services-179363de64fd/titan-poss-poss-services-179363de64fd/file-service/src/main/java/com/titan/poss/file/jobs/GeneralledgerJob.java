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
import com.titan.poss.file.dto.GeneralLedgerDto;
import com.titan.poss.file.jobs.listener.GeneralLedgerJobListener;
import com.titan.poss.file.jobs.reader.GeneralLedgerJobReader;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.tasklet.GeneralLedgerDbUpdateTasklet;
import com.titan.poss.file.jobs.writer.GeneralLedgerJobWriter;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GeneralledgerJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "generalLedgerJob")
	public Job generalLedgerJob(JobBuilderFactory jobBuilderFactory, GeneralLedgerJobListener generalLedgerJobListener,
			GeneralLedgerJobReader generalLedgerJobReader, GeneralLedgerJobWriter generalLedgerJobWriter,
			DataSource dataSource, FileService fileService, Environment env) {

		return jobBuilderFactory.get("generalLedgerJob").incrementer(new RunIdIncrementer())
				.listener(generalLedgerJobListener)
				.start(generalLedgerBankingCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerBankingDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter, dataSource))
				.next(generalLedgerAdvanceReceivedDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerAdvanceReceievedCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceieveDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceieveIbtDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceieveIbtCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceieveCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerGepCancelledDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerGepCancelledCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepCancelledDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepCancelledCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteCancelCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteCancelDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteROCancelCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteROCancelDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCashRefundTepDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCashRefundTepCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerRORefundTepDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerRORefundTepCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepRefundCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepRefundCashDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepRefundRODebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerDigiGoldCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerDigiGoldDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerResidualRefundCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerResidualRefundDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCnCancelDeductionAmtCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerAdvCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerBcCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerGepCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerGhsCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerGrnCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerTepCnCancelDeductionDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteIbtCancelCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteIbtCancelDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerQcgcGiftCardCreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerQcgcGiftCardDebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceiveL3DebitStagingStep(generalLedgerJobReader, generalLedgerJobWriter,
						dataSource))
				.next(generalLedgerCreditNoteReceiveL3CreditStagingStep(generalLedgerJobReader, generalLedgerJobWriter, dataSource))
				.next(generalLedgerFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(generalLedgerUpdateTasklet())
				.next(generalLedgerFileWritingStep(generalLedgerJobReader, generalLedgerJobWriter, env, fileService))
				.from(generalLedgerFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step generalLedgerBankingCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerBankingCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerBankingCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerBankingDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerBankingDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerBankingDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerAdvanceReceivedDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerAdvanceReceivedDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.advanceReceivedDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerAdvanceReceievedCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerAdvanceReceievedCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.advanceReceivedCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerCreditNoteReceieveDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceieveDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	
	@Bean
	public Step generalLedgerCreditNoteReceieveIbtCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceieveIbtCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveIbtCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerCreditNoteReceieveIbtDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceieveIbtDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveIbtDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerCreditNoteReceieveCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceieveCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerGepCancelledDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerGepCancelledDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerGepCancelledDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerGepCancelledCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerGepCancelledCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerGepCancelledCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerTepCancelledDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepCancelledDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepCancelledDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerTepCancelledCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepCancelledCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepCancelledCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	} 
	
	@Bean
	public Step generalLedgerCreditNoteCancelCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteCancelCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteCancelCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerCreditNoteCancelDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteCancelDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteCancelDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED,FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	
	@Bean //CreditNoteROCancel credit
	public Step generalLedgerCreditNoteROCancelCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteROCancelCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteROCancelCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean  //CreditNoteROCancel debit
	public Step generalLedgerCreditNoteROCancelDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteROCancelDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteROCancelDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED,FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean // Cash Refund TEP Debit
	public Step generalLedgerCashRefundTepDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCashRefundTepDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCashRefundTepDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean // Cash Refund TEP Credit
	public Step generalLedgerCashRefundTepCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCashRefundTepCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCashRefundTepCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	
	@Bean // RO Refund TEP Debit
	public Step generalLedgerRORefundTepDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerRORefundTepDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerRORefundTepDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean // RO Refund TEP Credit
	public Step generalLedgerRORefundTepCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerRORefundTepCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerRORefundTepCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean //tep cash, ro refund
	public Step generalLedgerTepRefundCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepRefundCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepRefundCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean//tep cash refund debit
	public Step generalLedgerTepRefundCashDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepRefundCashDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepRefundCashDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED,FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean//tep ro refund debit
	public Step generalLedgerTepRefundRODebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepRefundRODebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepRefundRODebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED,FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean //DigiGold Credit
	public Step generalLedgerDigiGoldCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerDigiGoldCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerDigiGoldCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean //DigiGold Debit
	public Step generalLedgerDigiGoldDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerDigiGoldDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerDigiGoldDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	@Bean //ResidualRefund
	public Step generalLedgerResidualRefundCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerResidualRefundCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerResidualRefundCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean //Residual Refund Debit
	public Step generalLedgerResidualRefundDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerResidualRefundDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerResidualRefundDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	
	@Bean //generalLedgerCnCancelDeductionAmtCreditStagingStep
	public Step generalLedgerCnCancelDeductionAmtCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCnCancelDeductionAmtCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCnCancelDeductionAmtCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//ADV Deduction Amt
	@Bean 
	public Step generalLedgerAdvCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerAdvCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerAdvCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//BC Deduction Amt
	@Bean 
	public Step generalLedgerBcCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerBcCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerBcCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//GEP- Deduction Amt
	@Bean 
	public Step generalLedgerGepCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerGepCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerGepCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//GHS Deduction Amt
	@Bean 
	public Step generalLedgerGhsCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerGhsCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerGhsCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//GRN Deduction Amt
	@Bean 
	public Step generalLedgerGrnCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerGrnCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerGrnCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//TEP Deduction Amt
	@Bean 
	public Step generalLedgerTepCnCancelDeductionDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerTepCnCancelDeductionDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerTepCnCancelDeductionDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//CreditNoteIbtCancelCredit
	@Bean
	public Step generalLedgerCreditNoteIbtCancelCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteIbtCancelCreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteIbtCancelCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	//CreditNoteIbtCancelDebit
	@Bean
	public Step generalLedgerCreditNoteIbtCancelDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteIbtCancelDebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteIbtCancelDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED,FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}
	
	//QcgcGiftCard Credit
		@Bean
		public Step generalLedgerQcgcGiftCardCreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
				GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
			return stepBuilderFactory.get("generalLedgerQcgcGiftCardCreditStagingStep")
					.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
					.reader(generalLedgerJobReader
							.generalLedgerQcgcGiftCardCreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
					.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
							FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
							dataSource))
					.build();
		}
		//QcgcGiftCard Debit
		@Bean
		public Step generalLedgerQcgcGiftCardDebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
				GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
			return stepBuilderFactory.get("generalLedgerQcgcGiftCardDebitStagingStep")
					.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
					.reader(generalLedgerJobReader
							.generalLedgerQcgcGiftCardDebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
					.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
							FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
							dataSource))
					.build();
		}
	
	

	@Bean
	public Step generalLedgerCreditNoteReceiveL3DebitStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceiveL3DebitStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveL3DebitStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerCreditNoteReceiveL3CreditStagingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("generalLedgerCreditNoteReceiveL3CreditStagingStep")
				.<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader
						.generalLedgerCreditNoteReceiveL3CreditStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step generalLedgerFileWritingStep(GeneralLedgerJobReader generalLedgerJobReader,
			GeneralLedgerJobWriter generalLedgerJobWriter, Environment env, FileService fileService) {
		return stepBuilderFactory.get("generalLedgerFileWritingStep").<GeneralLedgerDto, GeneralLedgerDto>chunk(500)
				.reader(generalLedgerJobReader.generalLedgerFileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(generalLedgerJobWriter.generalLedgerFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						fileService, env))
				.build();
	}

	@Bean
	public Step generalLedgerFileCheckTasklet() {
		return stepBuilderFactory.get("generalLedgerFileCheckTasklet")
				.tasklet(getGeneralLedgerFileWritingCheckTasklet()).build();
	}

	@Bean
	public Step generalLedgerUpdateTasklet() {
		return stepBuilderFactory.get("generalLedgerUpdateTasklet").tasklet(getGeneralLedgerDbUpdateTasklet()).build();
	}

	@Bean
	public FileWritingCheckTasklet getGeneralLedgerFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.general_ledger_stage where file_id = ?",
				"generalLedgerTransactionId");
	}

	@Bean
	public GeneralLedgerDbUpdateTasklet getGeneralLedgerDbUpdateTasklet() {
		return new GeneralLedgerDbUpdateTasklet();
	}

}