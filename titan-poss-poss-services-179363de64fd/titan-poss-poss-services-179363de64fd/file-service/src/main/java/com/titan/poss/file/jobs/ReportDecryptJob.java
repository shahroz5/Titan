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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.CustomerDecryptDto;
import com.titan.poss.file.jobs.listener.ReportDecryptJobListener;
import com.titan.poss.file.jobs.reader.ReportDecryptJobReader;
import com.titan.poss.file.jobs.writer.ReportDecryptJobWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ReportDecryptJob {

	@Bean(name = "reportDecryptorJob")
	public Job reportDecryptorJob(JobBuilderFactory jobBuilderFactory,
			ReportDecryptJobListener reportDecryptJobListener, ReportDecryptJobReader reportDecryptJobReader,
			ReportDecryptJobWriter reportDecryptJobWriter, @Qualifier("reportDataSource") DataSource dataSource,
			StepBuilderFactory stepBuilderFactory) {

		return jobBuilderFactory.get("reportDecryptorJob").incrementer(new RunIdIncrementer())
				.listener(reportDecryptJobListener).start(reportDecryptingStep(reportDecryptJobReader,
						reportDecryptJobWriter, dataSource, stepBuilderFactory))
				.build();
	}

	@Bean
	public Step reportDecryptingStep(ReportDecryptJobReader reportDecryptJobReader,
			ReportDecryptJobWriter reportDecryptJobWriter, @Qualifier("reportDataSource") DataSource dataSource,
			StepBuilderFactory stepBuilderFactory) {
		return stepBuilderFactory.get("reportDecryptingStep").<CustomerDecryptDto, CustomerDecryptDto>chunk(500)
				.reader(reportDecryptJobReader.customerDecryptReader(FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.writer(reportDecryptJobWriter.decrpytCustomerJobWriter(FileIntegrationConstants.WILL_BE_INJECTED,
						dataSource))
				.build();
	}

}
