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
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigWriterDto;
import com.titan.poss.file.jobs.mapper.ComplexityPriceGroupMapper;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class ComplexityPriceGroupMappingJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMappingFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<ComplexityPriceGroupConfigReaderDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMappingLineMapper = createComplexityPriceGroupMappingLineMapper();
		reader.setLineMapper(complexityPriceGroupMappingLineMapper);

		return reader;
	}

	private LineMapper<ComplexityPriceGroupConfigReaderDto> createComplexityPriceGroupMappingLineMapper() {
		DefaultLineMapper<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMappingMapper = new DefaultLineMapper<>();

		LineTokenizer complexityPriceGroupMappingLineTokenizer = createComplexityPriceGroupMappingLineTokenizer();
		complexityPriceGroupMappingMapper.setLineTokenizer(complexityPriceGroupMappingLineTokenizer);

		FieldSetMapper<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMapper = createComplexityPriceGroupMapper();
		complexityPriceGroupMappingMapper.setFieldSetMapper(complexityPriceGroupMapper);

		return complexityPriceGroupMappingMapper;
	}

	private LineTokenizer createComplexityPriceGroupMappingLineTokenizer() {
		DelimitedLineTokenizer ComplexityPriceGroupMappingLineTokenizer = new DelimitedLineTokenizer();
		ComplexityPriceGroupMappingLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		ComplexityPriceGroupMappingLineTokenizer.setNames("Complexitycode", "Pricegroup", "MakingChargesPerUnit", "Makingchargespergram", "IsActive","Wastagepercentage","MakingChargePercentage");
		return ComplexityPriceGroupMappingLineTokenizer;
	}

	private FieldSetMapper<ComplexityPriceGroupConfigReaderDto> createComplexityPriceGroupMapper() {
		BeanWrapperFieldSetMapper<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMappingMapper = new BeanWrapperFieldSetMapper<>();
		complexityPriceGroupMappingMapper.setTargetType(ComplexityPriceGroupConfigReaderDto.class);
		return complexityPriceGroupMappingMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ComplexityPriceGroupConfigWriterDto> complexityPriceGroupMappingIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<ComplexityPriceGroupConfigWriterDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from complexity_price_group_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(ComplexityPriceGroupConfigWriterDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ComplexityPriceGroupDao> complexityPriceGroupMappingDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, ComplexityPriceGroupMapper complexityPriceGroupMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<ComplexityPriceGroupDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.complexity_price_group_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(complexityPriceGroupMapper);
		return reader;
	}
}
