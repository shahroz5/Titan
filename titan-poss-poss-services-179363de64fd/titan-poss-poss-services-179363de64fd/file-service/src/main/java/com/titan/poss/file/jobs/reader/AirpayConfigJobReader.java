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
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class AirpayConfigJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<AirpayConfigDto> airpayConfigFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<AirpayConfigDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<AirpayConfigDto> airpayLineMapper = createItemMasterLineMapper();
		reader.setLineMapper(airpayLineMapper);

		return reader;
	}

	private LineMapper<AirpayConfigDto> createItemMasterLineMapper() {
		DefaultLineMapper<AirpayConfigDto> itemMapper = new DefaultLineMapper<>();

		LineTokenizer itemMasterLineTokenizer = createItemMasterLineTokenizer();
		itemMapper.setLineTokenizer(itemMasterLineTokenizer);

		FieldSetMapper<AirpayConfigDto> itemMasterMapper = createItemMasterMapper();
		itemMapper.setFieldSetMapper(itemMasterMapper);

		return itemMapper;
	}

	private LineTokenizer createItemMasterLineTokenizer() {
		DelimitedLineTokenizer itemMasterLineTokenizer = new DelimitedLineTokenizer();
		itemMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		itemMasterLineTokenizer.setNames("locationCode", "merchantId", "username", "password", "secretKey",
				"secretToken");
		return itemMasterLineTokenizer;
	}

	private FieldSetMapper<AirpayConfigDto> createItemMasterMapper() {
		BeanWrapperFieldSetMapper<AirpayConfigDto> itemMasterMapper = new BeanWrapperFieldSetMapper<>();
		itemMasterMapper.setTargetType(AirpayConfigDto.class);
		return itemMasterMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<AirpayConfigDto> airpayConfigIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<AirpayConfigDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from airpay_config_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(AirpayConfigDto.class));
		return reader;
	}
}
