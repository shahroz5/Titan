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
import com.titan.poss.file.dto.GeneralLedgerDto;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class GeneralLedgerJobWriter {

	private static final String OUTPUT_FILE_PATH = "general.ledger.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<GeneralLedgerDto> generalLedgerStagingWriter(
			@Value("#{jobExecutionContext['generalLedgerTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName,
			@Value("#{jobExecutionContext['currencyCode']}") String currencyCode, DataSource dataSource) {
		String generalLedgerFileName = fileName.substring(0, fileName.indexOf('.'));
		String generalLedgerStageInsertQuery = "INSERT into [file].dbo.general_ledger_stage(status,set_of_books,currency,je_source,entered_dr,entered_cr,ac_d_dr,ac_d_cr,"
				+ "je_line_num,seg1,seg2,seg3,seg4,seg5,seg6,period_name,ac_g_date,je_category,\r\n"
				+ "create_date,created_by,actual_flag,group_id,attribute5,attribute6,attribute2,attribute4,attribute3,attribute1,file_name,file_id)\r\n"
				+ "values(:status,:setOfBooks, '" + currencyCode
				+ "',:jeSource,:enteredDr,:enteredCr,:acDDr, :acDCr,:jeLineNum,:seg1,:seg2,:seg3,:seg4,:seg5,:seg6,:periodName,:acGDate,:jeCategory,:createDate,\r\n"
				+ ":createdBy,:actualFlag,:groupId,:attribute5,:attribute6,:attribute2,:attribute4,:attribute3,:attribute1, '"
				+ generalLedgerFileName + "','" + fileId + "')";
		JdbcBatchItemWriter<GeneralLedgerDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(generalLedgerStageInsertQuery);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<GeneralLedgerDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<GeneralLedgerDto> generalLedgerFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			FileService fileService, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getOutBoundFileName(
						FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue(), FileGroupEnum.ORACLE.toString()));

		FlatFileItemWriter<GeneralLedgerDto> writer = new FlatFileItemWriter<>();
		writer.setResource(outputResource);
		writer.setAppendAllowed(true);
		writer.setLineAggregator(generalLedgerLineAggregator());
		return writer;
	}

	private LineAggregator<GeneralLedgerDto> generalLedgerLineAggregator() {
		DelimitedLineAggregator<GeneralLedgerDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(generalLedgerFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<GeneralLedgerDto> generalLedgerFieldExtractor() {
		BeanWrapperFieldExtractor<GeneralLedgerDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "status", "setOfBooks", "currency", "jeSource", "enteredDr", "enteredCr",
				"acDDr", "acDCr", "jeLineNum", "seg1", "seg2", "seg3", "seg4", "seg5", "seg6", "periodName", "acGDate",
				"jeCategory", "createDate", "createdBy", "actualFlag", "groupId", "attribute5", "attribute6",
				"attribute2", "attribute4", "attribute3", "attribute1", "fileName" });

		return fieldExtractor;
	}

}
