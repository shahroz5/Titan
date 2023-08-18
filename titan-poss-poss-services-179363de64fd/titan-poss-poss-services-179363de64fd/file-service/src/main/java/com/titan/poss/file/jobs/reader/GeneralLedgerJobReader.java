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
import com.titan.poss.file.dto.GeneralLedgerDto;
import com.titan.poss.file.jobs.mapper.GeneralLedgerAdvanceReceivedRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerBankingEntryRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerCreditNoteReceiveL3RowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerCreditNoteReceiveRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerCreditNoteReceiveIbtRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerFileReaderRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerGepTepCancelledRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerCreditNoteCancelledRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerDebitRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerTepCashRefundRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerReversalTepRefundRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerTepRORefundRowMapper;

import lombok.extern.slf4j.Slf4j;

import com.titan.poss.file.jobs.mapper.GeneralLedgerDigiGoldCreditRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerCnCancelDeductionAmtRowMapper;
import com.titan.poss.file.jobs.mapper.GeneralLedgerQcgcGiftCardRowMapper;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Configuration
public class GeneralLedgerJobReader {

	@Autowired
	private DataSource dataSource;

//	@Bean(destroyMethod = "")
//	@StepScope
//	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerBankingCreditStagingReader(
//			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
//		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
//		reader.setDataSource(dataSource);
//		String sql = null;
//		if (!StringUtils.isEmpty(transactionDate)) {
//			sql = "select 'Banking Entry' as type_of_transaction,cm.seg_no ,bd.deposit_date, pd.instrument_no ,pd.payment_date, pd.amount as credit_amount,'' as debit_amount, st.doc_date as business_date, st.location_code ,pd.payment_code, gbcm.cost_center, gl.gl_code from sales.dbo.payment_details pd,\r\n"
//					+ "payments.dbo.gl_boutique_code_master gbcm ,payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,locations.dbo.country_master cm ,locations.dbo.location_master lm ,"
//					+ ", sales.dbo.bank_deposits bd where lm.country_code = cm.country_code and bd.location_code = st.location_code and pd.payment_code = bd.payment_code \r\n"
//					+ "and st.doc_date = bd.business_date and lm.owner_type != 'L3' and bd.payee_bank_name = pd.bank_name and lm.location_code = st.location_code and\r\n"
//					+ "pd.sales_txn_id =st.id and st.location_code =gl.location_code and gbcm.location_code =st.location_code  \r\n"
//					+ "and pd.payment_code = gl.payment_code and gl.payment_code in ('CARD','CASH', 'DD','CHEQUE') st.doc_date ='"
//					+ transactionDate + "'";
//		} else {
//			sql = "select 'Banking Entry' as type_of_transaction,cm.seg_no , bd.deposit_date,  pd.instrument_no ,pd.payment_date,pd.amount as credit_amount,'' as debit_amount, st.doc_date as business_date, st.location_code ,pd.payment_code, gbcm.cost_center, gl.gl_code from sales.dbo.payment_details pd,\r\n"
//					+ " payments.dbo.gl_boutique_code_master gbcm ,payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,locations.dbo.country_master cm ,locations.dbo.location_master lm ,sales.dbo.bank_deposits bd,"
//					+ FileIntegrationConstants.BUSINESS_DAY_SQL
//					+ " where lm.country_code = cm.country_code and bd.location_code = st.location_code and pd.payment_code = bd.payment_code \r\n"
//					+ "and st.doc_date = bd.business_date and lm.owner_type != 'L3' and bd.payee_bank_name = pd.bank_name and lm.location_code = st.location_code and\r\n"
//					+ " pd.sales_txn_id =st.id and st.location_code =gl.location_code and gbcm.location_code =st.location_code  and st.location_code =z.location_code  \r\n"
//					+ " and pd.payment_code = gl.payment_code and gl.payment_code in ('CARD','CASH', 'DD','CHEQUE') and z.business_date = st.doc_date ";
//			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
//				public void setValues(PreparedStatement preparedStatement) throws SQLException {
//					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
//					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
//				}
//			});
//		}
//		reader.setSql(sql);
//		reader.setRowMapper(getGeneralLedgerBankingEntryRowMapper());
//		return reader;
//	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerBankingCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Banking Entry' as type_of_transaction,bd.instrument_no ,cm.seg_no ,bd.pif_no ,bd.collection_date, bdm.fiscal_year, bd.instrument_no ,bd.mid_code, bd.deposit_amount as credit_amount, '' as debit_amount, bd.location_code , bd.deposit_date as business_date ,bd.payment_code,gl.gl_code,gbcm.cost_center \r\n"
					+ "from sales.dbo.bank_deposits bd inner join sales.dbo.business_day_master bdm on bdm.business_date = bd.business_date and bd.location_code=bdm.location_code left join payments.dbo.gl_boutique_payment_mapping gl on gl.location_code = bd.Location_code and gl.Payment_code = bd.Payment_Code, \r\n"
					+ "					payments.dbo.payee_bank_location_mapping pb,payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm  \r\n"
					+ "where lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = bd.location_code and bd.payee_bank_name = pb.bank_name and bd.location_code = pb.location_code and pb.payment_code = bd.payment_code\r\n"
					+ "					and gbcm.location_code = bd.location_code and bd.location_code =z.location_code  and z.business_date = bd.deposit_date "
					+ "'" + transactionDate + "'";
		} else {
			sql = "select 'Banking Entry' as type_of_transaction,bd.instrument_no ,cm.seg_no ,bd.pif_no ,bd.collection_date, bdm.fiscal_year, bd.instrument_no ,bd.mid_code, bd.deposit_amount as credit_amount, '' as debit_amount, bd.location_code , bd.deposit_date as business_date ,bd.payment_code,gl.gl_code,gbcm.cost_center \r\n"
					+ "from sales.dbo.bank_deposits bd inner join sales.dbo.business_day_master bdm on bdm.business_date = bd.business_date and bd.location_code=bdm.location_code left join payments.dbo.gl_boutique_payment_mapping gl on gl.location_code = bd.Location_code and gl.payment_code = bd.payment_code, \r\n"
					+ "					payments.dbo.payee_bank_location_mapping pb,payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm   ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = bd.location_code and bd.payee_bank_name = pb.bank_name and bd.location_code = pb.location_code and pb.payment_code = bd.payment_code\r\n"
					+ "					and gbcm.location_code = bd.location_code and bd.location_code =z.location_code  and z.business_date = bd.deposit_date ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerBankingEntryRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerBankingDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Banking Entry' as type_of_transaction,bd.instrument_no , cm.seg_no ,bd.pif_no ,bd.collection_date, bdm.fiscal_year, bd.instrument_no ,bd.mid_code, bd.deposit_amount as debit_amount,\r\n"
					+ " '' as credit_amount, bd.location_code , bd.deposit_date as business_date ,bd.payment_code, pb.gl_code,gbcm.cost_center \r\n"
					+ "					 from sales.dbo.bank_deposits bd inner join sales.dbo.business_day_master bdm on bdm.business_date = bd.business_date and bd.location_code=bdm.location_code left join\r\n"
					+ "					 					payments.dbo.payee_bank_location_mapping pb on pb.bank_name = bd.payee_bank_name and bd.location_code = pb.Location_Code \r\n"
					+ "										and pb.payment_code = bd.payment_Code,payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm    \r\n"
					+ "where lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = bd.location_code \r\n"
					+ "					and gbcm.location_code = bd.location_code and bd.location_code =z.location_code  and z.business_date = bd.deposit_date "
					+ "'" + transactionDate + "'";
		} else {
			sql = "select 'Banking Entry' as type_of_transaction,bd.instrument_no , cm.seg_no ,bd.pif_no ,bd.collection_date, bdm.fiscal_year, bd.instrument_no ,bd.mid_code, bd.deposit_amount as debit_amount,\r\n"
					+ "'' as credit_amount, bd.location_code , bd.deposit_date as business_date ,bd.payment_code, pb.gl_code,gbcm.cost_center \r\n"
					+ "					 from sales.dbo.bank_deposits bd inner join sales.dbo.business_day_master bdm on bdm.business_date = bd.business_date and bd.location_code=bdm.location_code left join\r\n"
					+ "					 					payments.dbo.payee_bank_location_mapping pb on pb.bank_name = bd.payee_bank_name and bd.location_code = pb.Location_Code \r\n"
					+ "										and pb.payment_code = bd.payment_Code,payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm    ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = bd.location_code \r\n"
					+ "					and gbcm.location_code = bd.location_code and bd.location_code =z.location_code  and z.business_date = bd.deposit_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerBankingEntryRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> advanceReceivedCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'CUSTOMER ADVANCE RECEIVED' as type_of_transaction, st.fiscal_year, cm.seg_no,cn.doc_no as cn_doc_no ,pd.payment_code, sum(pd.amount) as credit_amount, '' as debit_amount, st.doc_date as business_date,st.location_code, gbcm.cost_center, gbcm.gl_code  from sales.dbo.payment_details pd  , sales.dbo.credit_note cn , payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,\r\n"
					+ "	payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm \r\n"
					+ "	where pd.status='COMPLETED' and   lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = st.location_code and st.location_code =gl.location_code and pd.sales_txn_id = st.id and gbcm.location_code = st.location_code \r\n"
					+ " and st.txn_type in ('ADV','AB')	and pd.payment_code = gl.payment_code and st.id = cn.sales_txn_id and pd.payment_code not in ( 'CREDIT NOTE') \r\n"
					+ " and st.doc_date = '" + transactionDate + "'"
							+ "  group by st.fiscal_year,  cm.seg_no,cn.doc_no  ,pd.payment_code,  st.doc_date, st.location_code, gbcm.cost_center, gbcm.gl_code";
		} else {
			sql = "select 'CUSTOMER ADVANCE RECEIVED' as type_of_transaction, st.fiscal_year, cm.seg_no,cn.doc_no as cn_doc_no ,pd.payment_code, sum(pd.amount) as credit_amount, '' as debit_amount, st.doc_date as business_date,st.location_code, gbcm.cost_center, gbcm.gl_code  from sales.dbo.payment_details pd  , sales.dbo.credit_note cn , payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,\r\n"
					+ "	payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm  ,\r\n "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where pd.status='COMPLETED' and   lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = st.location_code and st.location_code =gl.location_code and pd.sales_txn_id = st.id and gbcm.location_code = st.location_code \r\n"
					+ " and st.txn_type in ('ADV','AB') and st.id = cn.sales_txn_id and pd.payment_code = gl.payment_code and pd.payment_code not in ( 'CREDIT NOTE') and  st.location_code =z.location_code  and st.doc_date = z.business_date"
					+ "  group by st.fiscal_year,  cm.seg_no,cn.doc_no  ,pd.payment_code,  st.doc_date, st.location_code, gbcm.cost_center, gbcm.gl_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerAdvanceReceivedRowMapper());
		return reader;
	}
/* previous advanceReceivedCreditStagingReader query
 * sql = "select 'CUSTOMER ADVANCE RECEIVED' as type_of_transaction,cm.seg_no ,cn.doc_no as cn_doc_no, cn.amount as credit_amount, '' as debit_amount, st.doc_date as business_date,st.location_code, gbcm.cost_center, gl.gl_code from sales.dbo.credit_note cn, payments.dbo.gl_boutique_code_master gl,\r\n"
					+ "sales.dbo.sales_transaction st ,payments.dbo.gl_boutique_code_master gbcm ,locations.dbo.country_master cm ,locations.dbo.location_master lm \r\n"
					+ "where lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = st.location_code and cn.location_code =gl.location_code and st.id = cn.linked_txn_id\r\n"
					+ "and gbcm.location_code = cn.location_code and st.doc_date = '" + transactionDate + "'";
 * */
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> advanceReceivedDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'CUSTOMER ADVANCE RECEIVED' as type_of_transaction, st.fiscal_year, cm.seg_no,cn.doc_no as cn_doc_no ,pd.payment_code, sum(pd.amount) as debit_amount, '' as credit_amount, st.doc_date as business_date,st.location_code, gbcm.cost_center, gl.gl_code  "
					+ "from sales.dbo.payment_details pd  , sales.dbo.credit_note cn , payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,\r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm, locations.dbo.country_master cm ,locations.dbo.location_master lm \r\n"
					+ "where  pd.status='COMPLETED' and   lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = st.location_code and st.location_code =gl.location_code and pd.sales_txn_id = st.id and gbcm.location_code = st.location_code \r\n"
					+ " and st.txn_type in ('ADV','AB') and pd.payment_code = gl.payment_code and st.id = cn.sales_txn_id and pd.payment_code not in ( 'CREDIT NOTE') and st.doc_date = '"
					+ transactionDate + "'"
							+ "  group by st.fiscal_year,  cm.seg_no,cn.doc_no  ,pd.payment_code,  st.doc_date, st.location_code, gbcm.cost_center, gl.gl_code";
		} else {
			sql = "select 'CUSTOMER ADVANCE RECEIVED' as type_of_transaction, st.fiscal_year, cn.doc_no as cn_doc_no ,cm.seg_no ,pd.payment_code, sum(pd.amount) as debit_amount, '' as credit_amount, st.doc_date as business_date,st.location_code, gbcm.cost_center, gl.gl_code  from sales.dbo.payment_details pd  , sales.dbo.credit_note cn , payments.dbo.gl_boutique_payment_mapping gl, sales.dbo.sales_transaction st,\r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm ,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where  pd.status='COMPLETED' and   lm.country_code = cm.country_code and lm.owner_type != 'L3' and lm.location_code = st.location_code and st.location_code =gl.location_code and pd.sales_txn_id = st.id and gbcm.location_code = st.location_code \r\n"
					+ " and st.txn_type in ('ADV','AB') and st.id = cn.sales_txn_id and pd.payment_code = gl.payment_code and pd.payment_code not in ( 'CREDIT NOTE') and  st.location_code =z.location_code  and st.doc_date = z.business_date"
					+ "  group by st.fiscal_year,  cm.seg_no,cn.doc_no  ,pd.payment_code,  st.doc_date, st.location_code, gbcm.cost_center, gl.gl_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerAdvanceReceivedRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Credit Note Transfer' as type_of_transaction,cnt.dest_location_code, cnt.src_location_code, cn.doc_no ,cn.amount as debit_amount,'' as credit_amount, cn.doc_date as business_date,cm.seg_no \r\n"
					+ "		, cnt.fiscal_year, gbcm.cost_center, gbcm.gl_code, src_lm.region_code \r\n"
					+ "					 					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cnt.src_cn_id = cn.id and cnt.src_location_code = cn.location_code 					 					\r\n"
					+ "					 										INNER JOIN locations.dbo.location_master src_lm on src_lm.location_code=cnt.src_location_code\r\n"
					+ "															inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 										inner join locations.dbo.country_master cm on src_lm.country_code = cm.country_code \r\n"
					+ "					 										left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code=cnt.src_location_code  \r\n"
					+ " where   cnt.status in ('ISSUED', 'RECEIVED' ) and cn.status = 'Transfer_IBT'  and src_lm.owner_type  in ('L1','L2')  and dest_lm.owner_type in ('L1', 'L2')\r\n"
					+ "							and cnt.src_location_code =z.location_code   and  "
					+ "convert(date, cnt.transfer_date) ='"
					+ transactionDate + "'";
		} else {
			sql = "select 'Credit Note Transfer' as type_of_transaction,cnt.dest_location_code, cnt.src_location_code, cn.doc_no ,cn.amount as debit_amount,'' as credit_amount, cn.doc_date as business_date,cm.seg_no \r\n"
					+ "		, cnt.fiscal_year, gbcm.cost_center, gbcm.gl_code, src_lm.region_code \r\n"
					+ "					 					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cnt.src_cn_id = cn.id and cnt.src_location_code = cn.location_code 					 					\r\n"
					+ "					 										INNER JOIN locations.dbo.location_master src_lm on src_lm.location_code=cnt.src_location_code\r\n"
					+ "															inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 										inner join locations.dbo.country_master cm on src_lm.country_code = cm.country_code \r\n"
					+ "					 										left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code=cnt.src_location_code   ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where   cnt.status in ('ISSUED', 'RECEIVED' ) and cn.status = 'Transfer_IBT'  and src_lm.owner_type  in ('L1','L2')  and dest_lm.owner_type in ('L1', 'L2')\r\n"
					+ "							and cnt.src_location_code =z.location_code   and convert(date, cnt.transfer_date) = z.business_date  ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteReceiveRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Credit Note Transfer' as type_of_transaction, cn.amount as credit_amount, '' as debit_amount,cn.doc_no, cn.doc_date as business_date,cm.seg_no, cnt.dest_location_code, cnt.src_location_code, \r\n"
					+ "					 cnt.fiscal_year,  gbcm.cost_center, '153479' as gl_code, src_lm.region_code \r\n"
					+ "					 					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cnt.src_cn_id = cn.id and cnt.src_location_code = cn.location_code					 			\r\n"
					+ "					 								INNER JOIN locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code\r\n"
					+ "													inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 								inner join locations.dbo.country_master cm on src_lm.country_code = cm.country_code  \r\n"
					+ "					 								left join 	payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code=cnt.src_location_code \r\n"
					+ "where  cn.id = cnt.src_cn_id  and cnt.status in ('ISSUED', 'RECEIVED' ) and cn.status = 'TRANSFER_IBT'  and lm.owner_type in ('L1','L2') \r\n"
					+ "				and cnt.src_location_code = z.location_code  and "
					+ "convert(date, cnt.transfer_date) = '"
					+ transactionDate + "'";
		} else {
			sql = "select 'Credit Note Transfer' as type_of_transaction, cn.amount as credit_amount, '' as debit_amount,cn.doc_no, cn.doc_date as business_date,cm.seg_no, cnt.dest_location_code, cnt.src_location_code, \r\n"
					+ "					 cnt.fiscal_year,  gbcm.cost_center, '153479' as gl_code, src_lm.region_code \r\n"
					+ "					 					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cnt.src_cn_id = cn.id and cnt.src_location_code = cn.location_code					 			\r\n"
					+ "					 								INNER JOIN locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code\r\n"
					+ "													inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 								inner join locations.dbo.country_master cm on src_lm.country_code = cm.country_code  \r\n"
					+ "					 								left join 	payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code=cnt.src_location_code  ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where  cnt.status in ('ISSUED', 'RECEIVED' ) and cn.status = 'TRANSFER_IBT' and src_lm.owner_type  in ('L1','L2')  and dest_lm.owner_type in ('L1', 'L2')  \r\n"
					+ "					 		and cnt.src_location_code = z.location_code  and convert(date, cnt.transfer_date)  = z.business_date ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteReceiveRowMapper());
		return reader;
	}
	
	
	//  CN Receive IBT Debit line generalLedgerCreditNoteReceiveDebitStagingReader
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveIbtDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Credit Note Received - Inter boutique' as type_of_transaction ,'' as credit_amount, cn.Amount as debit_amount, cn.fiscal_year, cnt.src_location_code, cnt.dest_location_code, json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no,  cn.doc_no as dest_cn_doc_no, gbcm.cost_center, '153479' as gl_code, '100' as seg_no, cn.doc_date as business_date \r\n"
					+ "\r\n"
					+ "\r\n"
					+ "From sales.dbo.credit_note_transfer cnt inner join sales.dbo.credit_note cn on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year \r\n"
					+ "inner join Locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_Location_code \r\n"
					+ "inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = dest_lm.location_code   \r\n"
					+ "WHERE cnt.status = 'RECEIVED' and cn.doc_date = z.business_date and cnt.dest_Location_Code = z.location_code and src_lm.owner_type <> 'L3' and dest_lm.Owner_type <> 'L3'\r\n"
					+ "	and cn.ref_doc_type = 'CN_IBT'  "
					+ "cn.doc_date ='"
					+ transactionDate + "'";
		} else {
			sql = "Select 'Credit Note Received - Inter boutique' as type_of_transaction ,'' as credit_amount, cn.Amount as debit_amount, cn.fiscal_year, cnt.src_location_code, cnt.dest_location_code, json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no, cn.doc_no as dest_cn_doc_no, gbcm.cost_center, '153479' as gl_code, '100' as seg_no, cn.doc_date as business_date \r\n"
					+ "\r\n"
					+ "\r\n"
					+ "From sales.dbo.credit_note_transfer cnt inner join sales.dbo.credit_note cn on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year \r\n"
					+ "inner join Locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_Location_code \r\n"
					+ "inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = dest_lm.location_code  ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "WHERE cnt.status = 'RECEIVED' and cn.doc_date = z.business_date and cnt.dest_Location_Code = z.location_code and src_lm.owner_type <> 'L3' and dest_lm.Owner_type <> 'L3'\r\n"
					+ "	and cn.ref_doc_type = 'CN_IBT' ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteReceiveIbtRowMapper());
		return reader;
	}

//  CN Receive IBT Credit line 
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveIbtCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Credit Note Received - Inter boutique' as type_of_transaction , cn.Amount as credit_amount, '' as debit_amount, cn.fiscal_year, cnt.src_location_code, cnt.dest_location_code, json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no, cn.doc_no as dest_cn_doc_no, gbcm.cost_center, gbcm.gl_code, '100' as seg_no, cn.doc_date as business_date \r\n"
					+ "\r\n"
					+ "\r\n"
					+ "From sales.dbo.credit_note_transfer cnt inner join sales.dbo.credit_note cn on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year \r\n"
					+ "inner join Locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_Location_code \r\n"
					+ "inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = dest_lm.location_code  \r\n"
					+ "WHERE cnt.status = 'RECEIVED'  and cnt.dest_Location_Code = z.location_code and src_lm.owner_type <> 'L3' and dest_lm.Owner_type <> 'L3'\r\n"
					+ "	and cn.ref_doc_type = 'CN_IBT'  "
					+ "and cn.doc_date =  '"
					+ transactionDate + "'";
		} else {
			sql = "Select 'Credit Note Received - Inter boutique' as type_of_transaction , cn.Amount as credit_amount, '' as debit_amount, cn.fiscal_year, cnt.src_location_code, cnt.dest_location_code, json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no, cn.doc_no as dest_cn_doc_no, gbcm.cost_center, gbcm.gl_code, '100' as seg_no, cn.doc_date as business_date \r\n"
					+ "\r\n"
					+ "\r\n"
					+ "From sales.dbo.credit_note_transfer cnt inner join sales.dbo.credit_note cn on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year \r\n"
					+ "inner join Locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_Location_code \r\n"
					+ "inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = dest_lm.location_code  ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " WHERE cnt.status = 'RECEIVED' and cn.doc_date = z.business_date and cnt.dest_Location_Code = z.location_code and src_lm.owner_type <> 'L3' and dest_lm.Owner_type <> 'L3'\r\n"
					+ "	and cn.ref_doc_type = 'CN_IBT' ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteReceiveIbtRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerGepCancelledDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'GEP Cancelled' as type_of_transaction, rt.doc_date as business_date, st.fiscal_year, ge.final_value as debit_amount,'' as credit_amount,cm.seg_no ,st.location_code, gbcm.cost_center, gl.gl_code from sales.dbo.sales_transaction st, payments.dbo.gl_boutique_code_master gl,\r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='GEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2') and st.location_code=gl.location_code and gbcm.location_code = st.location_code and rt.doc_date='"
					+ transactionDate + "'";
		} else {
			sql = "select 'GEP Cancelled' as type_of_transaction, rt.doc_date as business_date, st.fiscal_year, ge.final_value as debit_amount,'' as credit_amount,cm.seg_no ,st.location_code, gbcm.cost_center, gl.gl_code from sales.dbo.sales_transaction st, payments.dbo.gl_boutique_code_master gl,\r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='GEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2') and st.location_code=gl.location_code and gbcm.location_code = st.location_code and \r\n"
					+ "st.location_code =z.location_code  and rt.doc_date = z.business_date ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerGepCancelledRowMapper());
		return reader;
	}

	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerGepCancelledCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'GEP Cancelled' as type_of_transaction, '400521' as gl_code,st.doc_date as business_date, st.fiscal_year, ge.final_value as credit_amount,'' as debit_amount ,cm.seg_no ,st.location_code, gbcm.cost_center from sales.dbo.sales_transaction st, \r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='GEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2')  and gbcm.location_code = st.location_code and st.doc_date='"
					+ transactionDate + "'";
		} else {
			sql = "select 'GEP Cancelled' as type_of_transaction, '400521' as gl_code,st.doc_date as business_date, st.fiscal_year, ge.final_value as credit_amount,'' as debit_amount ,cm.seg_no ,st.location_code, gbcm.cost_center from sales.dbo.sales_transaction st, \r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='GEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2')  and gbcm.location_code = st.location_code and \r\n"
					+ "st.location_code =z.location_code  and st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerGepCancelledRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepCancelledDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'TEP Cancelled' as type_of_transaction, rt.doc_date as business_date, rt.fiscal_year, ge.final_value as debit_amount,'' as credit_amount,cm.seg_no ,st.location_code, gbcm.cost_center, gl.gl_code from sales.dbo.sales_transaction st, payments.dbo.gl_boutique_code_master gl,\r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='TEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2') and st.location_code=gl.location_code and gbcm.location_code = st.location_code and rt.doc_date='"
					+ transactionDate + "'";
		} else {
			sql = "select 'TEP Cancelled' as type_of_transaction, rt.doc_date as business_date, rt.fiscal_year, ge.final_value as debit_amount,'' as credit_amount,cm.seg_no ,st.location_code, gbcm.cost_center, gl.gl_code from sales.dbo.sales_transaction st, payments.dbo.gl_boutique_code_master gl,\r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='TEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2') and st.location_code=gl.location_code and gbcm.location_code = st.location_code and \r\n"
					+ "st.location_code =z.location_code  and rt.doc_date = z.business_date ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerGepCancelledRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepCancelledCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'TEP Cancelled' as type_of_transaction,'400529' as gl_code, st.doc_date as business_date, rt.fiscal_year, ge.final_value as credit_amount,'' as debit_amount ,cm.seg_no ,st.location_code, gbcm.cost_center from sales.dbo.sales_transaction st, \r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='TEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2')  and gbcm.location_code = st.location_code and st.doc_date='"
					+ transactionDate + "'";
		} else {
			sql = "select 'TEP Cancelled' as type_of_transaction,'400529' as gl_code, st.doc_date as business_date, rt.fiscal_year, ge.final_value as credit_amount,'' as debit_amount ,cm.seg_no ,st.location_code, gbcm.cost_center from sales.dbo.sales_transaction st, \r\n"
					+ "sales.dbo.goods_exchange ge ,payments.dbo.gl_boutique_code_master gbcm , locations.dbo.country_master cm ,locations.dbo.location_master lm , sales.dbo.refund_transaction rt ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.country_code = cm.country_code and lm.location_code = st.location_code and st.id=ge.id and st.txn_type ='TEP' and st.status ='CANCELLED' and st.id =rt.ref_sales_id \r\n"
					+ "and lm.owner_type in ('L1','L2')  and gbcm.location_code = st.location_code and \r\n"
					+ "st.location_code =z.location_code  and st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerGepCancelledRowMapper());
		return reader;
	}
	//CreditNoteCancelCredit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteCancelCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Credit Note Cancelled' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit,  pr.amount as credit_amount, '' as debit_amount,cn.credit_note_type, pr.payment_code, gl.gl_code as gl_code, cn.doc_no, \r\n"
					+ "					 pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center \r\n"
					+ "					 FROM sales.dbo.credit_note cn inner join locations.dbo.location_master lm on lm.location_code = cn.location_code inner join locations.dbo.country_master cm on cm.country_code = lm.country_code inner join \r\n"
					+ "					 payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = cn.location_code inner join sales.dbo.payment_refunds pr on pr.credit_note_id = cn.id \r\n"
					+ "					 left join payments.dbo.gl_boutique_payment_mapping gl on gl.payment_code = pr.payment_code and gl.location_code = cn.location_code\r\n"
					+ "where cn.status='CANCELLED'  and lm.owner_type !='L3' and pr.payment_code = 'cash' \r\n"
					+ "					 and cn.location_code =z.location_code  and  " //cn.cancel_date = z.business_date "
					
					+ "and cn.cancel_date = '\r\n"
					+ transactionDate + "'";
		} else {
			sql = "Select 'Credit Note Cancelled' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit,  pr.amount as credit_amount, '' as debit_amount,cn.credit_note_type, pr.payment_code, gl.gl_code as gl_code, cn.doc_no, \r\n"
					+ "					 pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center \r\n"
					+ "					 FROM sales.dbo.credit_note cn inner join locations.dbo.location_master lm on lm.location_code = cn.location_code inner join locations.dbo.country_master cm on cm.country_code = lm.country_code inner join \r\n"
					+ "					 payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = cn.location_code inner join sales.dbo.payment_refunds pr on pr.credit_note_id = cn.id \r\n"
					+ "					 left join payments.dbo.gl_boutique_payment_mapping gl on gl.payment_code = pr.payment_code and gl.location_code = cn.location_code,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.status='CANCELLED'  and lm.owner_type !='L3' and pr.payment_code = 'cash' \r\n"
					+ "					 and cn.location_code =z.location_code  and cn.cancel_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteCancelledRowMapper());
		return reader;
	}

	//CreditNoteCancelDebit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteCancelDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center, \r\n"
					+ " (select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= '" + locationCode + "' ) as  gl_code, \r\n"
					//+ "					(SELECT gl_code from payments.dbo.gl_boutique_payment_mapping where location_code = '" + locationCode + "' and payment_code = 'CASH') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='Credit Note Cancelled'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					//+ "					(SELECT gl_code from payments.dbo.gl_boutique_payment_mapping where location_code = z.location_code and payment_code = 'CASH') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='Credit Note Cancelled'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//CreditNoteROCancelCredit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteROCancelCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Credit Note Cancelled_RO' as type_of_transaction, cn.debit_note_fiscal_year, 'N' as is_debit, pr.amount as credit_amount, '' as debit_amount, (Select gl.gl_code from payments.dbo.gl_boutique_payment_mapping gl where gl.location_code = z.location_code and gl.payment_code = 'RO Payment') as gl_code, cn.doc_no\r\n"
					+ ",pr.reversal_date as business_date , pr.payment_code, cm.seg_no, cn.location_code, gbcm.cost_center\r\n"
					+ "FROM sales.dbo.credit_note cn\r\n"
					+ ",locations.dbo.country_master cm, locations.dbo.location_master lm,payments.dbo.gl_boutique_code_master gbcm, sales.dbo.payment_refunds pr,  payments.dbo.gl_boutique_payment_mapping gl \r\n"
					+ "where cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and cn.location_code = gbcm.location_code\r\n"
					+ " and  pr.credit_note_id=cn.id and lm.owner_type !='L3' and pr.payment_code <> 'Cash' "
					+ "and cn.cancel_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select 'Credit Note Cancelled_RO' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit, pr.amount as credit_amount, '' as debit_amount, (Select gl.gl_code from payments.dbo.gl_boutique_payment_mapping gl where gl.location_code = z.location_code and gl.payment_code = 'RO Payment') as gl_code, cn.doc_no\r\n"
					+ ",pr.reversal_date as business_date , pr.payment_code, cm.seg_no, cn.location_code, gbcm.cost_center\r\n"
					+ "FROM sales.dbo.credit_note cn\r\n"
					+ ",locations.dbo.country_master cm, locations.dbo.location_master lm,payments.dbo.gl_boutique_code_master gbcm, sales.dbo.payment_refunds pr , "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and cn.location_code = gbcm.location_code\r\n"
					+ "  and  pr.credit_note_id=cn.id and lm.owner_type !='L3' and pr.payment_code <> 'Cash' \r\n"
					+ "and cn.location_code =z.location_code  and cn.cancel_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteCancelledRowMapper());
		return reader;
	}

	//CreditNoteROCancelDebit
//	@Bean(destroyMethod = "")
//	@StepScope
//	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteROCancelDebitStagingReader(
//			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
//			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
//			) {
//		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
//		reader.setDataSource(dataSource);
//		System.out.println(" transaction Date" + FileIntegrationConstants.TRANSACTION_DATE);
//		System.out.println(" Location Code" + FileIntegrationConstants.LOCATION_CODE);
//		String sql = null;
//		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
//			sql = "select 'Credit Note Cancelled_RO' as type_of_transaction,'Y' as is_debit, '' as credit_amount, pr.amount as debit_amount,gbcm.gl_code as gl_code\r\n"
//					+ "	,pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center, cn.doc_no \r\n"
//					+ "	FROM sales.dbo.credit_note cn \r\n"
//					+ "	,locations.dbo.country_master cm, locations.dbo.location_master lm,payments.dbo.gl_boutique_code_master gbcm, sales.dbo.payment_refunds pr\r\n"
//					+ "	where cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and cn.location_code = gbcm.location_code\r\n"
//					+ "	and pr.credit_note_id=cn.id and lm.owner_type !='L3' and pr.payment_code <> 'Cash' \r\n"
//					+ "	and cn.cancel_date ='"+ transactionDate +"' \r\n";
//					
//		} else {
//			sql = "select 'Credit Note Cancelled_RO' as type_of_transaction,'Y' as is_debit, '' as credit_amount, pr.amount as debit_amount,gbcm.gl_code as gl_code\r\n"
//					+ "	,pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center, cn.doc_no\r\n"
//					+ "	FROM sales.dbo.credit_note cn \r\n"
//					+ "	,locations.dbo.country_master cm, locations.dbo.location_master lm,payments.dbo.gl_boutique_code_master gbcm, sales.dbo.payment_refunds pr,"
//					+ FileIntegrationConstants.BUSINESS_DAY_SQL
//					+ "where cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and cn.location_code = gbcm.location_code\r\n"
//					+ "and pr.credit_note_id=cn.id and lm.owner_type !='L3' and pr.payment_code <> 'Cash' \r\n"
//					+ "and cn.location_code =z.location_code  and cn.cancel_date = z.business_date";
//			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
//				public void setValues(PreparedStatement preparedStatement) throws SQLException {
//					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
//					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
//				}
//			});
//		}
//		reader.setSql(sql);
//		reader.setRowMapper(getGeneralLedgerCreditNoteCancelledRowMapper());
//		return reader;
//	}
	
	
	//CreditNoteROCancelDebit
		@Bean(destroyMethod = "")
		@StepScope
		public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteROCancelDebitStagingReader(
				@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
				@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
				) {
			JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
			reader.setDataSource(dataSource);
			String sql = null;
			if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
				sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
						+ "					 					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
						+ "					 (select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= '"+ locationCode +"' ) as  gl_code, \r\n"
						+ "					 					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
						+ "					 					from  [FILE].dbo.general_ledger_stage gls \r\n"
						+ "where    gls.attribute2='Credit Note Cancelled_RO'  and gls.attribute3= '"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate + "'\r\n"
						+ "										\r\n"
						+ "					 					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
						+ "					 					gls.create_date,gls.attribute2 \r\n";
						
			} else {
				sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
						+ "					 					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
						+ "					 (select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
						+ "					 					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
						+ "					 					from  [FILE].dbo.general_ledger_stage gls ,"
						+ FileIntegrationConstants.BUSINESS_DAY_SQL
						+ "where    gls.attribute2='Credit Note Cancelled_RO'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
						+ "										\r\n"
						+ "					 					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
						+ "					 					gls.create_date,gls.attribute2,z.location_code ";
				reader.setPreparedStatementSetter(new PreparedStatementSetter() {
					public void setValues(PreparedStatement preparedStatement) throws SQLException {
						preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
						preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					}
				});
			}
			reader.setSql(sql);
			reader.setRowMapper(getGeneralLedgerDebitRowMapper());
			return reader;
		}
	
	//CN IBT Cancel
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteIbtCancelCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Credit Note Cancelled - Inter boutique' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit, cn.amount as credit_amount, '' as debit_amount,cn.credit_note_type, '' as payment_code, gbcm.gl_code as gl_code,\r\n"
					+ "					 					convert(date, cnt.transfer_date) as business_date , cm.seg_no, cn.location_code, gbcm.cost_center, cn.doc_no, dest_lm.Region_code \r\n"
					+ "					 					FROM sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cn.id = cnt.src_cn_id and cn.location_code = cnt.src_location_code\r\n"
					+ "										inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code\r\n"
					+ "										inner join locations.dbo.country_master cm on cm.COUNTRY_CODE = src_lm.COUNTRY_CODE\r\n"
					+ "										inner join locations.dbo.location_master dest_lm on dest_lm.location_Code = cnt.dest_location_code\r\n"
					+ "										left join payments.dbo.gl_boutique_code_master gbcm on gbcm.gl_code = dest_lm.location_code\r\n"
					+ "					where cn.status='TRANSFER_IBT'  and  src_lm.owner_type in ('L1','L2')  and dest_lm.Owner_type in ('L3') \r\n"
					+ "					and cn.location_code =z.location_code  \r\n"
					
					+ "and cn.cancel_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "Select 'Credit Note Cancelled - Inter boutique' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit, cn.amount as credit_amount, '' as debit_amount,cn.credit_note_type, '' as payment_code, gbcm.gl_code as gl_code,\r\n"
					+ "					 					convert(date, cnt.transfer_date) as business_date , cm.seg_no, cn.location_code, gbcm.cost_center, cn.doc_no, dest_lm.Region_code \r\n"
					+ "					 					FROM sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cn.id = cnt.src_cn_id and cn.location_code = cnt.src_location_code\r\n"
					+ "										inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code\r\n"
					+ "										inner join locations.dbo.country_master cm on cm.COUNTRY_CODE = src_lm.COUNTRY_CODE\r\n"
					+ "										inner join locations.dbo.location_master dest_lm on dest_lm.location_Code = cnt.dest_location_code\r\n"
					+ "										left join payments.dbo.gl_boutique_code_master gbcm on gbcm.gl_code = dest_lm.location_code,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.status='TRANSFER_IBT'  and  src_lm.owner_type in ('L1','L2')  and dest_lm.Owner_type in ('L3') \r\n"
					+ "					and cn.location_code =z.location_code  and cn.cancel_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteCancelledRowMapper());
		return reader;
	}
	
	
	//CN IBT Cancel Debit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteIbtCancelDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_dr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='Credit Note Cancelled - Inter boutique'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_dr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='Credit Note Cancelled - Inter boutique'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	
	 // Cash Refund TEP Debit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCashRefundTepDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Cash Refund_TEP' as transaction_type, Sum(pr.Amount) as debit_amount, '' as credit_amount, gbcm.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, st.location_code , Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date\r\n"
					+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
					+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
					+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code \r\n"
					+ "Where pr.payment_code = 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
					+ "	and st.location_code = z.location_code \r\n"
					+ "and st.doc_date ='\r\n"
					+ transactionDate + "'"
										+ "group by gbcm.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center, st.location_code\r\n";
		} else {
			sql = "Select 'Cash Refund_TEP' as transaction_type, Sum(pr.Amount) as debit_amount, '' as credit_amount, gbcm.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, st.location_code , Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date\r\n"
					+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
					+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
					+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code ,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "Where pr.payment_code = 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
					+ "	and st.doc_date =  z.business_date  and st.location_code =  z.location_code\r\n"
					+ "group by gbcm.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center,st.location_code\r\n";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerTepCashRefundRowMapper());
		return reader;
	}
	
	
	 // Cash Refund TEP Credit
		@Bean(destroyMethod = "")
		@StepScope
		public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCashRefundTepCreditStagingReader(
				@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
			JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
			reader.setDataSource(dataSource);
			String sql = null;
			if (!StringUtils.isEmpty(transactionDate)) {
				sql = "Select 'Cash Refund_TEP' as transaction_type, '' as debit_amount, Sum(pr.Amount) as credit_amount, gl.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, st.location_code , Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date\r\n"
						+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
						+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
						+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code\r\n"
						+ "			left join payments.dbo.gl_boutique_payment_mapping gl on gl.location_code = st.location_code and gl.payment_code = pr.payment_code\r\n"
						+ "Where pr.payment_code = 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
						+ "	 and st.location_code = z.location_code\r\n"
						+ "and st.doc_date = '\r\n"
						+ transactionDate + "'"
						+ "group by gl.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center ,st.location_code \r\n"
;
			} else {
				sql = "Select 'Cash Refund_TEP' as transaction_type, '' as debit_amount, Sum(pr.Amount) as credit_amount, gl.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, st.location_code , Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date\r\n"
						+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
						+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
						+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code\r\n"
						+ "			left join payments.dbo.gl_boutique_payment_mapping gl on gl.location_code = st.location_code and gl.payment_code = pr.payment_code,"
						+ FileIntegrationConstants.BUSINESS_DAY_SQL
						+ "Where pr.payment_code = 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
						+ "	and st.doc_date = z.business_date and st.location_code = z.location_code\r\n"
						+ "group by gl.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center ,st.location_code ";
				reader.setPreparedStatementSetter(new PreparedStatementSetter() {
					public void setValues(PreparedStatement preparedStatement) throws SQLException {
						preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
						preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					}
				});
			}
			reader.setSql(sql);
			reader.setRowMapper(getGeneralLedgerTepCashRefundRowMapper());
			return reader;
		}
		
		
		 // RO Refund TEP Debit
		@Bean(destroyMethod = "")
		@StepScope
		public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerRORefundTepDebitStagingReader(
				@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
			JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
			reader.setDataSource(dataSource);
			String sql = null;
			if (!StringUtils.isEmpty(transactionDate)) {
				sql = "Select 'RO Refund_TEP' as transaction_type, Sum(pr.Amount) as debit_amount, '' as credit_amount, gbcm.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date, Convert(Varchar(10),st.doc_no) as doc_no , st.location_code \r\n"
						+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
						+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
						+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code \r\n"
						+ "Where pr.payment_code <> 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
						+ "	and st.doc_date = z.business_date and st.location_code = z.location_code\r\n"
					
						+ "and st.doc_date ='\r\n"
						+ transactionDate + "'"
							+ "group by gbcm.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center,st.location_code, st.doc_no \r\n";
										
			} else {
				sql = "Select 'RO Refund_TEP' as transaction_type, Sum(pr.Amount) as debit_amount, '' as credit_amount, gbcm.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date, Convert(Varchar(10),st.doc_no) as doc_no , st.location_code \r\n"
						+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
						+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
						+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code ,"
						+ FileIntegrationConstants.BUSINESS_DAY_SQL
						+ "Where pr.payment_code <> 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
						+ "	and st.doc_date = z.business_date and st.location_code = z.location_code\r\n"
						+ "group by gbcm.gl_code, cm.seg_no, st.fiscal_year, st.doc_date, gbcm.cost_center,st.location_code, st.doc_no \r\n";
				reader.setPreparedStatementSetter(new PreparedStatementSetter() {
					public void setValues(PreparedStatement preparedStatement) throws SQLException {
						preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
						preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					}
				});
			}
			reader.setSql(sql);
			reader.setRowMapper(getGeneralLedgerTepRoRefundRowMapper());
			return reader;
		}
		
		
		 // RO Refund TEP Credit
			@Bean(destroyMethod = "")
			@StepScope
			public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerRORefundTepCreditStagingReader(
					@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
				JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
				reader.setDataSource(dataSource);
				String sql = null;
				if (!StringUtils.isEmpty(transactionDate)) {
					sql = "Select 'RO Refund_TEP' as transaction_type, '' as debit_amount, pr.Amount as credit_amount, gl.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date, Convert(Varchar(10),st.doc_no) as doc_no , st.location_code \r\n"
							+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
							+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
							+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code\r\n"
							+ "			left join payments.dbo.gl_boutique_payment_mapping gl on st.location_code = gl.location_code and gl.payment_code = 'RO PAYMENT'\r\n"
							+ "Where pr.payment_code <> 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
							+ "and st.location_code = z.location_code \r\n"
							+ "and st.doc_date = '\r\n"
							+ transactionDate + "'";
				} else {
					sql = "Select 'RO Refund_TEP' as transaction_type, '' as debit_amount, pr.Amount as credit_amount, gl.gl_code, gbcm.cost_center, cm.seg_no, st.fiscal_year, Convert(Varchar(10), st.doc_date, 105) as doc_date, st.doc_date as business_date, Convert(Varchar(10),st.doc_no) as doc_no , st.location_code \r\n"
							+ "from sales.dbo.sales_transaction st inner join sales.dbo.payment_refunds pr on pr.sales_txn_id = st.id \r\n"
							+ "			inner join locations.dbo.location_master lm on lm.location_code = st.location_code inner join locations.dbo.country_master cm on lm.country_code=  cm.country_code\r\n"
							+ "			left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.location_code\r\n"
							+ "			left join payments.dbo.gl_boutique_payment_mapping gl on st.location_code = gl.location_code and gl.payment_code = 'RO PAYMENT',"
							+ FileIntegrationConstants.BUSINESS_DAY_SQL
							+ "Where pr.payment_code <> 'Cash' and st.txn_type = 'TEP' and st.status = 'CONFIRMED' and lm.owner_type <> 'L3' \r\n"
							+ "	and st.doc_date = z.business_date and st.location_code = z.location_code";
					reader.setPreparedStatementSetter(new PreparedStatementSetter() {
						public void setValues(PreparedStatement preparedStatement) throws SQLException {
							preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
							preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
						}
					});
				}
				reader.setSql(sql);
				reader.setRowMapper(getGeneralLedgerTepRoRefundRowMapper());
				return reader;
			}
	
	//TepRefundCredit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepRefundCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select pr.payment_code,  pr.amount as credit_amount, '' as debit_amount, '400529' as gl_code,\r\n"
					+ "pr.reversal_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "from sales.dbo.sales_transaction st, sales.dbo.payment_refunds pr,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm\r\n"
					+ "where st.txn_type='TEP' and st.status='CANCELLED' and st.id=pr.sales_txn_id\r\n"
					+ " and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3'\r\n"
					+ "and pr.reversal_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select pr.payment_code,  pr.amount as credit_amount, '' as debit_amount, '400529' as gl_code,\r\n"
					+ "pr.reversal_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "from sales.dbo.sales_transaction st, sales.dbo.payment_refunds pr,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where st.txn_type='TEP' and st.status='CANCELLED' and st.id=pr.sales_txn_id\r\n"
					+ " and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3'\r\n"
					
					+ "and st.location_code =z.location_code  and pr.reversal_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerReversalTepRefundRowMapper());
		return reader;
	}

	//TepRefundCashDebit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepRefundCashDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					//+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_payment_mapping gl where location_code='"+ locationCode +"' and payment_code = 'cash') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='Reversal Cash Refund_TEP'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					//+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_payment_mapping gl where location_code=z.location_code and payment_code = 'Cash') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='Reversal Cash Refund_TEP'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2, z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//TepRefundRODebit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepRefundRODebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					//+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_payment_mapping gl where location_code='"+ locationCode +"' and payment_code = 'RO Payment') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='Reversal RO Refund_TEP'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					//+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_payment_mapping gl where location_code= z.location_code and payment_code = 'RO Payment') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='Reversal RO Refund_TEP'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//DIGI GOLD TANISHQ - and DIGI GOLD NON TANISHQ --DigiGoldCredit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerDigiGoldCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select pd.payment_code as type_of_transaction, pd.amount as credit_amount, '' as debit_amount, st.doc_no \r\n"
					+ ",JSON_VALUE(pd.[other_details], '$.data.transactionId') as transaction_id, '151633' as gl_code, st.doc_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "FROM sales.dbo.payment_details pd,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm ,sales.dbo.sales_transaction st\r\n"
					+ "where (pd.payment_code='DIGI GOLD TANISHQ' or pd.payment_code='DIGI GOLD NON TANISHQ' ) and pd.sales_txn_id=st.id and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3' and pd.status='COMPLETED'\r\n"
					
					+ "and st.doc_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select pd.payment_code as type_of_transaction, pd.amount as credit_amount, '' as debit_amount, st.doc_no \r\n"
					+ ",JSON_VALUE(pd.[other_details], '$.data.transactionId') as transaction_id , '151633' as gl_code, st.doc_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "FROM sales.dbo.payment_details pd,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm ,sales.dbo.sales_transaction st,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where (pd.payment_code='DIGI GOLD TANISHQ' or pd.payment_code='DIGI GOLD NON TANISHQ' ) and pd.sales_txn_id=st.id and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3' and pd.status='COMPLETED' \r\n"
					+ "and st.location_code =z.location_code  and st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDigiGoldCreditRowMapper());
		return reader;
	}
	
	//DigiGoldDebit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerDigiGoldDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select pd.payment_code as type_of_transaction, pd.amount as debit_amount, '' as credit_amount, st.doc_no \r\n"
					+ ",JSON_VALUE(pd.[other_details], '$.data.transactionId') as transaction_id , '245170' as gl_code, st.doc_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "FROM sales.dbo.payment_details pd,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm ,sales.dbo.sales_transaction st\r\n"
					+ "where (pd.payment_code='DIGI GOLD TANISHQ' or pd.payment_code='DIGI GOLD NON TANISHQ' ) and pd.sales_txn_id=st.id and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3' and pd.status='COMPLETED' \r\n"
					
					+ "and st.doc_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select pd.payment_code as type_of_transaction, pd.amount as debit_amount, '' as credit_amount, st.doc_no \r\n"
					+ ",JSON_VALUE(pd.[other_details], '$.data.transactionId') as transaction_id , '245170' as gl_code, st.doc_date as business_date , st.fiscal_year, cm.seg_no, st.location_code, gbcm.cost_center \r\n"
					+ "FROM sales.dbo.payment_details pd,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm ,sales.dbo.sales_transaction st,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where (pd.payment_code='DIGI GOLD TANISHQ' or pd.payment_code='DIGI GOLD NON TANISHQ' ) and pd.sales_txn_id=st.id and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "					st.location_code = gbcm.location_code  and lm.owner_type !='L3' and pd.status='COMPLETED' \r\n"
					+ "and st.location_code =z.location_code  and st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDigiGoldCreditRowMapper());
		return reader;
	}
	
	//RESIDUAL REFUND Credit -- need to be implemented
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerResidualRefundCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "Select 'Residual Value Refund' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit, pr.amount as credit_amount, '' as debit_amount, pr.payment_code ,  cn.credit_note_type, \r\n"
					+ "										(Select gl_code from payments.dbo.gl_boutique_payment_mapping Where location_code = z.location_code and payment_code = 'Cash') as gl_code, cn.doc_no, \r\n"
					+ "					 					pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center \r\n"
					+ "					 					FROM sales.dbo.credit_note cn inner join locations.dbo.location_master lm on lm.location_code = cn.location_code \r\n"
					+ "										inner join locations.dbo.country_master cm on lm.country_code = cm.country_code \r\n"
					+ "										inner join  sales.dbo.payment_refunds pr on pr.credit_note_id=cn.id \r\n"
					+ "										left join payments.dbo.gl_boutique_code_master gbcm on cn.location_code = gbcm.location_code\r\n"
					+ "					where cn.status='CANCELLED' and lm.owner_type !='L3' and pr.is_residual_refund=1\r\n"
					+ "				      and cn.location_code =z.location_code   "
					
					+ "and pr.reversal_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = " Select 'Residual Value Refund' as type_of_transaction, cn.debit_note_fiscal_year , 'N' as is_debit, pr.amount as credit_amount, '' as debit_amount,pr.payment_code ,cn.credit_note_type, \r\n"
					+ "										(Select gl_code from payments.dbo.gl_boutique_payment_mapping Where location_code = z.location_code and payment_code = 'Cash') as gl_code, cn.doc_no, \r\n"
					+ "					 					pr.reversal_date as business_date , cm.seg_no, cn.location_code, gbcm.cost_center \r\n"
					+ "					 					FROM sales.dbo.credit_note cn inner join locations.dbo.location_master lm on lm.location_code = cn.location_code \r\n"
					+ "										inner join locations.dbo.country_master cm on lm.country_code = cm.country_code \r\n"
					+ "										inner join  sales.dbo.payment_refunds pr on pr.credit_note_id=cn.id \r\n"
					+ "										left join payments.dbo.gl_boutique_code_master gbcm on cn.location_code = gbcm.location_code,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.status='CANCELLED' and lm.owner_type !='L3' and pr.is_residual_refund=1\r\n"
					+ "				      and cn.location_code =z.location_code  and pr.reversal_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteCancelledRowMapper());
		return reader;
	}

	//ResidualRefundDebit
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerResidualRefundDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='Residual Value Refund'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='Residual Value Refund'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//Txn_Type (ADV,TEP,GEP,GRN etc) CN Cancellation Deduction amount CreditStaging Step
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCnCancelDeductionAmtCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cn.credit_note_type, cn.refund_deduction  as credit_amount, '' as debit_amount\r\n"
					+ ", gbcm.gl_code as gl_code,\r\n"
					+ "cn.doc_date as business_date , cn.debit_note_fiscal_year,  cm.seg_no, cn.location_code, gbcm.cost_center\r\n"
					+ "FROM sales.dbo.credit_note cn,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm\r\n"
					+ "where cn.refund_deduction!=0 and cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and\r\n"
					+ "cn.location_code = gbcm.location_code  and lm.owner_type !='L3' and cn.credit_note_type in ('ADV','BILL_CANCELLATION','GEP','GHS','GRN','TEP') \r\n"
					
					+ "and cn.cancel_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select cn.credit_note_type, cn.refund_deduction  as credit_amount, '' as debit_amount\r\n"
					+ ", gbcm.gl_code as gl_code,\r\n"
					+ "cn.doc_date as business_date , cn.debit_note_fiscal_year, cm.seg_no, cn.location_code, gbcm.cost_center\r\n"
					+ "FROM sales.dbo.credit_note cn,locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.refund_deduction!=0 and cn.status='CANCELLED'  and lm.country_code = cm.country_code and lm.location_code = cn.location_code and\r\n"
					+ "cn.location_code = gbcm.location_code  and lm.owner_type !='L3' and cn.credit_note_type in ('ADV','BILL_CANCELLATION','GEP','GHS','GRN','TEP') \r\n"
					+ "and cn.location_code =z.location_code  and cn.cancel_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCnCancelDeductionAmtRowMapper());
		return reader;
	}
	
	//ADV CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerAdvCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='ADV CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='ADV CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//BC CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerBcCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='BC CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='BC CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//GEP CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerGepCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='GEP CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='GEP CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2, z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}

	//GHS CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerGhsCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='GHS CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='GHS CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}

	//GRN CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerGrnCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='GRN CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='GRN CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2, z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//TEP CNCAN Deduction AMT Debit Staging
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerTepCnCancelDeductionDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			@Value("#{jobParameters['" + FileIntegrationConstants.LOCATION_CODE + "']}") String locationCode
			) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate) && !StringUtils.isEmpty(locationCode)) {
			sql = "select gls.attribute2 as type_of_transaction,Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code='"+ locationCode +"') as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls \r\n"
					+ "					where gls.attribute2='TEP CNCAN Deduction AMT'  and  gls.attribute3='"+ locationCode +"' and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') ='"+ transactionDate +"'\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2 ";
					
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_cr as float),0)) as debit_amount, \r\n"
					+ "					'' as credit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "(select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					from  [FILE].dbo.general_ledger_stage gls,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2='TEP CNCAN Deduction AMT'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}
	
	//QCGC Sale
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerQcgcGiftCardCreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'QCGC Gift Card Sale' as type_of_transaction, gd.total_value as credit_amount, '' as debit_amount, gd.instrument_no as gift_card_no, \r\n"
					+ "st.doc_no as cm_doc_no, st.doc_date as business_date, st.location_code\r\n"
					+ ",gbcm.gl_code as gl_code,cm.seg_no,  gbcm.cost_center, st.fiscal_year\r\n"
					+ ", \r\n"
					+ " ''  as payment_code"
					+ "FROM sales.dbo.[gift_details] gd, sales.dbo.sales_transaction st,\r\n"
					+ "locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm \r\n"
					+ "where st.status in ('CONFIRMED', 'CANCELLED') and st.txn_type='CM' and  gd.cash_memo_id=st.id and lm.country_code = cm.country_code and lm.location_code = st.location_code and\r\n"
					+ "st.location_code = gbcm.location_code  and lm.owner_type !='L3'  \r\n"
					
					+ "and st.doc_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select 'QCGC Gift Card Sale' as type_of_transaction, gd.total_value as credit_amount, '' as debit_amount, gd.instrument_no as gift_card_no, \r\n"
					+ "st.doc_no as cm_doc_no, st.doc_date as business_date, st.location_code\r\n"
					+ ",gbcm.gl_code as gl_code,cm.seg_no,  gbcm.cost_center, st.fiscal_year\r\n"
					+ ", \r\n"
					+ " ''  as payment_code \r\n"
					+ "FROM sales.dbo.[gift_details] gd, sales.dbo.sales_transaction st,\r\n"
					+ "locations.dbo.country_master cm, locations.dbo.location_master lm, \r\n"
					+ "payments.dbo.gl_boutique_code_master gbcm , \r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where   st.status in ('CONFIRMED', 'CANCELLED') and st.txn_type='CM' and lm.country_code = cm.country_code and lm.location_code = st.location_code \r\n"
					+ "					 					  and lm.owner_type !='L3' \r\n"
					+ "										  and gbcm.location_code = st.location_code and gd.cash_memo_id=st.id\r\n"
					+ "					 					  and st.sub_txn_Type = 'GIFT_SALE'\r\n"
					+ "					 					 and st.location_code =z.location_code  and st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerQcgcGiftCardRowMapper());
		return reader;
	}
	
	//QCGC SALE DEBIT
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerQcgcGiftCardDebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select'QCGC Gift Card Sale' as type_of_transaction, sum(pd.amount) as debit_amount , '' as credit_amount, ''  as gift_card_no, st.doc_no as cm_doc_no, st.doc_date as business_date, st.location_code\r\n"
					+ ",gbcm.gl_code as gl_code ,cm.seg_no  ,gbcm.cost_center, st.fiscal_year, case when pd.payment_code='CREDIT NOTE' then 'CN' when pd.payment_code='CARD' then 'CC' \r\n"
					+ "else pd.payment_code end as payment_code \r\n"
					+ " FROM sales.dbo.sales_transaction st inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id\r\n"
					+ " inner join locations.dbo.location_master lm on lm.location_code = st.location_code \r\n"
					+ "left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.Location_Code\r\n"
					+ "left join payments.dbo.gl_boutique_payment_mapping gl on gl.payment_code = pd.payment_code \r\n"
					+ " and gl.location_code = st.location_code, \r\n"
					+ "locations.dbo.country_master cm   \r\n"
					+ "where  st.location_code='tbg' and st.status in ('CONFIRMED', 'CANCELLED') and st.txn_type='CM' and lm.country_code = cm.country_code and lm.location_code = st.location_code \r\n"
					+ "					  and lm.owner_type !='L3' and pd.payment_code <> 'CREDIT NOTE'-- and gbcm.location_code = st.location_code and gl.location_code = st.location_code\r\n"
					+ "			and pd.status = 'COMPLETED'		  and st.sub_txn_Type = 'GIFT_SALE'\r\n"
					+ "					  and st.doc_date = '" + transactionDate + "' \r\n"
					+ "					 group by pd.payment_code,  st.doc_no , st.doc_date , st.location_code\r\n"
					+ "					 ,gbcm.gl_code ,cm.seg_no,  gbcm.cost_center, st.fiscal_year  \r\n"
					
					+ "and st.doc_date ='\r\n"
					+ transactionDate + "'";
		} else {
			sql = "select'QCGC Gift Card Sale' as type_of_transaction, sum(pd.amount) as debit_amount , '' as credit_amount, ''  as gift_card_no, st.doc_no as cm_doc_no, st.doc_date as business_date, st.location_code\r\n"
					+ "					 ,gl.gl_code as gl_code ,cm.seg_no  ,gbcm.cost_center, st.fiscal_year, case when pd.payment_code='CREDIT NOTE' then 'CN' when pd.payment_code='CARD' then 'CC' \r\n"
					+ "					 else pd.payment_code end as payment_code \r\n"
					+ "					  FROM sales.dbo.sales_transaction st inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id\r\n"
					+ "					  inner join locations.dbo.location_master lm on lm.location_code = st.location_code \r\n"
					+ "					 left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = st.Location_Code\r\n"
					+ "					 left join payments.dbo.gl_boutique_payment_mapping gl on gl.payment_code = pd.payment_code \r\n"
					+ "					  and gl.location_code = st.location_code, \r\n"
					+ "					 locations.dbo.country_master cm , \r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where   st.status in ('CONFIRMED', 'CANCELLED') and st.txn_type='CM' and lm.country_code = cm.country_code and lm.location_code = st.location_code \r\n"
					+ "					 					  and lm.owner_type !='L3' \r\n"
					+ "										  and gbcm.location_code = st.location_code \r\n"
					+ "					 	and pd.status = 'COMPLETED'	 and st.sub_txn_Type = 'GIFT_SALE'\r\n"
					+ "					 					 and st.location_code =z.location_code  and st.doc_date = z.business_date\r\n"
					+ "					 					 group by pd.payment_code,  st.doc_no , st.doc_date , st.location_code\r\n"
					+ "					 					 ,gl.gl_code ,cm.seg_no,  gbcm.cost_center, st.fiscal_year  ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerQcgcGiftCardRowMapper());
		return reader;
	}
	
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveL3DebitStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select 'Credit Note Received-L3' as type_of_transaction, cnt.src_location_code, sum(cn.amount) as debit_amount,'' as credit_amount, cn.doc_date as business_date, \r\n"
					+ "					 		cnt.fiscal_year, cm.seg_no ,cn.location_code, gbcm.cost_center, cnt.dest_location_code, gbcm.gl_code, dest_lm.region_code\r\n"
					+ "					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year and cn.location_code = cnt.dest_location_code \r\n"
					+ "					 							  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code \r\n"
					+ "												  inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 							  inner join locations.dbo.country_master cm on cm.country_code = src_lm.country_code\r\n"
					+ "												  left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = cnt.src_location_code \r\n"
					+ "where cnt.status ='RECEIVED' and src_lm.owner_type  in ('L3') and dest_lm.owner_type in ('L1', 'L2') and cn.ref_doc_type = 'CN_IBT' and\r\n"
					+ "					 					 cn.location_code = z.location_code  \r\n"
					+ "					 					 and cn.doc_date = z.business_date \r\n"
					+ "and cn.doc_date='"
					+ transactionDate + "'"
					+ "	group by cnt.src_location_code, cn.doc_date, cnt.fiscal_year, cm.seg_no, cn.location_code, gbcm.cost_center, gbcm.gl_code, cnt.dest_Location_Code,\r\n"
					+ "										 dest_lm.region_code";

		} else {
			sql = "select 'Credit Note Received-L3' as type_of_transaction, cnt.src_location_code, sum(cn.amount) as debit_amount,'' as credit_amount, cn.doc_date as business_date, \r\n"
					+ "					 		cnt.fiscal_year, cm.seg_no ,cn.location_code, gbcm.cost_center, cnt.dest_location_code, gbcm.gl_code, dest_lm.region_code\r\n"
					+ "					 from sales.dbo.credit_note cn inner join sales.dbo.credit_note_transfer cnt on cn.ref_doc_no = cnt.doc_no and cn.ref_fiscal_year = cnt.fiscal_year and cn.location_code = cnt.dest_location_code \r\n"
					+ "					 							  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code \r\n"
					+ "												  inner join locations.dbo.location_master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					 							  inner join locations.dbo.country_master cm on cm.country_code = src_lm.country_code\r\n"
					+ "												  left join payments.dbo.gl_boutique_code_master gbcm on gbcm.location_code = cnt.src_location_code ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cnt.status ='RECEIVED' and src_lm.owner_type  in ('L3') and dest_lm.owner_type in ('L1', 'L2') and cn.ref_doc_type = 'CN_IBT' and\r\n"
					+ "					 					 cn.location_code = z.location_code  \r\n"
					+ "					 					 and cn.doc_date = z.business_date \r\n"
					+ "					 					 group by cnt.src_location_code, cn.doc_date, cnt.fiscal_year, cm.seg_no, cn.location_code, gbcm.cost_center, gbcm.gl_code, cnt.dest_Location_Code,\r\n"
					+ "										dest_lm.region_code ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerCreditNoteReceiveL3RowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerCreditNoteReceiveL3CreditStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_dr as float),0)) as credit_amount, \r\n"
					+ "					 					'' as debit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "					 (select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					 					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					 					from  [FILE].dbo.general_ledger_stage gls\r\n"
					+ "where gls.attribute2 like 'Credit Note Received-L3%'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					 					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					 					gls.create_date,gls.attribute2,z.location_code "
					+ "and cn.doc_date='"
					+ transactionDate + "'";
		} else {
			sql = "select gls.attribute2 as type_of_transaction, Sum(isnull(cast(gls.entered_dr as float),0)) as credit_amount, \r\n"
					+ "					 					'' as debit_amount,gls.attribute3 as location_code,gls.attribute1,gls.seg1 as seg_no,gls.seg2 as cost_center,\r\n"
					+ "					 (select gl_code from payments.dbo.gl_boutique_code_master gbcm where location_code= z.location_code ) as  gl_code, \r\n"
					+ "					 					gls.period_name as period_name,gls.ac_g_date as ac_g_date,gls.create_date as create_date\r\n"
					+ "					 					from  [FILE].dbo.general_ledger_stage gls ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where gls.attribute2 like 'Credit Note Received-L3%'  and gls.attribute3=z.location_code and format(cast(gls.attribute1 as date ),'yyyy-MM-dd') =z.business_date\r\n"
					+ "					 					group by gls.attribute3,gls.attribute1,gls.seg1,gls.seg2,gls.period_name,gls.ac_g_date,\r\n"
					+ "					 					gls.create_date,gls.attribute2,z.location_code";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGeneralLedgerDebitRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<GeneralLedgerDto> generalLedgerFileReader(
			@Value("#{jobExecutionContext['generalLedgerTransactionId']}") String fileId) {
		JdbcCursorItemReader<GeneralLedgerDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from general_ledger_stage where file_id ='" + fileId + "'");
		reader.setRowMapper(getGeneralLedgerFileReaderRowMapper());
		return reader;
	}

	@Bean
	public GeneralLedgerBankingEntryRowMapper getGeneralLedgerBankingEntryRowMapper() {
		return new GeneralLedgerBankingEntryRowMapper();
	}

	@Bean
	public GeneralLedgerAdvanceReceivedRowMapper getGeneralLedgerAdvanceReceivedRowMapper() {
		return new GeneralLedgerAdvanceReceivedRowMapper();
	}

	@Bean
	GeneralLedgerFileReaderRowMapper getGeneralLedgerFileReaderRowMapper() {
		return new GeneralLedgerFileReaderRowMapper();
	}

	@Bean
	GeneralLedgerCreditNoteReceiveRowMapper getGeneralLedgerCreditNoteReceiveRowMapper() {
		return new GeneralLedgerCreditNoteReceiveRowMapper();
	}
	
	@Bean
	GeneralLedgerCreditNoteReceiveIbtRowMapper getGeneralLedgerCreditNoteReceiveIbtRowMapper() {
		return new GeneralLedgerCreditNoteReceiveIbtRowMapper();
	}


	@Bean
	GeneralLedgerGepTepCancelledRowMapper getGeneralLedgerGepCancelledRowMapper() {
		return new GeneralLedgerGepTepCancelledRowMapper();
	}

	@Bean
	GeneralLedgerCreditNoteCancelledRowMapper getGeneralLedgerCreditNoteCancelledRowMapper() {
		return new GeneralLedgerCreditNoteCancelledRowMapper();
	}
	
	@Bean
	GeneralLedgerDebitRowMapper getGeneralLedgerDebitRowMapper() {
		return new GeneralLedgerDebitRowMapper();
	}
	
	@Bean
	GeneralLedgerTepCashRefundRowMapper getGeneralLedgerTepCashRefundRowMapper() {
		return new GeneralLedgerTepCashRefundRowMapper();
	}
	
	@Bean
	GeneralLedgerTepRORefundRowMapper getGeneralLedgerTepRoRefundRowMapper() {
		return new GeneralLedgerTepRORefundRowMapper();
	}
	
	@Bean
	GeneralLedgerReversalTepRefundRowMapper getGeneralLedgerReversalTepRefundRowMapper() {
		return new GeneralLedgerReversalTepRefundRowMapper();
	}
	
	@Bean
	GeneralLedgerDigiGoldCreditRowMapper getGeneralLedgerDigiGoldCreditRowMapper() {
		return new GeneralLedgerDigiGoldCreditRowMapper();
	}
	
	@Bean
	GeneralLedgerCnCancelDeductionAmtRowMapper getGeneralLedgerCnCancelDeductionAmtRowMapper() {
		return new GeneralLedgerCnCancelDeductionAmtRowMapper();
	}
	
	@Bean
	GeneralLedgerQcgcGiftCardRowMapper getGeneralLedgerQcgcGiftCardRowMapper() {
		return new GeneralLedgerQcgcGiftCardRowMapper();
	}
	
	@Bean
	GeneralLedgerCreditNoteReceiveL3RowMapper getGeneralLedgerCreditNoteReceiveL3RowMapper() {
		return new GeneralLedgerCreditNoteReceiveL3RowMapper();
	}

}