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
import com.titan.poss.file.dto.PricingLogicTestDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class PricingLogicTestJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<PricingLogicTestDto> pricingLogicTestFileReader(
			@Value("#{jobParameters['fileName']}") String fileName,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {

		FlatFileItemReader<PricingLogicTestDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(FileIntegrationConstants.TEMP_FOLDER) + FileIntegrationConstants.PATH_DELIMITTER
				+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileName));

		reader.setLinesToSkip(1);

		LineMapper<PricingLogicTestDto> airpayLineMapper = createItemMasterLineMapper();
		reader.setLineMapper(airpayLineMapper);

		return reader;
	}

	private LineMapper<PricingLogicTestDto> createItemMasterLineMapper() {
		DefaultLineMapper<PricingLogicTestDto> itemMapper = new DefaultLineMapper<>();

		LineTokenizer pricingLogicLineTokenizer = createPricingLogicTestLineTokenizer();
		itemMapper.setLineTokenizer(pricingLogicLineTokenizer);

		FieldSetMapper<PricingLogicTestDto> pricingLogicMapper = createPricingLogicMapper();
		itemMapper.setFieldSetMapper(pricingLogicMapper);

		return itemMapper;
	}

	private LineTokenizer createPricingLogicTestLineTokenizer() {
		DelimitedLineTokenizer pricingLogicLineTokenizer = new DelimitedLineTokenizer();
		pricingLogicLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		pricingLogicLineTokenizer.setNames("itemCode", "lotNumber", "goldRate", "silverRate", "platinumRate",
				"measuredWeight", "metalPrice", "stoneValue", "makingCharge", "locationCode");
		return pricingLogicLineTokenizer;
	}

	private FieldSetMapper<PricingLogicTestDto> createPricingLogicMapper() {
		BeanWrapperFieldSetMapper<PricingLogicTestDto> pricingLogicMapper = new BeanWrapperFieldSetMapper<>();
		pricingLogicMapper.setTargetType(PricingLogicTestDto.class);
		return pricingLogicMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PricingLogicTestDto> pricingLogicStageReader(
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId, DataSource dataSource) {
		JdbcCursorItemReader<PricingLogicTestDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("Select * from price_logic_test_stage where file_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(PricingLogicTestDto.class));
		return reader;
	}
}
