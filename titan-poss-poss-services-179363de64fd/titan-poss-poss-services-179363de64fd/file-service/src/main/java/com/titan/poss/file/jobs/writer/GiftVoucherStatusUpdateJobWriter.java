/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherStatusUpdateJobWriter {

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherStatusUpdateIngestionDto> giftVoucherStatusUpdateIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<GiftVoucherStatusUpdateIngestionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"UPDATE payments.dbo.gift_master SET status = :status,last_modified_by =:lastModifiedBy, last_modified_date =:lastModifiedDate "
						+ "  WHERE serial_no = :serialNo");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherStatusUpdateIngestionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherStatusUpdateIngestionDto> giftVoucherStatusUpdateStagingWriter(
			DataSource dataSource) {
		JdbcBatchItemWriter<GiftVoucherStatusUpdateIngestionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into gift_voucher_status_update_stage values (:serialNo,:status,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherStatusUpdateIngestionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
