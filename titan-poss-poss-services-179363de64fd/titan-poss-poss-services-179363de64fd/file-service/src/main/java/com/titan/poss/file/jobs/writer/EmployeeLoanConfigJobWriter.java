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
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;

/**
 * n
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class EmployeeLoanConfigJobWriter {

	@Bean()
	public ItemWriter<EmployeeLoanConfigWriterDto> employeeLoanStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<EmployeeLoanConfigWriterDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into employee_loan_stage (id, employee_name,employee_code,mobile_no,amount_eligibility,approval_date,"
						+ "product_grp_codes,location_codes,redeemability,otp_required,margin,validaity_date,created_by,created_date,last_modified_by,"
						+ " last_modified_date, file_audit_id) values (NEWID(),:employeeName,:employeeCode, :mobileNo, :amountEligibility,:approvalDate,"
						+ ":productGrpCodes,:locationCodes,:redeemability,:otpRequired,:margin,:validaityDate,:createdBy, :createdDate, "
						+ ":lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<EmployeeLoanConfigWriterDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	// This is custom query
//		@Bean(destroyMethod = "")
//		@StepScope
//		public ItemWriter<EmployeePaymentConfigDao> employeeLoanConfigPaymentIngestionWriter(/*
//																					 * @Value("#{jobParameters['user']}")
//																					 * String user,
//																					 */
//				DataSource integrationDataSource
//				/*@Value("#{jobParameters['fileAuditId']}") String fileAuditId*/) {
	//
//			JdbcBatchItemWriter<EmployeePaymentConfigDao> itemWriter = new JdbcBatchItemWriter<>();
//			itemWriter.setDataSource(integrationDataSource);
//			itemWriter.setSql("IF NOT EXISTS (SELECT * from payments.dbo.employee_payment_config where employee_code=:employeeCode and approval_date BETWEEN :approvalDate and :validityDate)"
//					+ "INSERT INTO payments.dbo.employee_payment_config (id, approval_date, employee_code, created_by, created_date, last_modified_by,last_modified_date, eligible_amount, expiry_date," + 
//					"employee_details,status,config_type, redeemed_amount) values (NEWID(),:approvalDate,:employeeCode,:createdBy,:createdDate,:lastModifiedBy,:lastModifiedDate,:eligibleAmount,:validityDate,:employeeDetails,'OPEN','EMPLOYEE_LOAN',0)");
//			itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<EmployeePaymentConfigDao>());
//			itemWriter.afterPropertiesSet();
//			return itemWriter;
//		}
	//
//		@Bean(destroyMethod = "")
//		@StepScope
//		public ItemWriter<EmployeeProductMappingDao> employeeLoanConfigProductIngestionWriter(
//				DataSource integrationDataSource) {
	//
//			JdbcBatchItemWriter<EmployeeProductMappingDao> itemWriter = new JdbcBatchItemWriter<>();
//			itemWriter.setDataSource(integrationDataSource);
//			itemWriter
//					.setSql(
//							  "IF NOT EXISTS (SELECT * from payments.dbo.employee_product_mapping where employee_id=:employeePaymentConfig and product_group_code=:productGroupCode)"		 
//					 +" INSERT INTO payments.dbo.employee_product_mapping (id, employee_id, product_group_code, created_by, created_date, last_modified_by,last_modified_date)" + 
//					 " values (NEWID(),:employeePaymentConfig,:productGroupCode,:createdBy,:createdDate,:lastModifiedBy,:lastModifiedDate");
//			itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<EmployeeProductMappingDao>());
//			itemWriter.afterPropertiesSet();
//			return itemWriter;
//		}
	//
	//
//		@Bean(destroyMethod = "")
//		@StepScope
//		public ItemWriter<EmployeeLocationMappingDao> employeeLoanConfigLocationIngestionWriter(
//				DataSource integrationDataSource) {
	//
//			JdbcBatchItemWriter<EmployeeLocationMappingDao> itemWriter = new JdbcBatchItemWriter<>();
//			itemWriter.setDataSource(integrationDataSource);
//			itemWriter.setSql("IF NOT EXISTS (SELECT * from payments.dbo.employee_location_mapping where employee_id=:employeePaymentConfig and location_code = :locationCode)"
//					+ "INSERT INTO payments.dbo.employee_location_mapping (id, employee_id, location_code, created_by, created_date, last_modified_by,last_modified_date)" + 
//					" values (NEWID(),:employeePaymentConfig,:locationCode,:createdBy,:createdDate,:lastModifiedBy,:lastModifiedDate)");
//			itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<EmployeeLocationMappingDao>());
//			itemWriter.afterPropertiesSet();
//			return itemWriter;
//		}

}
