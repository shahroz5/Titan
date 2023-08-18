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
import com.titan.poss.file.dto.TaxConfigDto;
import com.titan.poss.file.jobs.mapper.TaxConfigMapper;
import com.titan.poss.location.dao.TaxConfigsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class TaxConfigJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<TaxConfigDto> taxConfigFileReader(@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<TaxConfigDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<TaxConfigDto> taxConfigLineMapper = createTaxConfigLineMapper();
		reader.setLineMapper(taxConfigLineMapper);

		return reader;
	}

	private LineMapper<TaxConfigDto> createTaxConfigLineMapper() {
		DefaultLineMapper<TaxConfigDto> taxConfigMapper = new DefaultLineMapper<>();

		LineTokenizer taxConfigLineTokenizer = createTaxConfigLineTokenizer();
		taxConfigMapper.setLineTokenizer(taxConfigLineTokenizer);

		FieldSetMapper<TaxConfigDto> taxMapper = createTaxConfigMapper();
		taxConfigMapper.setFieldSetMapper(taxMapper);

		return taxConfigMapper;
	}

	private LineTokenizer createTaxConfigLineTokenizer() {
		DelimitedLineTokenizer taxConfigLineTokenizer = new DelimitedLineTokenizer();
		taxConfigLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		taxConfigLineTokenizer.setNames("transactionType", "sourceBtqType", "destinationBtqType", "customerType",
				"srcLocationApplicableTax", "destLocationApplicableTax", "customerApplicableTax", "isSameState",
				"isSourceBtqTaxApplicable", "applicableTax","isActive");
		return taxConfigLineTokenizer;
	}

	private FieldSetMapper<TaxConfigDto> createTaxConfigMapper() {
		BeanWrapperFieldSetMapper<TaxConfigDto> taxConfigMapper = new BeanWrapperFieldSetMapper<>();
		taxConfigMapper.setTargetType(TaxConfigDto.class);
		return taxConfigMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<TaxConfigDto> taxConfigIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<TaxConfigDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from tax_configs_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(TaxConfigDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<TaxConfigsDao> taxConfigDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, TaxConfigMapper taxConfigMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<TaxConfigsDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM locations.dbo.tax_configs where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(taxConfigMapper);
		return reader;
	}
}
