/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs;

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
import com.titan.poss.file.dto.FirMerFileDto;
import com.titan.poss.file.dto.FirMerStageDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.processor.FirMerStageProcessor;
import com.titan.poss.file.jobs.reader.FirMerJobReader;
import com.titan.poss.file.jobs.tasklet.FirMerIngestionTasklet;
import com.titan.poss.file.jobs.writer.FirMerJobWriter;
import com.titan.poss.file.jobs.writer.FirMerStageWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class FirMerFileJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Bean(name = "FIR_MER")
	public Job firMerJob(JobBuilderFactory jobBuilderFactory, FirMerJobReader firMerJobReader,
			FirMerJobWriter firMerJobWriter, Environment env) {

		return jobBuilderFactory.get("FIR_MER").incrementer(new RunIdIncrementer()).listener(getFirMerJobListener())
				.start(firMerStagingStep(firMerJobReader, firMerJobWriter, env)).next(firMerIngestionStep()).build();
	}

	@Bean
	public Step firMerStagingStep(FirMerJobReader firMerJobReader, FirMerJobWriter firMerJobWriter, Environment env) {
		return stepBuilderFactory.get("firMerStagingStep").<FirMerFileDto, FirMerStageDto>chunk(500)
				.reader(firMerJobReader.firMerFileReader(FileIntegrationConstants.WILL_BE_INJECTED,
						FileIntegrationConstants.WILL_BE_INJECTED, env))
				.processor(getFirMerStageProcessor()).writer(getFirMerStagingWriter()).build();
	}

	@Bean
	public Step firMerIngestionStep() {
		return stepBuilderFactory.get("firMerIngestionStep").tasklet(getFirMerIngestionTasklet()).build();
	}

	@Bean
	public FileUploadJobListener getFirMerJobListener() {
		return new FileUploadJobListener("FIR/MER", "DELETE from fir_mer_stage where file_id = '");
	}

	@Bean
	public FirMerStageProcessor getFirMerStageProcessor() {
		return new FirMerStageProcessor();
	}

	@Bean
	public FirMerIngestionTasklet getFirMerIngestionTasklet() {
		return new FirMerIngestionTasklet();
	}

	@Bean
	public FirMerStageWriter getFirMerStagingWriter() {
		return new FirMerStageWriter();
	}
}
