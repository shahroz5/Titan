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
import com.titan.poss.file.dto.ProductPriceMappingDto;
import com.titan.poss.file.jobs.mapper.ProductPriceMapper;
import com.titan.poss.product.dao.ProductPriceMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class ProductPriceMappingJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ProductPriceMappingDto> productPriceMappingFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<ProductPriceMappingDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<ProductPriceMappingDto> productPriceMappingLineMapper = createProductPriceMappingLineMapper();
		reader.setLineMapper(productPriceMappingLineMapper);

		return reader;
	}

	private LineMapper<ProductPriceMappingDto> createProductPriceMappingLineMapper() {
		DefaultLineMapper<ProductPriceMappingDto> productPriceMappingMapper = new DefaultLineMapper<>();

		LineTokenizer productPriceMappingLineTokenizer = createProductPriceMappingLineTokenizer();
		productPriceMappingMapper.setLineTokenizer(productPriceMappingLineTokenizer);

		FieldSetMapper<ProductPriceMappingDto> productPriceMapper = createProductPriceMappingMapper();
		productPriceMappingMapper.setFieldSetMapper(productPriceMapper);

		return productPriceMappingMapper;
	}

	private LineTokenizer createProductPriceMappingLineTokenizer() {
		DelimitedLineTokenizer productPriceMappingLineTokenizer = new DelimitedLineTokenizer();
		productPriceMappingLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		productPriceMappingLineTokenizer.setNames("productGroupCode", "fromBand", "toBand", "fromPrice", "toPrice",
				"margin");
		return productPriceMappingLineTokenizer;
	}

	private FieldSetMapper<ProductPriceMappingDto> createProductPriceMappingMapper() {
		BeanWrapperFieldSetMapper<ProductPriceMappingDto> productPriceMappingMapper = new BeanWrapperFieldSetMapper<>();
		productPriceMappingMapper.setTargetType(ProductPriceMappingDto.class);
		return productPriceMappingMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ProductPriceMappingDto> productPriceMappingIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<ProductPriceMappingDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from product_price_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(ProductPriceMappingDto.class));
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ProductPriceMappingDao> productPriceMappingDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, ProductPriceMapper productPriceMapper,
			DataSource dataSource) {
		JdbcCursorItemReader<ProductPriceMappingDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.product_price_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(productPriceMapper);
		return reader;
	}
}
