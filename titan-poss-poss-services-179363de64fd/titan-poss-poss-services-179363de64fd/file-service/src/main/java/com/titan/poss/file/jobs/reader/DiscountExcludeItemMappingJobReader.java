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
import org.springframework.jdbc.core.RowMapper;

import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class DiscountExcludeItemMappingJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<DiscountExcludeItemMappingDto> discountExcludeItemMappingFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<DiscountExcludeItemMappingDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<DiscountExcludeItemMappingDto> discountExcludeItemMappingLineMapper = createDiscountExcludeItemMappingLineMapper();
		reader.setLineMapper(discountExcludeItemMappingLineMapper);

		return reader;
	}

	private LineMapper<DiscountExcludeItemMappingDto> createDiscountExcludeItemMappingLineMapper() {
		DefaultLineMapper<DiscountExcludeItemMappingDto> discountExcludeItemMappingMapper = new DefaultLineMapper<>();

		LineTokenizer gepConfigExcludeMappingLineTokenizer = createDiscountExcludeItemMappingLineTokenizer();
		discountExcludeItemMappingMapper.setLineTokenizer(gepConfigExcludeMappingLineTokenizer);

		FieldSetMapper<DiscountExcludeItemMappingDto> gepConfigExcludeMapper = createDiscountExcludeItemMappingMapper();
		discountExcludeItemMappingMapper.setFieldSetMapper(gepConfigExcludeMapper);

		return discountExcludeItemMappingMapper;
	}

	private LineTokenizer createDiscountExcludeItemMappingLineTokenizer() {
		DelimitedLineTokenizer discountExcludeItemMappingLineTokenizer = new DelimitedLineTokenizer();
		discountExcludeItemMappingLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		discountExcludeItemMappingLineTokenizer.setNames("itemCode", "isExcluded");
		return discountExcludeItemMappingLineTokenizer;
	}

	private FieldSetMapper<DiscountExcludeItemMappingDto> createDiscountExcludeItemMappingMapper() {
		BeanWrapperFieldSetMapper<DiscountExcludeItemMappingDto> discountExcludeItemMappingMapper = new BeanWrapperFieldSetMapper<>();
		discountExcludeItemMappingMapper.setTargetType(DiscountExcludeItemMappingDto.class);
		return discountExcludeItemMappingMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DiscountExcludeItemMappingDto> discountExcludeItemMappingIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<DiscountExcludeItemMappingDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from discount_exclude_item_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(DiscountExcludeItemMappingDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DiscountExcludeMappingDao> discountExcludeItemMappingDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId,
			RowMapper<DiscountExcludeMappingDao> discountExcludeItemMapper, DataSource dataSource) {
		JdbcCursorItemReader<DiscountExcludeMappingDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM configs.dbo.discount_exclude_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(discountExcludeItemMapper);
		return reader;
	}

}
