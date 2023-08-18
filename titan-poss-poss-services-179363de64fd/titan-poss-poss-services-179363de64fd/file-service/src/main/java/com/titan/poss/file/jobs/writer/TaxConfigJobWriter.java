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

import com.titan.poss.file.dto.TaxConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class TaxConfigJobWriter {
	
	@Bean()
	public ItemWriter<TaxConfigDto> taxConfigIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<TaxConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM locations.dbo.tax_configs"
				+ " where txn_type = :transactionType AND src_location_type = :sourceBtqType AND dest_location_type = :destinationBtqType AND customer_type = :customerType AND is_same_state = :isSameState)Insert into locations.dbo.tax_configs"
				+ " (id, txn_type, src_location_type, dest_location_type, customer_type, is_same_state, src_tax_applicable, applicable_tax, is_active,src_location_applicable_tax, dest_location_applicable_tax, created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id )"
				+ " values (:id, :transactionType, :sourceBtqType, :destinationBtqType, :customerType, :isSameState, :isSourceBtqTaxApplicable, :applicableTax, :isActive, :srcLocationApplicableTax, :destLocationApplicableTax, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId)"
				+ " ELSE "
				+ " UPDATE locations.dbo.tax_configs set id = :id, txn_type = :transactionType, src_location_type = :sourceBtqType, dest_location_type = :destinationBtqType, customer_type = :customerType, is_same_state = :isSameState, src_tax_applicable = :isSourceBtqTaxApplicable, applicable_tax = :applicableTax,"
				+ " is_active = :isActive,src_location_applicable_tax = :srcLocationApplicableTax,dest_location_applicable_tax = :destLocationApplicableTax,created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,"
				+ " last_modified_date =:lastModifiedDate,src_sync_id = (tax_configs.src_sync_id + 1), dest_sync_id =:destSyncId, correlation_id = :fileAuditId where txn_type = :transactionType AND src_location_type = :sourceBtqType AND dest_location_type = :destinationBtqType AND customer_type = :customerType AND is_same_state = :isSameState ;");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<TaxConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<TaxConfigDto> taxConfigStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<TaxConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into tax_configs_stage (id, transaction_type, source_btq_type, destination_btq_type, customer_type, src_location_applicable_tax, dest_location_applicable_tax, customer_applicable_tax, is_same_state, is_source_btq_tax_applicable, applicable_tax, is_active ,created_by,created_date,last_modified_by, last_modified_date, file_audit_id) values (NEWID(), :transactionType, :sourceBtqType, :destinationBtqType, :customerType, :srcLocationApplicableTax, :destLocationApplicableTax, :customerApplicableTax, :isSameState, :isSourceBtqTaxApplicable, :applicableTax, :isActive ,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<TaxConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}