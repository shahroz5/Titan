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
import com.titan.poss.file.dto.PayerBankDto;
import com.titan.poss.file.jobs.mapper.PayerBankMapper;
import com.titan.poss.payment.dao.PayerBankDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PayerBankJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<PayerBankDto> payerBankFileReader(@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<PayerBankDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<PayerBankDto> payerBankLineMapper = createPayerBankLineMapper();
		reader.setLineMapper(payerBankLineMapper);

		return reader;
	}

	private LineMapper<PayerBankDto> createPayerBankLineMapper() {
		DefaultLineMapper<PayerBankDto> payerBankMapper = new DefaultLineMapper<>();

		LineTokenizer payerBankLineTokenizer = createPayerBankLineTokenizer();
		payerBankMapper.setLineTokenizer(payerBankLineTokenizer);

		FieldSetMapper<PayerBankDto> payerMapper = createPayerBankMapper();
		payerBankMapper.setFieldSetMapper(payerMapper);

		return payerBankMapper;
	}

	private LineTokenizer createPayerBankLineTokenizer() {
		DelimitedLineTokenizer payerBankLineTokenizer = new DelimitedLineTokenizer();
		payerBankLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		payerBankLineTokenizer.setNames("bankName", "isActive");
		return payerBankLineTokenizer;
	}

	private FieldSetMapper<PayerBankDto> createPayerBankMapper() {
		BeanWrapperFieldSetMapper<PayerBankDto> payerBankMapper = new BeanWrapperFieldSetMapper<>();
		payerBankMapper.setTargetType(PayerBankDto.class);
		return payerBankMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PayerBankDto> payerBankIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<PayerBankDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from payer_bank_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(PayerBankDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PayerBankDao> payerBankDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, PayerBankMapper payerBankMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<PayerBankDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM payments.dbo.payer_bank_master where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(payerBankMapper);
		return reader;
	}
}