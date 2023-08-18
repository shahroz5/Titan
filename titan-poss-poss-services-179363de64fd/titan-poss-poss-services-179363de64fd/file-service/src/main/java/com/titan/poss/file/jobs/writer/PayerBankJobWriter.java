/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.PayerBankDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PayerBankJobWriter {

	@Bean()
	public ItemWriter<PayerBankDto> payerBankIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<PayerBankDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM payments.dbo.payer_bank_master"
				+ " where bank_name = :bankName)Insert into payments.dbo.payer_bank_master"
				+ " (bank_name,is_active,created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id,correlation_id)"
				+ " values (:bankName, :isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId)"
				+ " ELSE " + "UPDATE payments.dbo.payer_bank_master set bank_name = :bankName ,"
				+ " is_active = :isActive,created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,"
				+ " last_modified_date =:lastModifiedDate,src_sync_id = (payer_bank_master.src_sync_id + 1), dest_sync_id =:destSyncId, correlation_id = :fileAuditId where bank_name = :bankName ;");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<PayerBankDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<PayerBankDto> payerBankStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<PayerBankDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into payer_bank_stage (bank_name, is_active,created_by,created_date,last_modified_by, last_modified_date, file_audit_id) values (:bankName,:isActive,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<PayerBankDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
