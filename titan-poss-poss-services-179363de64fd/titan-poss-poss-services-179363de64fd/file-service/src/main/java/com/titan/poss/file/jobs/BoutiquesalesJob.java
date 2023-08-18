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
import com.titan.poss.file.dto.BoutiqueSalesDto;
import com.titan.poss.file.jobs.listener.BoutiqueSalesJobListener;
import com.titan.poss.file.jobs.reader.BoutiqueSalesJobReader;
import com.titan.poss.file.jobs.tasklet.BoutiqueSalesDbUpdateTasklet;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.writer.BoutiqueSalesJobWriter;
import com.titan.poss.file.jobs.writer.BoutiqueSalesStagingWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class BoutiquesalesJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "boutiqueSalesJob")
	public Job gvRedemptionJob(JobBuilderFactory jobBuilderFactory, BoutiqueSalesJobListener boutiqueSalesJobListener,
			BoutiqueSalesJobReader boutiqueSalesJobReader, BoutiqueSalesJobWriter boutiqueSalesJobWriter,
			DataSource dataSource, Environment env) {

		return jobBuilderFactory.get("boutiqueSalesJob").incrementer(new RunIdIncrementer())
				.listener(boutiqueSalesJobListener)
				.start(boutiqueSalesCmStagingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, dataSource))
				.next(boutiqueSalesBcStagingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, dataSource))
				.next(boutiqueSalesGrnStagingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, dataSource))
				.next(boutiqueSalesFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(boutiqueSalesUpdateTasklet())
				.next(boutiqueSalesHdrFileWritingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, env))
				.next(boutiqueSalesDetFileWritingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, env))
				.next(boutiqueSalesTaxFileWritingStep(boutiqueSalesJobReader, boutiqueSalesJobWriter, env))
				.from(boutiqueSalesFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step boutiqueSalesCmStagingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("boutiqueSalesCmStagingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesCmStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(getBoutiqueSalesStagingWriter()).build();
	}

	@Bean
	public Step boutiqueSalesBcStagingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("boutiqueSalesBcStagingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesBcStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(getBoutiqueSalesStagingWriter()).build();
	}

	@Bean
	public Step boutiqueSalesGrnStagingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("boutiqueSalesGrnStagingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesGrnStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(getBoutiqueSalesStagingWriter()).build();
	}

	@Bean
	public Step boutiqueSalesHdrFileWritingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, Environment env) {
		return stepBuilderFactory.get("boutiqueSalesHdrFileWritingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesFileHdrReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueSalesJobWriter.boutiqueSalesFileHdrWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.build();
	}

	@Bean
	public Step boutiqueSalesDetFileWritingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, Environment env) {
		return stepBuilderFactory.get("boutiqueSalesDetFileWritingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesFileDetReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueSalesJobWriter.boutiqueSalesFileDetWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.build();
	}

	@Bean
	public Step boutiqueSalesTaxFileWritingStep(BoutiqueSalesJobReader boutiqueSalesJobReader,
			BoutiqueSalesJobWriter boutiqueSalesJobWriter, Environment env) {
		return stepBuilderFactory.get("boutiqueSalesTaxFileWritingStep").<BoutiqueSalesDto, BoutiqueSalesDto>chunk(500)
				.reader(boutiqueSalesJobReader.boutiqueSalesFileTaxReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueSalesJobWriter.boutiqueSalesFileTaxWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.build();
	}

	@Bean
	public BoutiqueSalesStagingWriter getBoutiqueSalesStagingWriter() {
		return new BoutiqueSalesStagingWriter();
	}

	@Bean
	public Step boutiqueSalesFileCheckTasklet() {
		return stepBuilderFactory.get("boutiqueSalesFileCheckTasklet")
				.tasklet(getBoutiqueSalesFileWritingCheckTasklet()).build();
	}

	@Bean
	public FileWritingCheckTasklet getBoutiqueSalesFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.boutique_sales_hdr_stage where file_id =?",
				"boutiqueSalesTransactionId");
	}

	@Bean
	public Step boutiqueSalesUpdateTasklet() {
		return stepBuilderFactory.get("boutiqueSalesUpdateTasklet").tasklet(getBoutiqueSalesUpdateTasklet()).build();
	}

	@Bean
	public BoutiqueSalesDbUpdateTasklet getBoutiqueSalesUpdateTasklet() {
		return new BoutiqueSalesDbUpdateTasklet();
	}
}
