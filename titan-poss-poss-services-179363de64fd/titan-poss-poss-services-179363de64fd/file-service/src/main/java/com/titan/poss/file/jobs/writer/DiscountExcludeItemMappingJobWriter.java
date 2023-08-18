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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class DiscountExcludeItemMappingJobWriter {

	@Bean()
	public ItemWriter<DiscountExcludeItemMappingDto> discountExcludeItemMappingIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<DiscountExcludeItemMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"IF NOT EXISTS (SELECT * FROM configs.dbo.discount_exclude_mapping where discount_id = :discountId AND"
						+ " item_code = :itemCode)Insert into configs.dbo.discount_exclude_mapping"
						+ " (id,discount_id,item_code,theme_code, is_excluded, exclude_type,created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id, is_active) "
						+ "values (:id, :discountId ,:itemCode, :themeCode,:isExcluded, :excludeType , :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId, :isExcluded)"
						+ " ELSE"
						+ " UPDATE configs.dbo.discount_exclude_mapping set discount_id = :discountId, item_code = :itemCode ,"
						+ " theme_code = :themeCode,is_excluded = :isExcluded, created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,"
						+ " last_modified_date =:lastModifiedDate, src_sync_id = (discount_exclude_mapping.src_sync_id + 1), dest_sync_id =:destSyncId, correlation_id=:fileAuditId, is_active=:isExcluded where discount_id = :discountId AND item_code = :itemCode ;");

		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<DiscountExcludeItemMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<DiscountExcludeItemMappingDto> discountExcludeItemMappingStagingWriter(
			@Value("#{jobParameters['discountId']}") String discountId, DataSource dataSource) {

		JdbcBatchItemWriter<DiscountExcludeItemMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into discount_exclude_item_mapping_stage (id,discount_id,item_code,is_excluded,created_by,created_date,last_modified_by,last_modified_date,file_audit_id) values (NEWID(),'"
						+ discountId
						+ "',:itemCode,:isExcluded,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<DiscountExcludeItemMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
