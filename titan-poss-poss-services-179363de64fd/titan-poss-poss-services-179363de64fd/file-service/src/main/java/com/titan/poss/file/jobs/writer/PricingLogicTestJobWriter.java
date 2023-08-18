/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.io.IOException;
import java.io.Writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.file.FlatFileHeaderCallback;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor;
import org.springframework.batch.item.file.transform.DelimitedLineAggregator;
import org.springframework.batch.item.file.transform.FieldExtractor;
import org.springframework.batch.item.file.transform.LineAggregator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.file.dto.PricingLogicTestDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class PricingLogicTestJobWriter {

	private static final String OUTPUT_FILE_PATH = "price.logic.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<PricingLogicTestDto> priceLogicStagingWriter(
			@Value("#{jobParameters['fileAuditId']}") String fileId, DataSource dataSource) {

		String priceLogicTestStageInsertQuery = "INSERT into [file].dbo.price_logic_test_stage(item_code,lot_number,gold_rate,silver_rate,platinum_rate,measured_weight,metal_price,stone_value,making_charge,calculated_metal_price\r\n"
				+ ",calculated_stone_value,calculated_making_charge,result,file_id, remarks, location_code, cfa_product_code, complexity_code, making_charge_percentage) values (:itemCode, :lotNumber, :goldRate, :silverRate, :platinumRate,\r\n"
				+ ":measuredWeight, :metalPrice, :stoneValue, :makingCharge, :calculatedMetalPrice, :calculatedStoneValue, :calculatedMakingCharge, :result,'"
				+ fileId + "', :remarks, :locationCode, :cfaProductCode, :complexityCode, :makingChargePercentage)";
		JdbcBatchItemWriter<PricingLogicTestDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(priceLogicTestStageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<PricingLogicTestDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemWriter<PricingLogicTestDto> priceLogicFileWriter(
			@Value("#{jobParameters['fileAuditId']}") String fileId,
			@Value("#{jobParameters['fileGroup']}") String fileGroup, Environment env) {
		Resource outputResource = new FileSystemResource(
				env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(OUTPUT_FILE_PATH)
						+ fileGroup + FileIntegrationConstants.PATH_DELIMITTER + fileId + "." + FileExtensionEnum.TXT);

		// Create writer instance
		FlatFileItemWriter<PricingLogicTestDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);
		writer.setHeaderCallback(new FlatFileHeaderCallback() {
			public void writeHeader(Writer writer) throws IOException {
				writer.write(
						"item_code|lot_number|gold_rate|silver_rate|platinum_rate|measured_weight|metal_price|stone_value|making_charge|location_code|cfa_product_code|calculated_metal_price|calculated_stone_value|calculated_making_charge|complexity_code|making_charge_percentage|result|remarks");
			}
		});
		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(priceLogicLineAggregator());
		return writer;
	}

	private LineAggregator<PricingLogicTestDto> priceLogicLineAggregator() {
		DelimitedLineAggregator<PricingLogicTestDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(priceLogicFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<PricingLogicTestDto> priceLogicFieldExtractor() {
		BeanWrapperFieldExtractor<PricingLogicTestDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "itemCode", "lotNumber", "goldRate", "silverRate", "platinumRate",
				"measuredWeight", "metalPrice", "stoneValue", "makingCharge", "locationCode", "cfaProductCode",
				"calculatedMetalPrice", "calculatedStoneValue", "calculatedMakingCharge", "complexityCode",
				"makingChargePercentage", "result", "remarks" });

		return fieldExtractor;
	}
}
