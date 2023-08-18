/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.PreparedStatementSetter;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.TepTransactionDto;
import com.titan.poss.file.jobs.mapper.TepTransactionDetRowMapper;
import com.titan.poss.file.jobs.mapper.TepTransactionHdrRowMapper;
import com.titan.poss.file.jobs.mapper.TepTransactionHeaderRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class TepTransactionJobReader {

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<TepTransactionDto> tepHdrTransactionReader(DataSource dataSource,
			@Value("#{jobExecutionContext['stockInterfaceTransactionId']}") String fileId,
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<TepTransactionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT    st.location_code , st.doc_date, CAST(1.5 as Decimal(10,1)) as sgst_percentage, sum(CAST((1.5 *ge.total_value)/100 as Decimal(10,2))) as sgst_value,\r\n"
				+ "CAST(1.5 as Decimal(10,1)) as cgst_percentage, sum(CAST((1.5 *ge.total_value)/100  as Decimal(10,2))) as cgst_value\r\n"
				+ "from sales.dbo.sales_transaction st inner join sales.dbo.goods_exchange ge on st.id=ge.id \r\n");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append("where ( st.status ='CONFIRMED' or st.status = 'CANCELLED' ) and st.doc_date ='" + transactionDate + "' group by  st.location_code , st.doc_date \r\n");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where ( st.status ='CONFIRMED' or st.status = 'CANCELLED' ) and st.doc_date = z.business_date and st.location_code = z.location_code group by  st.location_code , st.doc_date ");
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.TEP_TRANSACTION_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.TEP_TRANSACTION_JOB.getValue());
				}
			});
		}
		reader.setSql(sb.toString());
		reader.setRowMapper(getTepTransactionHdrRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<TepTransactionDto> tepDetTransactionReader(DataSource dataSource,
			@Value("#{jobExecutionContext['stockInterfaceTransactionId']}") String fileId,
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<TepTransactionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT ge.id, ged.row_id, ged.item_code,st.txn_type , CONVERT(DECIMAL(18,3), ged.quantity) as quantity , \r\n" + "case when \r\n"
				+ "st.txn_type ='TEP' and (ged.item_code like '1%' or ged.item_code like '2%') then ged.total_weight \r\n"
				+ "when st.txn_type ='TEP' then CONVERT(varchar,ged.quantity) \r\n" + "else ged.total_weight end as \"qty\",\r\n"
				+ "case when \r\n"
				+ "st.txn_type ='TEP' and (ged.item_code like '1%' or ged.item_code like '2%') then ged.quantity \r\n"
				+ "when st.txn_type ='TEP' then ged.total_weight \r\n" + "else ged.quantity end as \"sec_qty\",\r\n"
				+ "ged.unit_value,ged.lot_number ,\r\n"
				+ "case when st.txn_type ='TEP' then st.location_code + CONVERT(varchar,st.doc_no) +CONVERT(varchar, st.fiscal_year) +CONVERT (varchar,ged.row_id) \r\n"
				+ "else st.location_code +'GEP'+  CONVERT(varchar,st.doc_no) +CONVERT(varchar, st.fiscal_year) +CONVERT (varchar,ged.row_id) end as \"item_attribute2\",\r\n"
				+ "ged.price_details, st.metal_rate_details , ged.metal_type ,ged.final_value, ged.total_value ,\r\n" + "case when st.txn_type ='GEP' then ''\r\n"
				+ "when st.txn_type ='TEP' and (st.sub_txn_type ='FULL_VALUE_TEP' or ged.item_code like '1%') then 'Y'\r\n"
				+ "else 'N' end as \"item_attribute8\",\r\n"
				+ "case when st.txn_type ='GEP' then ged.purity\r\n"
				+ "else NULL end as \"item_attribute9\",\r\n" + "case when st.txn_type ='GEP' then 0\r\n"
				+ "else 0 end as \"item_attribute11\",\r\n" + "case when st.txn_type ='GEP' then NULL\r\n"
				+ "else JSON_VALUE(ged.price_details , '$.stonePriceDetails.stoneWeight') end as \"item_attribute12\",\r\n"
				+ "st.location_code , st.doc_date ,st.fiscal_year ,\r\n" + "ged.total_value ,ged.purity , ge.payment_type, st.sub_txn_type, \r\n"
				+ "JSON_VALUE(ged.tax_details, '$.data.IGST.taxPercentage') as \"igst_percentage\",\r\n"
				+ "JSON_VALUE(ged.tax_details, '$.data.IGST.taxValue') as \"igst_value\",\r\n"
				+ "case when st.txn_type ='GEP' or (st.txn_type ='TEP' and (st.sub_txn_type ='NEW_TEP' or st.sub_txn_type ='MANUAL_TEP' )) then 1.5  \r\n" //temporarily hardcoded tax % and value for regular TEP based on kathir feedback
				+ "		else JSON_VALUE(ged.tax_details, '$.data.SGST.taxPercentage') end as sgst_percentage,\r\n"
				+ "case when st.txn_type ='GEP' or (st.txn_type ='TEP' and (st.sub_txn_type ='NEW_TEP' or st.sub_txn_type ='MANUAL_TEP' )) then CAST((1.5 *ged.total_value)/100 as Decimal(10,2))\r\n"
				+ "		else JSON_VALUE(ged.tax_details, '$.data.SGST.taxValue') end as sgst_value,\r\n"
				+ "case when st.txn_type ='GEP' or (st.txn_type ='TEP' and (st.sub_txn_type ='NEW_TEP' or st.sub_txn_type ='MANUAL_TEP' )) then 1.5  \r\n"
				+ "		else JSON_VALUE(ged.tax_details, '$.data.CGST.taxPercentage') end as cgst_percentage,\r\n"
				+ "case when st.txn_type ='GEP' or (st.txn_type ='TEP' and (st.sub_txn_type ='NEW_TEP' or st.sub_txn_type ='MANUAL_TEP' )) then CAST((1.5 *ged.total_value)/100 as Decimal(10,2))\r\n"
				+ "		else JSON_VALUE(ged.tax_details, '$.data.CGST.taxValue') end as cgst_value,\r\n"
				+ "JSON_VALUE(ged.tax_details, '$.data.UTGST.taxPercentage') as \"utgst_percentage\",\r\n"
				+ "JSON_VALUE(ged.tax_details, '$.data.UTGST.taxValue') as \"utgst_value\"\r\n"
				+ "from sales.dbo.sales_transaction st inner join sales.dbo.goods_exchange ge on st.id=ge.id \r\n"
				+ "inner join sales.dbo.goods_exchange_details ged on ge.id=ged.goods_exchange_id");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append("where ( st.status ='CONFIRMED' or st.status = 'CANCELLED' ) and st.doc_date ='" + transactionDate);
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where ( st.status ='CONFIRMED' or st.status = 'CANCELLED' ) and st.doc_date = z.business_date and st.location_code = z.location_code");
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.TEP_TRANSACTION_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.TEP_TRANSACTION_JOB.getValue());
				}
			});
		}
		reader.setSql(sb.toString());
		reader.setRowMapper(getTepTransactionDetRowMapper());
		return reader;
	}

	@Bean
	TepTransactionHeaderRowMapper getTepTransactionHdrRowMapper() {
		return new TepTransactionHeaderRowMapper();
	}
	
	@Bean
	TepTransactionDetRowMapper getTepTransactionDetRowMapper() {
		return new TepTransactionDetRowMapper();
	}

}
