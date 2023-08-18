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
import com.titan.poss.file.dto.BoutiqueRevenueDto;
import com.titan.poss.file.jobs.listener.BoutiqueRevenueJobListener;
import com.titan.poss.file.jobs.reader.BoutiqueRevenueJobReader;
import com.titan.poss.file.jobs.tasklet.BoutiqueRevenueDbUpdateTasklet;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.writer.BoutiqueRevenueJobWriter;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class BoutiquerevenueJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "boutiqueRevenueJob")
	public Job boutiqueRevenueJob(JobBuilderFactory jobBuilderFactory,
			BoutiqueRevenueJobListener boutiqueRevenueJobListener, BoutiqueRevenueJobReader boutiqueRevenueJobReader,
			BoutiqueRevenueJobWriter boutiqueRevenueJobWriter, DataSource dataSource, FileService fileService,
			Environment env) {

		return jobBuilderFactory.get("boutiqueRevenueJob").incrementer(new RunIdIncrementer())
				.listener(boutiqueRevenueJobListener)
				.start(boutiqueRevenueStagingStep(boutiqueRevenueJobReader, boutiqueRevenueJobWriter, dataSource))
				.next(boutiqueRevenueEghsStagingStep(boutiqueRevenueJobReader, boutiqueRevenueJobWriter, dataSource))
				.next(boutiqueRevenueFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(boutiqueRevenueUpdateTasklet())
				.next(boutiqueRevenueFileWritingStep(boutiqueRevenueJobReader, boutiqueRevenueJobWriter, env,
						fileService))
				.from(boutiqueRevenueFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step boutiqueRevenueStagingStep(BoutiqueRevenueJobReader boutiqueRevenueJobReader,
			BoutiqueRevenueJobWriter boutiqueRevenueJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("boutiqueRevenueStagingStep").<BoutiqueRevenueDto, BoutiqueRevenueDto>chunk(500)
				.reader(boutiqueRevenueJobReader
						.boutiqueRevenueStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueRevenueJobWriter.boutiqueRevenueStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}
	
	@Bean
	public Step boutiqueRevenueEghsStagingStep(BoutiqueRevenueJobReader boutiqueRevenueJobReader,
			BoutiqueRevenueJobWriter boutiqueRevenueJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("boutiqueRevenueEghsStagingStep").<BoutiqueRevenueDto, BoutiqueRevenueDto>chunk(500)
				.reader(boutiqueRevenueJobReader
						.boutiqueRevenueEghsStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueRevenueJobWriter.boutiqueRevenueStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, dataSource))
				.build();
	}

	@Bean
	public Step boutiqueRevenueFileWritingStep(BoutiqueRevenueJobReader boutiqueRevenueJobReader,
			BoutiqueRevenueJobWriter boutiqueRevenueJobWriter, Environment env, FileService fileService) {
		return stepBuilderFactory.get("boutiqueRevenueFileWritingStep")
				.<BoutiqueRevenueDto, BoutiqueRevenueDto>chunk(500)
				.reader(boutiqueRevenueJobReader.boutiqueRevenueFileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(boutiqueRevenueJobWriter.boutiqueRevenueFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						fileService, env))
				.build();
	}

	@Bean
	public Step boutiqueRevenueFileCheckTasklet() {
		return stepBuilderFactory.get("boutiqueRevenueFileCheckTasklet")
				.tasklet(getBoutiqueRevenueFileWritingCheckTasklet()).build();
	}

	@Bean
	public Step boutiqueRevenueUpdateTasklet() {
		return stepBuilderFactory.get("boutiqueRevenueUpdateTasklet").tasklet(getBoutiqueRevenueDbUpdateTasklet())
				.build();
	}

	@Bean
	public FileWritingCheckTasklet getBoutiqueRevenueFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.boutique_revenue_stage where file_id = ?",
				"boutiqueRevenueTransactionId");
	}

	@Bean
	public BoutiqueRevenueDbUpdateTasklet getBoutiqueRevenueDbUpdateTasklet() {
		return new BoutiqueRevenueDbUpdateTasklet();
	}

}