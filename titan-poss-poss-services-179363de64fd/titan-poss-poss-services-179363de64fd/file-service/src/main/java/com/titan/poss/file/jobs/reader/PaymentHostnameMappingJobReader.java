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
import com.titan.poss.file.constants.PaymentCodeEnum;
import com.titan.poss.file.dto.PaymentHostnameMappingDto;
import com.titan.poss.file.jobs.mapper.PaymentHostnameMapper;
import com.titan.poss.payment.dao.PaymentHostnameMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PaymentHostnameMappingJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<PaymentHostnameMappingDto> paymentHostnameMappingFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['paymentCode']}") String paymentCode,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<PaymentHostnameMappingDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<PaymentHostnameMappingDto> paymentHostnameMappingLineMapper = createPaymentHostnameMappingLineMapper(paymentCode);
		reader.setLineMapper(paymentHostnameMappingLineMapper);

		return reader;
	}

	private LineMapper<PaymentHostnameMappingDto> createPaymentHostnameMappingLineMapper(String paymentCode) {
		DefaultLineMapper<PaymentHostnameMappingDto> paymentHostnameMapperMapper = new DefaultLineMapper<>();

		LineTokenizer cardDetailsLineTokenizer = createpaymentHostnameLineTokenizer(paymentCode);
		paymentHostnameMapperMapper.setLineTokenizer(cardDetailsLineTokenizer);

		FieldSetMapper<PaymentHostnameMappingDto> paymentHostnameMapper = createPaymentHostnameMapper();
		paymentHostnameMapperMapper.setFieldSetMapper(paymentHostnameMapper);

		return paymentHostnameMapperMapper;
	}

	private LineTokenizer createpaymentHostnameLineTokenizer(String paymentCode) {
		DelimitedLineTokenizer paymentHostnameLineTokenizer = new DelimitedLineTokenizer();
		paymentHostnameLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		if (paymentCode.equalsIgnoreCase(PaymentCodeEnum.UNIPAY.getValue())) {
			paymentHostnameLineTokenizer.setNames("locationCode", "hostName", "deviceId", "paymentCode", "isActive");
		} else {
			paymentHostnameLineTokenizer.setNames("locationCode", "hostName", "paymentCode", "isActive");
		}
		return paymentHostnameLineTokenizer;
	}

	private FieldSetMapper<PaymentHostnameMappingDto> createPaymentHostnameMapper() {
		BeanWrapperFieldSetMapper<PaymentHostnameMappingDto> paymentHostnameMapper = new BeanWrapperFieldSetMapper<>();
		paymentHostnameMapper.setTargetType(PaymentHostnameMappingDto.class);
		return paymentHostnameMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PaymentHostnameMappingDto> paymentHostnameMappingIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<PaymentHostnameMappingDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from payment_hostname_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(PaymentHostnameMappingDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PaymentHostnameMappingDaoExt> paymentHostnameMappingDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, PaymentHostnameMapper paymentHostnameMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<PaymentHostnameMappingDaoExt> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql(
				"SELECT * FROM payments.dbo.payment_hostname_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(paymentHostnameMapper);
		return reader;
	}
}