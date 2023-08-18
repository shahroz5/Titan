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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.PreparedStatementSetter;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.BoutiqueRevenueDto;
import com.titan.poss.file.jobs.mapper.BoutiqueRevenueFileStepMapper;
import com.titan.poss.file.jobs.mapper.BoutiqueRevenueRowMapper;
import com.titan.poss.file.jobs.mapper.BoutiqueRevenueEghsRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class BoutiqueRevenueJobReader {

	@Autowired
	private DataSource dataSource;

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueRevenueDto> boutiqueRevenueStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<BoutiqueRevenueDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select sum(pd.amount) as amount ,  pm.oracle_mapping , max(st.doc_date) as doc_date, st.location_code , max(pd.currency_code ) as currency_code,max(JSON_VALUE(banking_details ,'$.data.sapCode')) as sap_code from sales.dbo.sales_transaction "
					+ "st inner join locations.dbo.location_master lm on st.location_code = lm.location_code \r\n"
					+ "inner join sales.dbo.payment_details pd on st.id = pd.sales_txn_id inner join payments.dbo.payment_master pm on pd.payment_code = pm.payment_code where st.status in ('CONFIRMED','CANCELLED') and  pd.status='COMPLETED' and st.sub_txn_type != 'GIFT_SALE' and st.doc_date = '"
					+ transactionDate
					+ "' and lm.owner_type in ('L1', 'L2') and pm.oracle_mapping != 'GHSEVOUCHER' and st.txn_type ='CM' group by pm.oracle_mapping, st.location_code , st.doc_date ;";
		} else {
			sql = "select sum(pd.amount ) as amount,  pm.oracle_mapping , max(st.doc_date)as doc_date , st.location_code, max(pd.currency_code ) as currency_code,max(JSON_VALUE(banking_details ,'$.data.sapCode'))  as sap_code  \r\n"
					+ "from sales.dbo.sales_transaction st, locations.dbo.location_master lm, sales.dbo.payment_details pd, payments.dbo.payment_master pm,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.status in ('CONFIRMED','CANCELLED') and  pd.status='COMPLETED' and st.sub_txn_type != 'GIFT_SALE' and st.location_code = lm.location_code and st.id = pd.sales_txn_id and pm.oracle_mapping != 'GHSEVOUCHER' and lm.owner_type in ('L1', 'L2')\r\n"
					+ "and pm.payment_code =pd.payment_code and st.txn_type ='CM' and st.location_code =z.location_code  and  st.doc_date = z.business_date group by pm.oracle_mapping, st.location_code , z.location_code , z.business_date  ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.BOUTIQUE_REVENUE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.BOUTIQUE_REVENUE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getBoutiqueRevenueRowMapper());
		return reader;
	}

	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueRevenueDto> boutiqueRevenueEghsStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<BoutiqueRevenueDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select pd.amount as amount ,  pm.oracle_mapping , st.doc_date as doc_date, st.location_code , \r\n"
					+ "pd.currency_code  as currency_code,JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code, pd.instrument_no , st.doc_no \r\n"
					+ "from sales.dbo.sales_transaction \r\n"
					+ "	st inner join locations.dbo.location_master lm on st.location_code = lm.location_code \r\n"
					+ "	inner join sales.dbo.payment_details pd on st.id = pd.sales_txn_id \r\n"
					+ "	inner join payments.dbo.payment_master pm on pd.payment_code = pm.payment_code \r\n"
					+ "	where st.status in ('CONFIRMED','CANCELLED')  and  pd.status='COMPLETED' and st.sub_txn_type != 'GIFT_SALE' and st.doc_date = '" + transactionDate +"' \r\n"
					+ "	and pm.oracle_mapping = 'GHSEVOUCHER' and \r\n"
					+ "	lm.owner_type in ('L1', 'L2') and st.txn_type ='CM'";
					
		} else {
			sql = "select pd.amount as amount ,  pm.oracle_mapping , st.doc_date as doc_date, st.location_code , \r\n"
					+ "pd.currency_code  as currency_code,JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code, pd.instrument_no , st.doc_no \r\n"
					+ "from sales.dbo.sales_transaction \r\n"
					+ "	st inner join locations.dbo.location_master lm on st.location_code = lm.location_code \r\n"
					+ "	inner join sales.dbo.payment_details pd on st.id = pd.sales_txn_id \r\n"
					+ "	inner join payments.dbo.payment_master pm on pd.payment_code = pm.payment_code,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.status in ('CONFIRMED','CANCELLED') and  pd.status='COMPLETED' and st.sub_txn_type != 'GIFT_SALE' and st.location_code = lm.location_code and st.id = pd.sales_txn_id and lm.owner_type in ('L1', 'L2')\r\n"
					+ "and pm.oracle_mapping = 'GHSEVOUCHER' and pm.payment_code =pd.payment_code and st.txn_type ='CM' and st.location_code =z.location_code  and  st.doc_date = z.business_date ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.BOUTIQUE_REVENUE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.BOUTIQUE_REVENUE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getBoutiqueRevenueEghsRowMapper());
		return reader;
	}
	
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueRevenueDto> boutiqueRevenueFileReader(
			@Value("#{jobExecutionContext['boutiqueRevenueTransactionId']}") String fileId) {
		JdbcCursorItemReader<BoutiqueRevenueDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from boutique_revenue_stage where file_id ='" + fileId + "' order by attribute5");
		reader.setRowMapper(getBoutiqueRevenueFileStepMapper());
		return reader;
	}

	@Bean
	public BoutiqueRevenueRowMapper getBoutiqueRevenueRowMapper() {
		return new BoutiqueRevenueRowMapper();
	}
	
	@Bean
	public BoutiqueRevenueEghsRowMapper getBoutiqueRevenueEghsRowMapper() {
		return new BoutiqueRevenueEghsRowMapper();
	}

	@Bean
	public BoutiqueRevenueFileStepMapper getBoutiqueRevenueFileStepMapper() {
		return new BoutiqueRevenueFileStepMapper();
	}
}