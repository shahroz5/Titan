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

import com.titan.poss.file.dto.PaymentHostnameMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class PaymentHostnameMappingJobWriter {

	@Bean()
	public ItemWriter<PaymentHostnameMappingDto> paymentHostnameMappingIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<PaymentHostnameMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM payments.dbo.payment_hostname_mapping"
				+ " where location_code = :locationCode AND host_name = :hostName AND payment_code = :paymentCode)Insert into payments.dbo.payment_hostname_mapping"
				+ " (id, location_code, host_name, device_id, payment_code, is_active, created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id)"
				+ " values (:id, :locationCode,:hostName, :deviceId, :paymentCode, :isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId )"
				+ " ELSE " + "UPDATE payments.dbo.payment_hostname_mapping set device_id = :deviceId,"
				+ " is_active = :isActive,last_modified_by =:lastModifiedBy,"
				+ " last_modified_date =:lastModifiedDate, src_sync_id = (payment_hostname_mapping.src_sync_id + 1), correlation_id = :fileAuditId where location_code = :locationCode AND host_name = :hostName AND payment_code = :paymentCode;");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<PaymentHostnameMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<PaymentHostnameMappingDto> paymentHostnameMappingStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<PaymentHostnameMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into payment_hostname_mapping_stage (id,location_code,host_name,device_id,payment_code,is_active,created_by,created_date,last_modified_by,last_modified_date,file_audit_id) values (NEWID(),:locationCode,:hostName,:deviceId, :paymentCode, :isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<PaymentHostnameMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
