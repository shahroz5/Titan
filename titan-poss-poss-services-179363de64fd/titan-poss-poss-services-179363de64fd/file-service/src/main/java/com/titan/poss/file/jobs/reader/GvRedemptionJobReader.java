/*  
s * Copyright 2019. Titan Company Limited
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
import com.titan.poss.file.dto.GvRedemptionDto;
import com.titan.poss.file.jobs.mapper.GvRedemptionFileStepMapper;
import com.titan.poss.file.jobs.mapper.GvRedemptionRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class GvRedemptionJobReader {

	@Autowired
	private DataSource dataSource;

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GvRedemptionDto> gvRedemptionStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {

		JdbcCursorItemReader<GvRedemptionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select confirmed_time ,txn_type ,doc_no ,pd.instrument_no ,pd.amount, st.location_code, lm.owner_type, pd.reference_2 from sales.dbo.sales_transaction st inner join sales.dbo.payment_details pd on st.id = pd.sales_txn_id \r\n"
					+ "inner join locations.dbo.location_master lm\r\n"
					+ "on st.location_code = lm.location_code where st.txn_type in ('CM', 'ADV') and pd.payment_code ='GIFT VOUCHER' and st.status ='CONFIRMED' "
					+ " and pd.status ='COMPLETED' and st.doc_date = '" + transactionDate + "'";
		} else {
			sql = "select confirmed_time,txn_type ,doc_no ,pd.instrument_no ,pd.amount ,st.location_code, lm.owner_type, pd.reference_2 \r\n"
					+ "from sales.dbo.sales_transaction st, sales.dbo.payment_details pd,locations.dbo.location_master lm,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.location_code =z.location_code and st.id = pd.sales_txn_id and st.location_code = lm.location_code and st.txn_type in ('CM', 'ADV') \r\n"
					+ "and pd.payment_code ='GIFT VOUCHER' and st.status ='CONFIRMED' and pd.status ='COMPLETED' and st.doc_date = z.business_date;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGvRedemptionRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GvRedemptionDto> gvRedemptionFileReader(
			@Value("#{jobExecutionContext['gvRedemptionTransactionId']}") String fileId) {
		JdbcCursorItemReader<GvRedemptionDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from gv_redemption_stage where file_id ='" + fileId + "'");
		reader.setRowMapper(getGvRedemptionFileStepMapper());
		return reader;
	}

	@Bean
	public GvRedemptionRowMapper getGvRedemptionRowMapper() {
		return new GvRedemptionRowMapper();
	}

	@Bean
	public GvRedemptionFileStepMapper getGvRedemptionFileStepMapper() {
		return new GvRedemptionFileStepMapper();
	}
}
