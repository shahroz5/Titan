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

import com.titan.poss.file.dto.CustomerDecryptDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ReportDecryptJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<CustomerDecryptDto> decrpytCustomerJobWriter(
			@Value("#{jobParameters['reportId']}") String reportId,
			@Qualifier("reportDataSource") DataSource dataSource) {

		JdbcBatchItemWriter<CustomerDecryptDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into reports.dbo.customer_master_temp (id,mobile_number, customer_name,ulp_id, cust_tax_no,report_id)"
						+ " values (:customerId, :customerMobileNumber, :customerName, :customerUlpId, :customerTaxNo, '"
						+ reportId + "')");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<CustomerDecryptDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
