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
import com.titan.poss.file.dto.RazorpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class RazorpayConfigJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<RazorpayConfigDto> razorpayConfigIngestionWriter(
			@Qualifier("configIntgDataSource") DataSource integrationDataSource,
			@Value("#{jobParameters['fileAuditId']}") String fileAuditId) {

		JdbcBatchItemWriter<RazorpayConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(integrationDataSource);
		itemWriter.setSql("IF NOT EXISTS (SELECT * FROM vendor_configs where vendor_code = '"
				+ VendorCodeEnum.PAYMENT_RAZORPAY.toString() + "' and location_code = :locationCode) "
				+ "Insert into vendor_configs (config_id, vendor_code, location_code, org_code, config_details, is_active, created_by, created_date, last_modified_by, last_modified_date, correlation_id) values (NEWID(), '"
				+ VendorCodeEnum.PAYMENT_RAZORPAY.toString() + "', :locationCode, '" + CommonConstants.ORG_CODE
				+ "', :configDetails, :isActive, :createdBy, :createdDate, ':lastModifiedBy', :lastModifiedDate, '"
				+ fileAuditId + "') ELSE "
				+ "UPDATE vendor_configs set config_details = :configDetails, last_modified_by = :lastModifiedBy, src_sync_id=vendor_configs.src_sync_id+1, last_modified_date = :lastModifiedDate, correlation_id = '"
				+ fileAuditId + "'  where location_code = :locationCode and vendor_code = '"
				+ VendorCodeEnum.PAYMENT_RAZORPAY.toString() + "'");
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<RazorpayConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public ItemWriter<RazorpayConfigDto> razorpayConfigStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<RazorpayConfigDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into razorpay_config_stage values (:locationCode, :accountId, :fileAuditId, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate)");
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<RazorpayConfigDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
