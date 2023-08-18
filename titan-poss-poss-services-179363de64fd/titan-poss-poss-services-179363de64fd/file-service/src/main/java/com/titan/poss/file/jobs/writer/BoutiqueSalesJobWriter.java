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

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.BoutiqueSalesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class BoutiqueSalesJobWriter {

	private static final String REC_TYPE = "recType";
	private static final String OUTPUT_FILE_PATH = "boutique.sales.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<BoutiqueSalesDto> boutiqueSalesHdrStagingWriter(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {

		int indexOf = fileName.indexOf('.');
		String boutiqueFileName = fileName.substring(0, indexOf);
		String boutiqueSalesHdrStagingWriterSql = "INSERT into boutique_sales_hdr_stage (rec_type,customer_no,customer_name,order_source,sys_document_ref,order_type,ship_org,\r\n"
				+ "price_list,salesrep,item_attribute1,item_attribute2,item_attribute3,item_attribute4,item_attribute5,item_attribute6,item_attribute7,file_id)\r\n"
				+ "values ('HDR',:hdrCustomerNo,:hdrCustomerName,:hdrOrderSource,:hdrSysDocumentRef,:hdrOrderType,:hdrShipOrg,:hdrPriceList,:hdrSalesRep,:hdrItemAttribute1,\r\n"
				+ ":hdrItemAttribute2,:hdrItemAttribute3,:hdrItemAttribute4,:hdrItemAttribute5,:hdrItemAttribute6,'"
				+ boutiqueFileName + "','" + fileId + "')";
		JdbcBatchItemWriter<BoutiqueSalesDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(boutiqueSalesHdrStagingWriterSql);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<BoutiqueSalesDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<BoutiqueSalesDto> boutiqueSalesDetStagingWriter(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {

		int indexOf = fileName.indexOf('.');
		String boutiqueFileName = fileName.substring(0, indexOf);
		String gvRedemptionStageInsertQuery = "INSERT into boutique_sales_det_stage (rec_type,sys_documet_ref,sys_line_ref,shipment_ref,inventory_item_ref,cust_line_no,ord_qty1,ord_qty2,unit_selling_price,\r\n"
				+ "unit_list_price,schedule_date,price_list,ship_from_org,calculate_price,item_attribute_1,item_attribute_2,item_attribute_3,item_attribute_4,\r\n"
				+ "item_attribute_5,item_attribute_6,item_attribute_7,item_attribute_8,item_attribute_9,item_attribute_10,item_attribute_11,item_attribute_12,\r\n"
				+ "item_attribute_13,item_attribute_14,item_attribute_15,file_id) values ('DET',:detSysDocumetRef,:detSysLineRef,:detShipmentRef,:detInventoryItemRef,:detCustLineNo,:detOrdQty1,\r\n"
				+ ":detOrdQty2,:detUnitSellingPrice,:detUnitListPrice,:detScheduleDate,:detPriceList,:detShipFromOrg,:detCalculatePrice,:detItemAttribute1,:detItemAttribute2,:detItemAttribute3,\r\n"
				+ ":detItemAttribute4,:detItemAttribute5,:detItemAttribute6,:detItemAttribute7,:detItemAttribute8,:detItemAttribute9,:detItemAttribute10,:detItemAttribute11,:detItemAttribute12,\r\n"
				+ ":detItemAttribute13,:detItemAttribute14,'" + boutiqueFileName + "','" + fileId + "')";
		JdbcBatchItemWriter<BoutiqueSalesDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(gvRedemptionStageInsertQuery);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<BoutiqueSalesDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<BoutiqueSalesDto> boutiqueSalesTaxStagingWriter(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {

		int indexOf = fileName.indexOf('.');
		String boutiqueFileName = fileName.substring(0, indexOf);
		String gvRedemptionStageInsertQuery = "INSERT into boutique_sales_tax_stage(rec_type,sys_document_ref,tax_line_no,tax_name,tax_amount,inventory_item,lot_number,line_no,record_id,location_id,business_date,file_name,file_id)\r\n"
				+ " values ('TAX',:taxSysDocumentRef,:taxLineNo,:taxName,:taxAmount,:taxInventoryItem,:taxLotNumber,:lineNo,:taxRecordId,:taxLocationId,:taxBusinessDate,'"
				+ boutiqueFileName + "','" + fileId + "')";
		JdbcBatchItemWriter<BoutiqueSalesDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(gvRedemptionStageInsertQuery);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<BoutiqueSalesDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<BoutiqueSalesDto> boutiqueSalesFileHdrWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobExecutionContext['fileName']}") String fileName, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileName);

		// Create writer instance
		FlatFileItemWriter<BoutiqueSalesDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(boutiqueSalesHdrLineAggregator());
		return writer;
	}

	private LineAggregator<BoutiqueSalesDto> boutiqueSalesHdrLineAggregator() {
		DelimitedLineAggregator<BoutiqueSalesDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(boutiqueSalesHdrFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<BoutiqueSalesDto> boutiqueSalesHdrFieldExtractor() {
		BeanWrapperFieldExtractor<BoutiqueSalesDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { REC_TYPE, "hdrCustomerNo", "hdrCustomerName", "hdrOrderSource",
				"hdrSysDocumentRef", "hdrOrderType", "hdrShipOrg", "hdrPriceList", "hdrSalesRep", "hdrItemAttribute1",
				"hdrItemAttribute2", "hdrItemAttribute3", "hdrItemAttribute4", "hdrItemAttribute5", "hdrItemAttribute6",
				"hdrItemAttribute7" });

		return fieldExtractor;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<BoutiqueSalesDto> boutiqueSalesFileDetWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobExecutionContext['fileName']}") String fileName, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileName);

		// Create writer instance
		FlatFileItemWriter<BoutiqueSalesDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(boutiqueSalesDetLineAggregator());
		return writer;
	}

	private LineAggregator<BoutiqueSalesDto> boutiqueSalesDetLineAggregator() {
		DelimitedLineAggregator<BoutiqueSalesDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(boutiqueSalesDetFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<BoutiqueSalesDto> boutiqueSalesDetFieldExtractor() {
		BeanWrapperFieldExtractor<BoutiqueSalesDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { REC_TYPE, "detSysDocumetRef", "detSysLineRef", "detShipmentRef",
				"detInventoryItemRef", "detCustLineNo", "detOrdQty1", "detOrdQty2", "detUnitSellingPrice",
				"detUnitListPrice", "detScheduleDate", "detPriceList", "detShipFromOrg", "detCalculatePrice",
				"detItemAttribute1", "detItemAttribute2", "detItemAttribute3", "detItemAttribute4", "detItemAttribute5",
				"detItemAttribute6", "detItemAttribute7", "detItemAttribute8", "detItemAttribute9",
				"detItemAttribute10", "detItemAttribute11", "detItemAttribute12", "detItemAttribute13",
				"detItemAttribute14", "detItemAttribute15" });

		return fieldExtractor;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<BoutiqueSalesDto> boutiqueSalesFileTaxWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobExecutionContext['fileName']}") String fileName, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileName);

		// Create writer instance
		FlatFileItemWriter<BoutiqueSalesDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(boutiqueSalesTaxLineAggregator());
		return writer;
	}

	private LineAggregator<BoutiqueSalesDto> boutiqueSalesTaxLineAggregator() {
		DelimitedLineAggregator<BoutiqueSalesDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(boutiqueSalesTaxFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<BoutiqueSalesDto> boutiqueSalesTaxFieldExtractor() {
		BeanWrapperFieldExtractor<BoutiqueSalesDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(
				new String[] { REC_TYPE, "taxSysDocumentRef", "taxLineNo", "taxName", "taxAmount", "taxInventoryItem",
						"taxLotNumber", "lineNo", "taxRecordId", "taxLocationId", "taxBusinessDate", "taxFileName", });

		return fieldExtractor;
	}
}
