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
import com.titan.poss.file.dto.StockInterfaceDto;
import com.titan.poss.file.jobs.listener.StockInterfaceJobListener;
import com.titan.poss.file.jobs.reader.StockInterfaceJobReader;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.tasklet.StockInterfaceDbUpdateTasklet;
import com.titan.poss.file.jobs.writer.StockInterfaceJobWriter;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StockJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "stockInterfaceJob")
	public Job stockInterfaceJob(JobBuilderFactory jobBuilderFactory,
			StockInterfaceJobListener stockInterfaceJobListener, StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource, FileService fileService,
			Environment env) {

		return jobBuilderFactory.get("stockInterfaceJob").incrementer(new RunIdIncrementer())
				.listener(stockInterfaceJobListener)
				.start(stnStockStagingStep(stockInterfaceJobReader, stockInterfaceJobWriter, dataSource))
				.next(otherStockStagingStep(stockInterfaceJobReader, stockInterfaceJobWriter, dataSource))
				.next(tepGepIssueStockStagingStep(stockInterfaceJobReader, stockInterfaceJobWriter, dataSource))
				.next(tepGepCancelStockStagingStep(stockInterfaceJobReader, stockInterfaceJobWriter, dataSource))
				.next(cutpieceTepStockStagingStep(stockInterfaceJobReader, stockInterfaceJobWriter, dataSource))
				.next(stockInterfaceFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(stockInterfaceUpdateTasklet())
				.next(stockInterfaceFileWritingStep(stockInterfaceJobReader, stockInterfaceJobWriter, env, fileService))
				.from(stockInterfaceFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end()
				.build();
	}

	@Bean
	public Step stnStockStagingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("stnStockStagingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.stnStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step otherStockStagingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("otherStockStagingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.otherStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step tepGepIssueStockStagingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("tepGepIssueStockStagingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.tepGepIssueStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step tepGepCancelStockStagingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("tepGepCancelStockStagingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.tepGepCancelStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step cutpieceTepStockStagingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("cutpieceTepStockStagingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.cutpieceTepStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step stockInterfaceFileWritingStep(StockInterfaceJobReader stockInterfaceJobReader,
			StockInterfaceJobWriter stockInterfaceJobWriter, Environment env, FileService fileService) {
		return stepBuilderFactory.get("stockInterfaceFileWritingStep").<StockInterfaceDto, StockInterfaceDto>chunk(500)
				.reader(stockInterfaceJobReader.stockInterfaceFileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(stockInterfaceJobWriter.stockInterfaceFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						fileService, env))
				.build();
	}
	
	
	@Bean
	public Step stockInterfaceFileCheckTasklet() {
		return stepBuilderFactory.get("stockInterfaceFileCheckTasklet")
				.tasklet(getStockInterfaceFileWritingCheckTasklet()).build();
	}
	
	@Bean
	public FileWritingCheckTasklet getStockInterfaceFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.stock_interface_stage where file_id = ?",
				"stockInterfaceTransactionId");
	}
	
	@Bean
	public Step stockInterfaceUpdateTasklet() {
		return stepBuilderFactory.get("stockInterfaceUpdateTasklet").tasklet(getStockInterfaceDbUpdateTasklet()).build();
	}
	
	@Bean
	public StockInterfaceDbUpdateTasklet getStockInterfaceDbUpdateTasklet() {
		return new StockInterfaceDbUpdateTasklet();
	}

}
