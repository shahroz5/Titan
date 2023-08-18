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

import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;
import com.titan.poss.file.jobs.mapper.ItemGroupLevelDiscountMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ItemGroupLevelDiscountJobReader {

	private static final String TEMP_FOLDER = "temp.file.folder";

	private static final String PATH_DELIMITTER = "/";

	private static final String FILE_BASE_FOLDER = "files.baseFolder";

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ItemGroupLevelDiscountDto> itemGroupLevelDiscountFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<ItemGroupLevelDiscountDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FILE_BASE_FOLDER) + env.getProperty(TEMP_FOLDER)
				+ PATH_DELIMITTER + fileGroup + PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<ItemGroupLevelDiscountDto> itemGroupLevelLineMapper = createItemGroupLevelDiscountMapper();
		reader.setLineMapper(itemGroupLevelLineMapper);

		return reader;
	}

	private LineMapper<ItemGroupLevelDiscountDto> createItemGroupLevelDiscountMapper() {
		DefaultLineMapper<ItemGroupLevelDiscountDto> mapper = new DefaultLineMapper<>();

		LineTokenizer lineTokenizer = createItemGroupLevelDiscountLineTokenizer();
		mapper.setLineTokenizer(lineTokenizer);

		FieldSetMapper<ItemGroupLevelDiscountDto> itemMapper = createItemGroupLevelMapper();
		mapper.setFieldSetMapper(itemMapper);

		return mapper;
	}

	private LineTokenizer createItemGroupLevelDiscountLineTokenizer() {
		DelimitedLineTokenizer lineTokenizer = new DelimitedLineTokenizer();
		lineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		lineTokenizer.setNames("regularF2IsPercent", "regularUcpIsPercent", "regularVIsPercent", "regularF1IsPercent",
				"regularF2Value", "regularUcpValue", "regularVValue", "regularF1Value", "regularWeightValue",
				"regularIsGrossWeight", "discountCode", "itemCode", "lotNumber", "locationCode", "regularStartDate",
				"regularEndDate", "isTransferredLocation", "isPreviewApplicable", "previewF2IsPercent",
				"previewUcpIsPercent", "previewVIsPercent", "previewF1IsPercent", "previewF2Value", "previewUcpValue",
				"previewVValue", "previewF1Value", "previewWeightValue", "previewIsGrossWeight", "previewStartDate",
				"previewEndDate", "isActive");
		return lineTokenizer;
	}

	private FieldSetMapper<ItemGroupLevelDiscountDto> createItemGroupLevelMapper() {
		BeanWrapperFieldSetMapper<ItemGroupLevelDiscountDto> mapper = new BeanWrapperFieldSetMapper<>();
		mapper.setTargetType(ItemGroupLevelDiscountDto.class);
		return mapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ItemGroupLevelDiscountDto> itemGroupLevelDiscountIngestionReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<ItemGroupLevelDiscountDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from discount_item_mapping_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(ItemGroupLevelDiscountDto.class));
		return reader;
	}

	/**
	 * @param willBeInjected
	 * @param itemGroupLevelDiscountMapper
	 * @param dataSource
	 * @return
	 */
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DiscountItemMappingDao> itemGroupLevelDiscountDataSyncReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId,
			ItemGroupLevelDiscountMapper itemGroupLevelDiscountMapper, DataSource dataSource) {
		JdbcCursorItemReader<DiscountItemMappingDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM configs.dbo.discount_item_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(itemGroupLevelDiscountMapper);
		return reader;
	}

}
