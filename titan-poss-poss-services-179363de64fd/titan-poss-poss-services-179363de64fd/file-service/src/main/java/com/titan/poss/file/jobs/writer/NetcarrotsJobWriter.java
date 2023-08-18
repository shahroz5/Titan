/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.math.RoundingMode;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.NcCustomerTransactionStageDto;
import com.titan.poss.file.dto.NcMemberDataStageDto;
import com.titan.poss.file.dto.NcStoreMasterStageDto;
import com.titan.poss.file.dto.NcTransactionDataStageDto;
import com.titan.poss.file.service.FileService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Configuration
public class NetcarrotsJobWriter {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	private static final String CHANNEL = "channel";

	private static final String STORE_CODE = "storeCode";

	private static final String OUTPUT_FILE_PATH = "ulp.file.completed.path";

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<NcCustomerTransactionStageDto> customerTransactionStagingWriter(
			@Value("#{jobExecutionContext['NcCustomerTransactionSavedId']}") String fileAuditId) {

		String customerTransactionStageInsertQuery = "INSERT into ulp_customer_transaction_data_stage (channel, store_code, transaction_date, unified_loyalty_no,\r\n"
				+ "gv_code, invoice_number, line_item_no, item_code, category_code, cluster, quantity,\r\n"
				+ "gross_amount, discount, eligible_amount, rr_number, transaction_type, reference, discount_code,\r\n"
				+ "cm_date, cm_no, brand_name, cm_location_code, cm_line_item_no, file_audit_id) values (:channel, :storeCode, :transactionDate, :unifiedLoyaltyNo,\r\n"
				+ ":gvCode, :invoiceNumber, :lineItemNo, :itemCode, :categoryCode, :cluster, :quantity,\r\n"
				+ ":grossAmount, :discount, :eligibleAmount, :rrNumber, :transactionType, :reference, :discountCode,\r\n"
				+ ":cmDate, :cmNo, :brandName, :cmLocationCode, :cmLineItemNo, '" + fileAuditId + "')";
		JdbcBatchItemWriter<NcCustomerTransactionStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(customerTransactionStageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<NcCustomerTransactionStageDto>());
		itemWriter.afterPropertiesSet();
		log.info("customerTransactionStagingWriter............................{}",itemWriter.toString());
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<NcCustomerTransactionStageDto> customerTransactionFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobExecutionContext['NcCustomerTransactionSavedId']}") String fileAuditId) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getNetcarrotsFileName(transactionDate,
						FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue(), FileGroupEnum.NETCARROTS.toString(), true));

		// Create writer instance
		FlatFileItemWriter<NcCustomerTransactionStageDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(customerTransactionLineAggregator());
		writer.setHeaderCallback(new FlatFileHeaderCallback() {
			public void writeHeader(Writer writer) throws IOException {
				writer.write("CTRL" + "," + getCustomerTransactionTotalRecordCount(fileAuditId) + ","
						+ getTotalAmount(fileAuditId));
			}
		});
		log.info("customerTransactionStagingWriter............................{}",writer.toString());
		return writer;
	}

	private LineAggregator<NcCustomerTransactionStageDto> customerTransactionLineAggregator() {
		DelimitedLineAggregator<NcCustomerTransactionStageDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter(",");
		lineAggregator.setFieldExtractor(customerTransactionFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<NcCustomerTransactionStageDto> customerTransactionFieldExtractor() {
		BeanWrapperFieldExtractor<NcCustomerTransactionStageDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { CHANNEL, STORE_CODE, "transactionDate", "unifiedLoyaltyNo", "gvCode",
				"invoiceNumber", "lineItemNo", "itemCode", "categoryCode", "cluster", "quantity", "grossAmount",
				"discount", "eligibleAmount", "rrNumber", "transactionType", "reference", "discountCode", "cmDate",
				"cmNo", "brandName", "cmLocationCode", "cmLineItemNo" });

		return fieldExtractor;
	}

	private Integer getCustomerTransactionTotalRecordCount(String fileAuditId) {
		String sql = "select count(*) from ulp_customer_transaction_data_stage where file_audit_id = ?";
		return jdbcTemplate.queryForObject(sql, new Object[] { fileAuditId }, Integer.class);
	}

	private BigDecimal getTotalAmount(String fileAuditId) {
		// it should be eligible amount instead of gross_amount
		String sql = "select COALESCE (SUM(eligible_amount), 0) from ulp_customer_transaction_data_stage where file_audit_id = ?";
		BigDecimal totalAmount = jdbcTemplate.queryForObject(sql, new Object[] { fileAuditId }, BigDecimal.class);
		return totalAmount.setScale(2, RoundingMode.CEILING);
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<NcMemberDataStageDto> memberDataStagingWriter(
			@Value("#{jobExecutionContext['NcMemberDataSavedId']}") String fileAuditId) {

		String memberDataStageInsertQuery = "INSERT into ulp_member_data_stage (channel, store_code, unified_loyalty_no, transaction_date, first_name, mobile_no, email, file_audit_id) values (:channel, :storeCode, "
				+ ":unifiedLoyaltyNo, :transactionDate, :firstName, :mobileNo, :email, '" + fileAuditId + "')";
		JdbcBatchItemWriter<NcMemberDataStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(memberDataStageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<NcMemberDataStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<NcMemberDataStageDto> memberDataFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobExecutionContext['NcMemberDataSavedId']}") String fileAuditId) {
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getNetcarrotsFileName(transactionDate,
						FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue(), FileGroupEnum.NETCARROTS.toString(), true));

		// Create writer instance
		FlatFileItemWriter<NcMemberDataStageDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(memberDataLineAggregator());
		writer.setHeaderCallback(new FlatFileHeaderCallback() {
			public void writeHeader(Writer writer) throws IOException {
				writer.write("CTRL" + "," + getMemberDataTotalRecordCount(fileAuditId) + "," + "0.00");
			}
		});
		return writer;
	}

	private LineAggregator<NcMemberDataStageDto> memberDataLineAggregator() {
		DelimitedLineAggregator<NcMemberDataStageDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter(",");
		lineAggregator.setFieldExtractor(memberDataFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<NcMemberDataStageDto> memberDataFieldExtractor() {
		BeanWrapperFieldExtractor<NcMemberDataStageDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { CHANNEL, STORE_CODE, "unifiedLoyaltyNo", "transactionDate",
				"oldLoyaltyNo", "oldLoyaltyType", "firstName", "lastName", "mobileNo", "email" });

		return fieldExtractor;
	}

	private Integer getMemberDataTotalRecordCount(String fileId) {
		String sql = "select count(*) from ulp_member_data_stage where file_audit_id = ?";
		return jdbcTemplate.queryForObject(sql, new Object[] { fileId }, Integer.class);
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<NcStoreMasterStageDto> storeMasterStagingWriter(
			@Value("#{jobExecutionContext['NcStoreMasterSavedId']}") String fileAuditId) {

		String storeMasterStageQuery = "INSERT into ulp_store_master_stage (channel, store_code, store_name, store_type, city, state, region, pin_code, is_active, is_sms_enabled, transaction_date, file_audit_id) values"
				+ " (:channel, :storeCode, :storeName, :storeType, :city, :state, :region, :pinCode, :isActive, :isSmsEnabled, :transactionDate, '"
				+ fileAuditId + "')";

		JdbcBatchItemWriter<NcStoreMasterStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(storeMasterStageQuery);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<NcStoreMasterStageDto>());
		itemWriter.afterPropertiesSet();
		log.info("storeMasterStagingWriter......................................................{}",itemWriter.toString());
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<NcStoreMasterStageDto> storeMasterFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		log.info("Inside writter ......................storeMasterFileWriter with transaction date.................{}",transactionDate);
		Resource outputResource = new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getNetcarrotsFileName(transactionDate,
						FileMasterJobNameEnum.NC_STORE_DATA_JOB.getValue(), FileGroupEnum.NETCARROTS.toString(), true));

		// Create writer instance
		FlatFileItemWriter<NcStoreMasterStageDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(storeMasterLineAggregator());
		writer.setHeaderCallback(new FlatFileHeaderCallback() {
			public void writeHeader(Writer writer) throws IOException {
				writer.write("CTRL," + getStoreMatserTotalRecordCount() + ",0.00");
			}
		});
		return writer;
	}

	private LineAggregator<NcStoreMasterStageDto> storeMasterLineAggregator() {
		DelimitedLineAggregator<NcStoreMasterStageDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter(",");
		lineAggregator.setFieldExtractor(storeMasterFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<NcStoreMasterStageDto> storeMasterFieldExtractor() {
		BeanWrapperFieldExtractor<NcStoreMasterStageDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { CHANNEL, STORE_CODE, "storeName", "storeType", "city", "state", "region",
				"pinCode", "isSmsEnabled", "isActive" });

		return fieldExtractor;
	}

	private Integer getStoreMatserTotalRecordCount() {
		String sql = "select count(*) from ulp_store_master_stage";
		return jdbcTemplate.queryForObject(sql, Integer.class);
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<NcTransactionDataStageDto> transactionDataFileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		log.info("Inside transactionDataFileWriter..........with transaction date.......................{}",transactionDate);
		Resource outputResource = new FileSystemResource(
				env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(OUTPUT_FILE_PATH)
						+ fileService.getNetcarrotsFileName(transactionDate,
								FileMasterJobNameEnum.NC_NO_OF_RECORDS_DATA_JOB.getValue(),
								FileGroupEnum.NETCARROTS.toString(), true));

		// Create writer instance
		FlatFileItemWriter<NcTransactionDataStageDto> writer = new FlatFileItemWriter<>();

		// Set output file location
		writer.setResource(outputResource);

		// All job repetitions should "append" to same output file
		writer.setAppendAllowed(true);

		// Name field values sequence based on object properties
		writer.setLineAggregator(transactionDataLineAggregator());
		writer.setHeaderCallback(new FlatFileHeaderCallback() {
			public void writeHeader(Writer writer) throws IOException {
				writer.write(
						"File Shared Date, File type, File name, TransactionType, Type, StoreRecords, EpossRecords, EncircleTDfileRecords, Difference Store_Vs_Eposs, Difference Eposs_Vs_Encircle");
			}
		});
		log.info("Before returning writer...........................................{}",writer.toString());
		return writer;
	}

	private LineAggregator<NcTransactionDataStageDto> transactionDataLineAggregator() {
		DelimitedLineAggregator<NcTransactionDataStageDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter(",");
		lineAggregator.setFieldExtractor(transactionDataFieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<NcTransactionDataStageDto> transactionDataFieldExtractor() {
		BeanWrapperFieldExtractor<NcTransactionDataStageDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "fileSharedDate", "fileType", "fileName", "transactionType", "type",
				"storeRecords", "epossRecords", "encircleTdFileRecords", "diffStoreVsEposs", "diffEpossVsEncircle" });

		return fieldExtractor;
	}

}
