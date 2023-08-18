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

import com.titan.poss.file.dto.ProductPriceMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ProductPriceMappingJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<ProductPriceMappingDto> productPriceMappingIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<ProductPriceMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into products.dbo.product_price_mapping (id,product_group_code,from_band,to_band,from_price,to_price,margin,created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id) values (:id, :productGroupCode,:fromBand, :toBand, :fromPrice, :toPrice, :margin, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ProductPriceMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<ProductPriceMappingDto> productPriceMappingStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<ProductPriceMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into product_price_mapping_stage (id, product_group_code, from_band, to_band, from_price, to_price ,margin, created_by,created_date,last_modified_by, last_modified_date, file_audit_id) values (NEWID(), :productGroupCode, :fromBand, :toBand,:fromPrice,:toPrice,:margin,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ProductPriceMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
