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
import com.titan.poss.file.dto.BoutiqueRevenueDto;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class BoutiqueRevenueJobWriter {

	private static final String FILES_BASE_FOLDER = "files.baseFolder";

	private static final String OUTPUT_FILE_PATH = "boutique.revenue.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<BoutiqueRevenueDto> boutiqueRevenueStagingWriter(
			@Value("#{jobExecutionContext['boutiqueRevenueTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {
		String boutiqueRevenueFileName = fileName.substring(0, fileName.indexOf('.'));
		String boutiqueRevenueStageInsertQuery = "INSERT into boutique_revenue_stage(receipt_no, currency, amount, receipt_date, gl_date, receipt_method, category, attribute1, attribute2, customer_name, customer_number, comments, attribute3, attribute4, attribute5, attribute6, attribute7, attribute8, file_id)"
				+ "values (:receiptNo,:currency,:amount,:receiptDate,:glDate,:receiptMethod,:category,:attribute1,:attribute2,:customerName,:customerNumber,:comments,:attribute3,:attribute4,:attribute5,:attribute6,:attribute7,'"
				+ boutiqueRevenueFileName + "','" + fileId + "')";
		JdbcBatchItemWriter<BoutiqueRevenueDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(boutiqueRevenueStageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<BoutiqueRevenueDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<BoutiqueRevenueDto> boutiqueRevenueFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			FileService fileService, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FILES_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getCommonOracleFileName(
						FileMasterJobNameEnum.BOUTIQUE_REVENUE_JOB.getValue(), FileGroupEnum.ORACLE.toString()));

		FlatFileItemWriter<BoutiqueRevenueDto> writer = new FlatFileItemWriter<>();

		writer.setResource(outputResource);

		writer.setAppendAllowed(true);

		writer.setLineAggregator(boutiqueRevenueLineAggregator());
		return writer;
	}

	private LineAggregator<BoutiqueRevenueDto> boutiqueRevenueLineAggregator() {
		DelimitedLineAggregator<BoutiqueRevenueDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(boutiqueRevenueFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<BoutiqueRevenueDto> boutiqueRevenueFieldExtractor() {
		BeanWrapperFieldExtractor<BoutiqueRevenueDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "receiptNo", "currency", "amount", "receiptDate", "glDate",
				"receiptMethod", "category", "attribute1", "attribute2", "customerName", "customerNumber", "comments",
				"attribute3", "attribute4", "attribute5", "attribute6", "attribute7String", "attribute8" });

		return fieldExtractor;
	}

}
