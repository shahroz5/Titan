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

import com.titan.poss.file.dto.PricingLogicTestDto;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.processor.PricingLogicTestStageProcessor;
import com.titan.poss.file.jobs.reader.PricingLogicTestJobReader;
import com.titan.poss.file.jobs.writer.PricingLogicTestJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class PricingLogicTestJob {

	@Autowired
	private StepBuilderFactory stepBuilderFactory;

	@Autowired
	private PricingLogicTestJobReader pricingLogicTestJobReader;

	@Autowired
	private PricingLogicTestJobWriter pricingLogicTestJobWriter;

	private static final String WILL_BE_INJECTED = null;

	@Bean(name = "PRICE_LOGIC_TEST")
	public Job pricingLogicTest(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource,
			PricingLogicTestStageProcessor priceLogicTestStageProcessor) {

		return jobBuilderFactory.get("PRICE_LOGIC_TEST").incrementer(new RunIdIncrementer())
				.listener(getPricingLogicTestJobListener())
				.start(pricingLogicStagingStep(env, priceLogicTestStageProcessor, dataSource))
				.next(pricingLogicFileWritingStep(env, dataSource)).build();
	}

	@Bean
	public Step pricingLogicStagingStep(Environment env, PricingLogicTestStageProcessor priceLogicTestStageProcessor,
			DataSource dataSource) {
		return stepBuilderFactory.get("pricingLogicStagingStep").<PricingLogicTestDto, PricingLogicTestDto>chunk(100)
				.reader(pricingLogicTestJobReader.pricingLogicTestFileReader(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.processor(priceLogicTestStageProcessor)
				.writer(pricingLogicTestJobWriter.priceLogicStagingWriter(WILL_BE_INJECTED, dataSource)).build();
	}

	@Bean
	public Step pricingLogicFileWritingStep(Environment env, DataSource dataSource) {
		return stepBuilderFactory.get("pricingLogicFileWritingStep")
				.<PricingLogicTestDto, PricingLogicTestDto>chunk(100)
				.reader(pricingLogicTestJobReader.pricingLogicStageReader(WILL_BE_INJECTED, dataSource))
				.writer(pricingLogicTestJobWriter.priceLogicFileWriter(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.build();
	}

	@Bean
	public FileUploadJobListener getPricingLogicTestJobListener() {
		return new FileUploadJobListener("Pricing Logic Test",
				"DELETE from [file].dbo.price_logic_test_stage where file_id = '");
	}
}
