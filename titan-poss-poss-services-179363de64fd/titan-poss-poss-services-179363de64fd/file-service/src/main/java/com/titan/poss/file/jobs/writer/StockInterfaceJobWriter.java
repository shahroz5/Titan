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
import com.titan.poss.file.dto.StockInterfaceDto;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StockInterfaceJobWriter {

	private static final String FILES_BASE_FOLDER = "files.baseFolder";

	private static final String OUTPUT_FILE_PATH = "stock.interface.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<StockInterfaceDto> stockInterfaceStagingWriter(
			@Value("#{jobExecutionContext['stockInterfaceTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {
		String stockInterfaceFileName = fileName.substring(0, fileName.indexOf('.'));
		String stockInterfaceStageInsertQuery = "INSERT into stock_interface_stage (transaction_type,from_where,from_location,lot_no,stm_value,to_where,to_location,primary_qty,secondary_qty2,business_date,reason_code,stm_number,\r\n"
				+ "item_no,\"attribute\",attribute1,attribute2,attribute3,logistic_partner_name,logistic_doc_number,igst_percentage,igst_amount,sgst_percentage,sgst_amount,cgst_percentage,cgst_amount,\r\n"
				+ "utgst_percentage,utgst_amount,record_id,btq_code,file_name,file_id,business_date2)\r\n"
				+ "values (:transactionType,:fromWhere,:fromLocation,:lotNo,:stmValue,:toWhere,:toLocation,:primaryQty,:secondaryQty2,:businessDate,:reasonCode,:stmNumber,:itemNo,:attribute,:attribute1,\r\n"
				+ ":attribute2,:attribute3,:logisticPartnerName,:logisticDocNumber,:igstPercentage,:igstAmount,:sgstPercentage,:sgstAmount,:cgstPercentage,:cgstAmount,:utgstPercentage,:utgstAmount,\r\n"
				+ ":recordId,:btqCode,'" + stockInterfaceFileName + "','" + fileId + "',:businessDate2)";
		JdbcBatchItemWriter<StockInterfaceDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(stockInterfaceStageInsertQuery);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<StockInterfaceDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<StockInterfaceDto> stockInterfaceFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			FileService fileService, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FILES_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getCommonOracleFileName(
						FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue(), FileGroupEnum.ORACLE.toString()));

		FlatFileItemWriter<StockInterfaceDto> writer = new FlatFileItemWriter<>();
		writer.setResource(outputResource);
		writer.setAppendAllowed(true);
		writer.setLineAggregator(stockInterfaceLineAggregator());
		return writer;
	}

	private LineAggregator<StockInterfaceDto> stockInterfaceLineAggregator() {
		DelimitedLineAggregator<StockInterfaceDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(stockInterfaceFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<StockInterfaceDto> stockInterfaceFieldExtractor() {
		BeanWrapperFieldExtractor<StockInterfaceDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "transactionType", "fromWhere", "fromLocation", "lotNo", "stmValue",
				"toWhere", "toLocation", "primaryQty", "secondaryQty2", "businessDate", "reasonCode", "stmNumber",
				"itemNo", "attribute", "attribute1", "attribute2", "attribute3", "logisticPartnerName",
				"logisticDocNumber", "igstPercentage", "igstAmount", "sgstPercentage", "sgstAmount", "cgstPercentage",
				"cgstAmount", "utgstPercentage", "utgstAmount", "recordId", "btqCode", "businessDate", "fileName" });

		return fieldExtractor;
	}

}
