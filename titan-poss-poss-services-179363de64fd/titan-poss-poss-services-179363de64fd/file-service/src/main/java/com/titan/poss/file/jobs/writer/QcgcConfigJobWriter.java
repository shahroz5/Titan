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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.file.dto.QcgcConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class QcgcConfigJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<QcgcConfigDto> qcgcConfigIngestionWriter(@Value("#{jobParameters['user']}") String user,
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId) {

		JdbcBatchItemWriter<QcgcConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(integrationDataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM vendor_configs where vendor_code = '"
				+ VendorCodeEnum.QC_GC.toString() + "' and location_code = :locationCode) "
				+ "Insert into vendor_configs (config_id, vendor_code, location_code, org_code, config_details, is_active, created_by, created_date, last_modified_by, last_modified_date, correlation_id) values (NEWID(), '"
				+ VendorCodeEnum.QC_GC.toString() + "', :locationCode, '" + CommonConstants.ORG_CODE
				+ "', :configDetails, :isActive, '" + user + "', :createdDate, '" + user + "', :lastModifiedDate, '"
				+ fileAuditId + "') ELSE "
				+ "UPDATE vendor_configs set config_details = :configDetails, last_modified_by = '" + user
				+ "', last_modified_date = :lastModifiedDate, src_sync_id=vendor_configs.src_sync_id+1, correlation_id = '" + fileAuditId
				+ "'  where location_code = :locationCode and vendor_code = '" + VendorCodeEnum.QC_GC.toString() + "'");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<QcgcConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<QcgcConfigDto> qcgcConfigStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<QcgcConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into qcgc_config_stage(location_code,terminal_id,created_by,created_date,last_modified_by,last_modified_date,file_id)"
						+ " values (:locationCode, :terminalId, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :fileId)");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<QcgcConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
