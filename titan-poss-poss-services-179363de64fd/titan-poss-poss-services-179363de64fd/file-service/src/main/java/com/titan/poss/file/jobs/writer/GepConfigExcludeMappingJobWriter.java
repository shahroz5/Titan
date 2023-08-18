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

import com.titan.poss.file.dto.GepConfigExcludeMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GepConfigExcludeMappingJobWriter {

	
	@Bean()
	public ItemWriter<GepConfigExcludeMappingDto> gepConfigExcludeMappingIngestionWriter(
			DataSource dataSource) {
		JdbcBatchItemWriter<GepConfigExcludeMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"IF NOT EXISTS (SELECT * FROM configs.dbo.exchange_config_exclude_mapping where config_id = :configId AND"
						+ " item_code = :itemCode)Insert into configs.dbo.exchange_config_exclude_mapping"
						+ " (id,config_id,item_code,theme_code, is_excluded,created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id) "
						+ "values (:id, :configId ,:itemCode, :themeCode,:isExcluded, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :fileAuditId)"
						+ " ELSE"
						+ " UPDATE configs.dbo.exchange_config_exclude_mapping set id= :id, config_id = :configId, item_code = :itemCode ,"
						+ " theme_code = :themeCode,is_excluded = :isExcluded, created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,"
						+ " last_modified_date =:lastModifiedDate, src_sync_id = (exchange_config_exclude_mapping.src_sync_id + 1), dest_sync_id =:destSyncId, correlation_id = :fileAuditId where config_id = :configId AND item_code = :itemCode ;");

		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GepConfigExcludeMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<GepConfigExcludeMappingDto> gepConfigExcludeMappingStagingWriter(
			@Value("#{jobParameters['configId']}") String configId, DataSource dataSource) {

		JdbcBatchItemWriter<GepConfigExcludeMappingDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into gep_config_exclude_mapping_stage (id,config_id,item_code,is_excluded,created_by,created_date,last_modified_by,last_modified_date,file_audit_id) values (NEWID(),'"
						+ configId
						+ "',:itemCode,:isExcluded,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<GepConfigExcludeMappingDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}