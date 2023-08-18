/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigWriterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ComplexityPriceGroupMappingJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<ComplexityPriceGroupConfigWriterDto> complexityPriceGroupMappingIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<ComplexityPriceGroupConfigWriterDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM products.dbo.complexity_price_group_mapping"
				+ " where complexity_code = :complexityCode AND price_group = :priceGroup)Insert into products.dbo.complexity_price_group_mapping"
				+ " (id,complexity_code,price_group,making_charge_punit,making_charge_pgram,wastage_pct,making_charge_pct,is_active,created_by, created_date, last_modified_by, last_modified_date, currency_code,src_sync_id,dest_sync_id,correlation_id)"
				+ " values (:id, :complexityCode,:priceGroup, :makingChargePunit, :makingChargePgram, :wastagePct, :makingChargePct,:isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :currencyCode,:srcSyncId, :destSyncId, :fileAuditId)"
				+ " ELSE " + "UPDATE products.dbo.complexity_price_group_mapping set making_charge_punit = :makingChargePunit,"
				+ " making_charge_pgram = :makingChargePgram,wastage_pct=:wastagePct,making_charge_pct=:makingChargePct,is_active = :isActive,last_modified_by =:lastModifiedBy,"
				+ " last_modified_date =:lastModifiedDate, src_sync_id = (complexity_price_group_mapping.src_sync_id + 1), correlation_id = :fileAuditId where complexity_code = :complexityCode AND price_group = :priceGroup;");
//		itemWriter.setSql(
//				"Insert into products.dbo.complexity_price_group_mapping (id,complexity_code,price_group,"
//				+ "making_charge_punit,making_charge_pgram,wastage_pct,making_charge_pct,is_active,"
//				+ "created_by, created_date, last_modified_by, last_modified_date, currency_code,src_sync_id,"
//				+ " dest_sync_id,correlation_id) values (:id, :complexityCode,:priceGroup, "
//				+ ":makingChargePunit, :makingChargePgram, :wastagePct, :makingChargePct, "
//				+ ":isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :currencyCode,"
//				+ " :srcSyncId, :destSyncId, :fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ComplexityPriceGroupConfigWriterDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<ComplexityPriceGroupConfigReaderDto> complexityPriceGroupMappingStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<ComplexityPriceGroupConfigReaderDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into complexity_price_group_mapping_stage (id, complexity_code, price_group, "
				+ "making_charge_punit, making_charge_pgram, wastage_pct ,making_charge_pct,is_active, "
				+ "created_by,created_date,last_modified_by, last_modified_date,src_sync_id,dest_sync_id,"
				+ "file_audit_id) values (NEWID(), :complexitycode, :pricegroup, :makingChargesPerUnit,"
				+ ":makingchargespergram,:wastagepercentage,:makingChargePercentage ,:isActive,:createdBy, "
				+ ":createdDate, :lastModifiedBy, :lastModifiedDate,:srcSyncId,:destSyncId,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ComplexityPriceGroupConfigReaderDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
