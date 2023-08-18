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

import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GiftVoucherExtendValidityJobWriter {

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherExtendValidityIngestionDto> giftVoucherExtendValidityIngestionWriter(DataSource dataSource) {

		JdbcBatchItemWriter<GiftVoucherExtendValidityIngestionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"UPDATE payments.dbo.gift_master SET valid_till = :validTill,validity_days = DATEDIFF(Day, payments.dbo.gift_master.valid_from, :validTill), last_modified_by =:lastModifiedBy, last_modified_date =:lastModifiedDate, extend_count = (payments.dbo.gift_master.extend_count + 1) WHERE serial_no = :serialNo ");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherExtendValidityIngestionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<GiftVoucherExtendValidityIngestionDto> giftVoucherExtendValidityStagingWriter(
			DataSource dataSource) {

		JdbcBatchItemWriter<GiftVoucherExtendValidityIngestionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql("Insert into gift_voucher_extend_validity_stage values (:serialNo,:validTill,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GiftVoucherExtendValidityIngestionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
