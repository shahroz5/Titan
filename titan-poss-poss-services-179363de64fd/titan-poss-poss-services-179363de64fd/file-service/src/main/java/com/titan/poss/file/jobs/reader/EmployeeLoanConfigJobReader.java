/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.LineTokenizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.EmployeeLoanConfigReaderDto;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class EmployeeLoanConfigJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<EmployeeLoanConfigReaderDto> employeeLoanConfigFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<EmployeeLoanConfigReaderDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<EmployeeLoanConfigReaderDto> employeeLoanLineMapper = createItemMasterLineMapper();
		reader.setLineMapper(employeeLoanLineMapper);

		return reader;
	}
	
	private LineMapper<EmployeeLoanConfigReaderDto> createItemMasterLineMapper() {
		DefaultLineMapper<EmployeeLoanConfigReaderDto> itemMapper = new DefaultLineMapper<>();

		LineTokenizer itemMasterLineTokenizer = createItemMasterLineTokenizer();
		itemMapper.setLineTokenizer(itemMasterLineTokenizer);

		FieldSetMapper<EmployeeLoanConfigReaderDto> itemMasterMapper = createItemMasterMapper();
		itemMapper.setFieldSetMapper(itemMasterMapper);

		return itemMapper;
	}
	
	private LineTokenizer createItemMasterLineTokenizer() {
		DelimitedLineTokenizer itemMasterLineTokenizer = new DelimitedLineTokenizer();
		itemMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		itemMasterLineTokenizer.setNames("id", "employeeName", "employeeCode", "mobileNo", "amountEligibility",
				"approvalDate","validaityDate","productGrpCodes","locationCodes","margin","otpRequired","redeemability");
		return itemMasterLineTokenizer;
	}

	private FieldSetMapper<EmployeeLoanConfigReaderDto> createItemMasterMapper() {
		BeanWrapperFieldSetMapper<EmployeeLoanConfigReaderDto> itemMasterMapper = new BeanWrapperFieldSetMapper<>();
		itemMasterMapper.setTargetType(EmployeeLoanConfigReaderDto.class);
		return itemMasterMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<EmployeeLoanConfigWriterDto> ingestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<EmployeeLoanConfigWriterDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from employee_loan_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(EmployeeLoanConfigWriterDto.class));
		return reader;
	}
}
