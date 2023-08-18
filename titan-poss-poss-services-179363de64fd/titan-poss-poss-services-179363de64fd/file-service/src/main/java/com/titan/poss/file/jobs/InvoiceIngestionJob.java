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
import org.springframework.core.env.Environment;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dto.InvoiceFileStageDto;
import com.titan.poss.file.dto.InvoiceStageDto;
import com.titan.poss.file.jobs.listener.StnAndInvoiceJobListener;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.file.jobs.processor.InvoiceStageProcessor;
import com.titan.poss.file.jobs.reader.InvoiceJobReader;
import com.titan.poss.file.jobs.tasklet.InvoiceDeciderTasklet;
import com.titan.poss.file.jobs.tasklet.InvoiceIngestionTasklet;
import com.titan.poss.file.jobs.writer.InvoiceStagingWriter;
import com.titan.poss.file.jobs.writer.StnAndInvoiceLotMaterialDetailsDataSyncWriter;
import com.titan.poss.file.jobs.writer.StnAndInvoiceLotStoneDetailsDataSyncWriter;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class InvoiceIngestionJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private InvoiceJobReader invoiceJobReader;

	private static final String INVOICE_JOB_SOURCE_FILE_PATH = "invoice.file.source.path";

	private static final String INVOICE_JOB_SUCCESS_PATH = "invoice.file.success.path";

	private static final String INVOICE_JOB_FAILURE_PATH = "invoice.file.failure.path";

	@Bean(name = "invoiceJob")
	public Job stnJob(JobBuilderFactory jobBuilderFactory, Environment env,
			StnAndInvoiceLotStoneDetailsDataSyncWriter stnAndInvoiceLotStoneDetailsDataSyncWriter,
			StnAndInvoiceLotMaterialDetailsDataSyncWriter stnAndInvoiceLotMaterialDetailsDataSyncWriter,
			LotStoneDetailsMapper lotStoneDetailsMapper, LotMaterialDetailsMapper lotMaterialDetailsMapper) {

		Flow invoiceStagingFlow = new FlowBuilder<SimpleFlow>("invoiceStagingFlow").start(invoiceStagingStep(env))
				.build();
		Flow invoiceDeciderFlow = new FlowBuilder<SimpleFlow>("invoiceDeciderFlow").start(invoiceDeciderStep())
				.on("COMPLETED").to(invoiceIngestionStep())
				.next(invoiceLotStoneDetailsDataSyncStep(lotStoneDetailsMapper,
						stnAndInvoiceLotStoneDetailsDataSyncWriter))
				.next(invoiceLotMaterialDetailsDataSyncStep(lotMaterialDetailsMapper,
						stnAndInvoiceLotMaterialDetailsDataSyncWriter))
				.from(invoiceDeciderStep()).on("STOPPED").end().build();

		return jobBuilderFactory.get("invoiceJob").incrementer(new RunIdIncrementer()).listener(getInvoiceJobListener())
				.start(invoiceStagingFlow).next(invoiceDeciderFlow).end().build();
	}

	@SuppressWarnings("unchecked")
	@Bean
	public Step invoiceStagingStep(Environment env) {
		return stepBuilderFactory.get("invoiceStagingStep")
				.<InvoiceFileStageDto, InvoiceStageDto>chunk(Integer.MAX_VALUE)
				.reader(invoiceJobReader.invoiceFileReader(FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(getInvStageProcessor()).writer(getInvoiceStagingWriter()).build();
	}

	@Bean
	public Step invoiceIngestionStep() {
		return stepBuilderFactory.get("invoiceIngestionStep").tasklet(getInvoiceIngestionTasklet()).build();
	}

	@Bean
	public Step invoiceDeciderStep() {
		return stepBuilderFactory.get("invoiceDeciderStep").tasklet(getInvoiceDeciderTasklet()).build();
	}

	@Bean
	public InvoiceDeciderTasklet getInvoiceDeciderTasklet() {
		return new InvoiceDeciderTasklet();
	}

	@Bean
	public InvoiceIngestionTasklet getInvoiceIngestionTasklet() {
		return new InvoiceIngestionTasklet();
	}

	@Bean
	public InvoiceStageProcessor getInvStageProcessor() {
		return new InvoiceStageProcessor();
	}

	@Bean
	public InvoiceStagingWriter getInvoiceStagingWriter() {
		return new InvoiceStagingWriter();
	}

	@Bean
	public StnAndInvoiceJobListener getInvoiceJobListener() {
		return new StnAndInvoiceJobListener(INVOICE_JOB_SOURCE_FILE_PATH, INVOICE_JOB_SUCCESS_PATH,
				INVOICE_JOB_FAILURE_PATH, "Invoice", JobFileNameEnum.INVOICE_FILE_NAME.getValue(),
				"invoiceFileAuditId");
	}

	@Bean
	public Step invoiceLotStoneDetailsDataSyncStep(LotStoneDetailsMapper lotStoneDetailsMapper,
			StnAndInvoiceLotStoneDetailsDataSyncWriter stnAndInvoiceLotStoneDetailsDataSyncWriter) {
		return stepBuilderFactory.get("invoiceLotStoneDetailsDataSyncStep").<LotDetailsDao, LotDetailsDao>chunk(100)
				.reader(invoiceJobReader.invoiceLotStoneDetailsDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						lotStoneDetailsMapper))
				.writer(stnAndInvoiceLotStoneDetailsDataSyncWriter).build();
	}

	@Bean
	public Step invoiceLotMaterialDetailsDataSyncStep(LotMaterialDetailsMapper lotMaterialDetailsMapper,
			StnAndInvoiceLotMaterialDetailsDataSyncWriter stnAndInvoiceLotMaterialDetailsDataSyncWriter) {
		return stepBuilderFactory.get("invoiceLotMaterialDetailsDataSyncStep")
				.<LotMaterialDetailsDao, LotMaterialDetailsDao>chunk(100)
				.reader(invoiceJobReader.invoiceLotMaterialsDataSyncReader(FileIntegrationConstants.WILL_BE_INJECTED,
						lotMaterialDetailsMapper))
				.writer(stnAndInvoiceLotMaterialDetailsDataSyncWriter).build();
	}

}
