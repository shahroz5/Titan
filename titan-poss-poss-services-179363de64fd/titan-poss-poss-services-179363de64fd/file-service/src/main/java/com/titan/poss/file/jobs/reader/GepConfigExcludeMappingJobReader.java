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

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.GepConfigExcludeMappingDto;
import com.titan.poss.file.jobs.mapper.GepConfigExcludeMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GepConfigExcludeMappingJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<GepConfigExcludeMappingDto> gepConfigExcludeMappingFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<GepConfigExcludeMappingDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<GepConfigExcludeMappingDto> gepConfigExcludeMappingLineMapper = createGepConfigExcludeMappingLineMapper();
		reader.setLineMapper(gepConfigExcludeMappingLineMapper);

		return reader;
	}

	private LineMapper<GepConfigExcludeMappingDto> createGepConfigExcludeMappingLineMapper() {
		DefaultLineMapper<GepConfigExcludeMappingDto> gepConfigExcludeMappingMapper = new DefaultLineMapper<>();

		LineTokenizer gepConfigExcludeMappingLineTokenizer = createGepConfigExcludeMappingLineTokenizer();
		gepConfigExcludeMappingMapper.setLineTokenizer(gepConfigExcludeMappingLineTokenizer);

		FieldSetMapper<GepConfigExcludeMappingDto> gepConfigExcludeMapper = createGepConfigExcludeMappingMapper();
		gepConfigExcludeMappingMapper.setFieldSetMapper(gepConfigExcludeMapper);

		return gepConfigExcludeMappingMapper;
	}

	private LineTokenizer createGepConfigExcludeMappingLineTokenizer() {
		DelimitedLineTokenizer gepConfigExcludeMappingLineTokenizer = new DelimitedLineTokenizer();
		gepConfigExcludeMappingLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		gepConfigExcludeMappingLineTokenizer.setNames("itemCode", "isExcluded");
		return gepConfigExcludeMappingLineTokenizer;
	}

	private FieldSetMapper<GepConfigExcludeMappingDto> createGepConfigExcludeMappingMapper() {
		BeanWrapperFieldSetMapper<GepConfigExcludeMappingDto> gepConfigExcludeMappingMapper = new BeanWrapperFieldSetMapper<>();
		gepConfigExcludeMappingMapper.setTargetType(GepConfigExcludeMappingDto.class);
		return gepConfigExcludeMappingMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GepConfigExcludeMappingDto> gepConfigExcludeMappingIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<GepConfigExcludeMappingDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from gep_config_exclude_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(GepConfigExcludeMappingDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ExchangeConfigExcludeMappingDaoExt> gepConfigExcludeMappingDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, GepConfigExcludeMapper gepConfigExcludeMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<ExchangeConfigExcludeMappingDaoExt> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM configs.dbo.exchange_config_exclude_mapping where correlation_id ='" + fileAuditId
				+ "'");
		reader.setRowMapper(gepConfigExcludeMapper);
		return reader;
	}
}
