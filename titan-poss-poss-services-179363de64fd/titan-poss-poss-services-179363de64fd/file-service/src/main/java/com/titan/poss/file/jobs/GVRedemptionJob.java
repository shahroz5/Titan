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
import com.titan.poss.file.dto.GvRedemptionDto;
import com.titan.poss.file.jobs.listener.GvRedemptionJobListener;
import com.titan.poss.file.jobs.reader.GvRedemptionJobReader;
import com.titan.poss.file.jobs.tasklet.FileWritingCheckTasklet;
import com.titan.poss.file.jobs.writer.GvRedemptionJobWriter;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GVRedemptionJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "gvRedemptionJob")
	public Job gvRedemptionJob(JobBuilderFactory jobBuilderFactory, GvRedemptionJobListener gvRedemptionJobListener,
			GvRedemptionJobReader gvRedemptionJobReader, GvRedemptionJobWriter gvRedemptionJobWriter,
			DataSource dataSource, FileService fileService, Environment env) {

		return jobBuilderFactory.get("gvRedemptionJob").incrementer(new RunIdIncrementer())
				.listener(gvRedemptionJobListener)
				.start(gvRedemptionStagingStep(gvRedemptionJobReader, gvRedemptionJobWriter, dataSource))
				.next(gvRedemptionFileCheckTasklet()).on(FileIntegrationConstants.COMPLETED)
				.to(gvRedemptionFileWritingStep(gvRedemptionJobReader, gvRedemptionJobWriter, env, fileService))
				.from(gvRedemptionFileCheckTasklet()).on(FileIntegrationConstants.STOPPED).end().end().build();
	}

	@Bean
	public Step gvRedemptionStagingStep(GvRedemptionJobReader gvRedemptionJobReader,
			GvRedemptionJobWriter gvRedemptionJobWriter, DataSource dataSource) {
		return stepBuilderFactory.get("gvRedemptionStagingStep").<GvRedemptionDto, GvRedemptionDto>chunk(500)
				.reader(gvRedemptionJobReader.gvRedemptionStagingReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(gvRedemptionJobWriter.gvRedemptionStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

	@Bean
	public Step gvRedemptionFileWritingStep(GvRedemptionJobReader gvRedemptionJobReader,
			GvRedemptionJobWriter gvRedemptionJobWriter, Environment env, FileService fileService) {
		return stepBuilderFactory.get("gvRedemptionFileWritingStep").<GvRedemptionDto, GvRedemptionDto>chunk(500)
				.reader(gvRedemptionJobReader.gvRedemptionFileReader(FileIntegrationConstants.WILL_BE_INJECTED))
				.writer(gvRedemptionJobWriter.gvRedemptionFileWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						fileService, env))
				.build();
	}

	@Bean
	public Step gvRedemptionFileCheckTasklet() {
		return stepBuilderFactory.get("gvRedemptionFileCheckTasklet").tasklet(getGvRedemptionFileWritingCheckTasklet())
				.build();
	}

	@Bean
	public FileWritingCheckTasklet getGvRedemptionFileWritingCheckTasklet() {
		return new FileWritingCheckTasklet("Select count(*) from [file].dbo.gv_redemption_stage where file_id = ?",
				"gvRedemptionTransactionId");
	}
}
