/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
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

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.GvRedemptionDto;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GvRedemptionJobWriter {

	private static final String OUTPUT_FILE_PATH = "gv.redemption.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<GvRedemptionDto> gvRedemptionStagingWriter(
			@Value("#{jobExecutionContext['gvRedemptionTransactionId']}") String fileId, DataSource dataSource) {

		String gvRedemptionStageInsertQuery = "INSERT into gv_redemption_stage(date_and_time,doc_type,cm_number,gv_item_code,gv_serial_number,gv_gc,amount,location_code,owner_info,type,remarks,file_id)\r\n"
				+ "values (:dateAndTime,:docType,:cmNumber,:gvItemCode,:gvSerialNumber,:gvGc,:amount,:locationCode,:ownerInfo,:type,:remarks, '"
				+ fileId + "')";
		JdbcBatchItemWriter<GvRedemptionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(gvRedemptionStageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<GvRedemptionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<GvRedemptionDto> gvRedemptionFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			FileService fileService, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getGvRedemptionFileName(
						FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue(), FileGroupEnum.ORACLE.toString()));

		// Create writer instance
		FlatFileItemWriter<GvRedemptionDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(gvRedemptionLineAggregator());
		return writer;
	}

	private LineAggregator<GvRedemptionDto> gvRedemptionLineAggregator() {
		DelimitedLineAggregator<GvRedemptionDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(gvRedemptionFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<GvRedemptionDto> gvRedemptionFieldExtractor() {
		BeanWrapperFieldExtractor<GvRedemptionDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "dateAndTime", "docType", "cmNumber", "gvItemCode", "gvGc",
				"gvSerialNumber", "amount", "locationCode", "ownerInfo", "type", "remarks" });

		return fieldExtractor;
	}
}
