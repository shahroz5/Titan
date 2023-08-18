/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.CustomerDecryptDto;
import com.titan.poss.file.jobs.mapper.CustomerDecryptRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class ReportDecryptJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<CustomerDecryptDto> customerDecryptReader(@Value("#{jobParameters['sql']}") String sql,
			@Qualifier("reportDataSource") DataSource dataSource) {

		JdbcCursorItemReader<CustomerDecryptDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder query = new StringBuilder(
				"Select cm.id as customer_id, cm.customer_name as customer_name, cm.ulp_id as customer_ulp_id, cm.mobile_number as customer_mobile_number, cm.cust_tax_no as customer_tax_no from reports.dbo.customer_master cm where cm.id in (");
		query.append(sql);
		query.append(")");
		reader.setSql(query.toString());
		reader.setRowMapper(getCustomerDecryptRowMapper());
		return reader;
	}

	@Bean
	public CustomerDecryptRowMapper getCustomerDecryptRowMapper() {
		return new CustomerDecryptRowMapper();
	}

}
