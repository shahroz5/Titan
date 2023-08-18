/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.jobs;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.titan.poss.file.dto.EmployeeLoanConfigReaderDto;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;
import com.titan.poss.file.jobs.listener.EmployeeLoanConfigFailureListener;
import com.titan.poss.file.jobs.listener.FileUploadJobListener;
import com.titan.poss.file.jobs.processor.EmployeeLoanConfigIngestionProcessor;
import com.titan.poss.file.jobs.processor.EmployeeLoanConfigStagingProcessor;
import com.titan.poss.file.jobs.reader.EmployeeLoanConfigJobReader;
import com.titan.poss.file.jobs.writer.EmployeeLoanConfigIngestionWriter;
import com.titan.poss.file.jobs.writer.EmployeeLoanConfigStagingWriter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class EmployeeLoanConfigJob {
	
	@Autowired
	private StepBuilderFactory stepBuilderFactory;
	
	@Autowired
	private EmployeeLoanConfigJobReader employeeJobReader;
	
	private static final String WILL_BE_INJECTED = null;
	
	@Bean(name = "EMPLOYEE_LOAN_CONFIG")
	public Job employeeLoanJob(JobBuilderFactory jobBuilderFactory, Environment env, DataSource dataSource) {

		return jobBuilderFactory.get("EMPLOYEE_LOAN_CONFIG").incrementer(new RunIdIncrementer())
				.listener(getEmployeeLoanConfigJobListener())
				.start(employeeLoanConfigStagingStep(getEmployeeLoanConfigStagingProcessor(),getEmployeeLoanConfigFailureListener(),env))
				.next(employeeLoanConfigIngestionStep(getEmployeeLoanConfigIngestionProcessor(), getEmployeeLoanConfigFailureListener(),
						dataSource,getEmployeeLoanConfigIngestionWriter()))
//				.next(payerBankDataSyncStep(payerBankMapper, dataSource))
				.build();
	}

	@Bean
	public EmployeeLoanConfigFailureListener getEmployeeLoanConfigFailureListener() {
		return new EmployeeLoanConfigFailureListener();
	}
	
	@Bean
	public Step employeeLoanConfigIngestionStep(EmployeeLoanConfigIngestionProcessor employeeLoanProcessor,
			EmployeeLoanConfigFailureListener employeeLoanConfigFailureListener, DataSource dataSource,
			EmployeeLoanConfigIngestionWriter employeeLoanConfigIngestionWriter) {
		return stepBuilderFactory.get("employeeLoanConfigIngestionStep").<EmployeeLoanConfigWriterDto, EmployeeLoanConfigWriterDto>chunk(500)
				.reader(employeeJobReader.ingestionReader(WILL_BE_INJECTED,
						dataSource))
				.processor(employeeLoanProcessor)
				.writer(employeeLoanConfigIngestionWriter).build();
	}

	@Bean
	public Step employeeLoanConfigStagingStep(EmployeeLoanConfigStagingProcessor employeeLoanConfigStagingProcessor, EmployeeLoanConfigFailureListener employeeLoanConfigFailureListener, Environment env) {
		return stepBuilderFactory.get("employeeLoanConfigStagingStep").<EmployeeLoanConfigReaderDto, EmployeeLoanConfigWriterDto>chunk(500)
				.reader(employeeJobReader.employeeLoanConfigFileReader(WILL_BE_INJECTED, WILL_BE_INJECTED, env))
				.processor(employeeLoanConfigStagingProcessor)
				.writer(getEmployeeLoanConfigStagingWriter()).faultTolerant()
				.skipLimit(Integer.MAX_VALUE).skip(Exception.class).listener(employeeLoanConfigFailureListener).build();
	}

	@Bean
	public EmployeeLoanConfigIngestionProcessor getEmployeeLoanConfigIngestionProcessor() {
		return new EmployeeLoanConfigIngestionProcessor();
	}

	@Bean
	public  EmployeeLoanConfigStagingWriter getEmployeeLoanConfigStagingWriter() {
		return new EmployeeLoanConfigStagingWriter();
	}

	@Bean
	public  EmployeeLoanConfigIngestionWriter getEmployeeLoanConfigIngestionWriter() {
		return new EmployeeLoanConfigIngestionWriter();
	}
	
	@Bean
	public EmployeeLoanConfigStagingProcessor getEmployeeLoanConfigStagingProcessor() {
		return new EmployeeLoanConfigStagingProcessor();
	}

	@Bean
	public JobExecutionListener getEmployeeLoanConfigJobListener() {
		return new FileUploadJobListener("Employee loan config", "DELETE from employee_loan_stage where file_audit_id = '");
	}

}
