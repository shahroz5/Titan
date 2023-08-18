/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.GiftVoucherIndentStageDto;
import com.titan.poss.file.dto.GiftVoucherStatusStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftMasterJobWriter {

	@Autowired
	private DataSource dataSource;

	private static final String GIFT_VOUCHER_INDENT_INSERT_QUERY = "Insert into gift_voucher_indent_stage (item_code, gv_serial_no, issued_to, region,indent_no,customer_name, customer_type, denomination,quantity,total_value, status, transition_status, gift_details, gv_creation_date, location_code,discount,"
			+ " remarks, excludes, discount_percentage, validity_days,created_by, created_date, last_modified_by, last_modified_date, file_audit_id) values (:itemCode, :gvSerialNo, :issuedTo, :region, :indentNo, :customerName, :customerType, :denomination, :quantity, :totalValue, :status, :transitionStatus, :giftDetails, "
			+ ":gvCreationDate, :locationCode, :discount, :remarks, :excludes, :discountPercentage, :validityDays, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :fileAuditId)";

	private static final String GIFT_VOUCHER_STATUS_INSERT_QUERY = "Insert into gift_voucher_status_stage (gv_serial_no, gv_status, transition_status, act_blocked_date, valid_from, valid_till, validity_days,created_by, created_date, last_modified_by, last_modified_date, file_audit_id) values (:gvSerialNo, :gvStatus, :transitionStatus, :actBlockedDate, :validFrom,"
			+ " :validTill,:validityDays, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :fileAuditId)";

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherIndentStageDto> giftVoucherIndentStagingWriter() {

		JdbcBatchItemWriter<GiftVoucherIndentStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(GIFT_VOUCHER_INDENT_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherIndentStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherStatusStageDto> giftVoucherStatusStagingWriter() {

		JdbcBatchItemWriter<GiftVoucherStatusStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(GIFT_VOUCHER_STATUS_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherStatusStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
}
