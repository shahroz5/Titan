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
import com.titan.poss.file.dto.QcgcConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class QcgcConfigJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<QcgcConfigDto> qcgcConfigFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<QcgcConfigDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<QcgcConfigDto> qcgcLineMapper = createQcgcConfigLineMapper();
		reader.setLineMapper(qcgcLineMapper);

		return reader;
	}

	private LineMapper<QcgcConfigDto> createQcgcConfigLineMapper() {
		DefaultLineMapper<QcgcConfigDto> qcgcConfigMapper = new DefaultLineMapper<>();

		LineTokenizer qcgcConfigLineTokenizer = createQcgcConfigLineTokenizer();
		qcgcConfigMapper.setLineTokenizer(qcgcConfigLineTokenizer);

		FieldSetMapper<QcgcConfigDto> itemMasterMapper = createQcgcConfigMapper();
		qcgcConfigMapper.setFieldSetMapper(itemMasterMapper);

		return qcgcConfigMapper;
	}

	private LineTokenizer createQcgcConfigLineTokenizer() {
		DelimitedLineTokenizer qcgcConfigLineTokenizer = new DelimitedLineTokenizer();
		qcgcConfigLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		qcgcConfigLineTokenizer.setNames("locationCode", "terminalId");
		return qcgcConfigLineTokenizer;
	}

	private FieldSetMapper<QcgcConfigDto> createQcgcConfigMapper() {
		BeanWrapperFieldSetMapper<QcgcConfigDto> qcgcConfigMapper = new BeanWrapperFieldSetMapper<>();
		qcgcConfigMapper.setTargetType(QcgcConfigDto.class);
		return qcgcConfigMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<QcgcConfigDto> qcgcConfigIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<QcgcConfigDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from qcgc_config_stage where file_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(QcgcConfigDto.class));
		return reader;
	}
}
