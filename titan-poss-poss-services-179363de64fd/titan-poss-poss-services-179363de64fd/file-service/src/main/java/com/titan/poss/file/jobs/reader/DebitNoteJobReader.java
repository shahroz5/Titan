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
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.DebitNoteDto;
import com.titan.poss.file.jobs.mapper.CmRoundingOffRowMapper;
import com.titan.poss.file.jobs.mapper.CreditNoteReceiptL3RowMapper;
import com.titan.poss.file.jobs.mapper.CreditNoteRowMapper;
import com.titan.poss.file.jobs.mapper.CreditNoteTransferL3RowMapper;
import com.titan.poss.file.jobs.mapper.DebitNoteFileStepMapper;
import com.titan.poss.file.jobs.mapper.DigiGoldRowMapper;
import com.titan.poss.file.jobs.mapper.GiftCardQcgcRedeemL3RowMapper;
import com.titan.poss.file.jobs.mapper.GiftCardQcgcSaleL3RowMapper;
import com.titan.poss.file.jobs.mapper.GvRedeemL3RowMapper;
import com.titan.poss.file.jobs.mapper.GvSaleL3RowMapper;
import com.titan.poss.file.jobs.mapper.PaymentReversalRowMapper;
import com.titan.poss.file.jobs.mapper.GrnDebitNoteRowMapper;
import com.titan.poss.file.jobs.mapper.TcsDebitNoteRowMapper;
import com.titan.poss.file.jobs.mapper.TcsReversalDebitNoteRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class DebitNoteJobReader {

	@Autowired
	private DataSource dataSource;

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> cmRoundingOffStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = " select Sum(CMGRN.Rounding_Variance) AS rounding_variance, CMGRN.SAP_Code as sap_code, CMGRN.Fiscal_year, CMGRN.location_code, CMGRN.doc_date, CMGRN.currency_code, CMGRN.txn_type FROM \r\n"
					+ " (\r\n" 
					+ " SELECT \r\n"
					+ " SUM(cm.rounding_variance)as rounding_variance,JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code, st.fiscal_year , st.location_code, st.doc_date\r\n"
					+ " ,st.currency_code, st.txn_type \r\n"
					+ " FROM sales.dbo.sales_transaction st inner join sales.dbo.cash_memo cm on cm.id = st.id inner join locations.dbo.location_master lm on lm.location_code = st.location_code "
					 
					+ "  WHERE st.doc_date =  '"+ transactionDate + "' \r\n"
					+ "  AND  st.location_code = z.location_code\r\n"
					+ "  AND st.Status = 'CONFIRMED' and (cm.rounding_variance is not null or cm.rounding_variance !=0 ) \r\n"
					+ "  GROUP BY st.Doc_Date, JSON_VALUE(lm.banking_details ,'$.data.sapCode'), fiscal_year, st.location_code, st.currency_code,st.txn_type \r\n"
					+ "  union \r\n"
					+ "  SELECT \r\n"
					+ "  SUM(gr.rounding_variance)*-1 as rounding_variance,JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code,rt.fiscal_year, rt.location_code, rt.doc_date\r\n"
					+ "  ,rt.currency_code, rt.txn_type\r\n"
					+ "  from sales.dbo.goods_return gr inner join sales.dbo.refund_transaction rt on gr.id=rt.id\r\n"
					+ "  inner join locations.dbo.location_master lm on lm.location_code=rt.location_code"
					
					+ "  WHERE rt.doc_date = '" + transactionDate + "'and \r\n"
					+ "  rt.location_code = z.location_code  and \r\n"
					+ "  rt.Status = 'Confirmed' and (gr.rounding_variance is not null or gr.rounding_variance !=0 ) \r\n"
					+ "  GROUP BY rt.doc_date,JSON_VALUE(lm.banking_details ,'$.data.sapCode'),rt.fiscal_year, rt.doc_date, rt.location_code, rt.currency_code, rt.txn_type \r\n"
					+ "  ) CMGRN inner join locations.dbo.location_master lm on lm.location_code = CMGRN.location_code "
					+ "  where lm.owner_type!= 'L3' and  CMGRN.location_code = z.location_code \r\n"
					+ "  and CMGRN.doc_date= '" + transactionDate + "' \r\n"
					+ "  GROUP by CMGRN.fiscal_year,CMGRN.SAP_Code, CMGRN.location_code,cmgrn.doc_date ,  CMGRN.currency_code, CMGRN.txn_type ";
		} 
		
		
		
		else {
			sql = "select Sum(CMGRN.Rounding_Variance) AS rounding_variance, CMGRN.SAP_Code as sap_code, CMGRN.Fiscal_year, CMGRN.location_code, CMGRN.doc_date , CMGRN.currency_code, CMGRN.txn_type FROM \r\n"
					+ "(\r\n"
					+ "SELECT\r\n"
					+ "SUM(cm.rounding_variance)as rounding_variance,JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code, st.fiscal_year , st.location_code, st.doc_date \r\n"
					+ ",st.currency_code, st.txn_type \r\n"
					+ " FROM sales.dbo.sales_transaction st inner join sales.dbo.cash_memo cm on cm.id = st.id inner join locations.dbo.location_master lm on lm.location_code = st.location_code , "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " WHERE st.doc_date = z.business_date \r\n"
					+ " AND st.location_code = z.location_code\r\n"
					+ " AND st.Status = 'CONFIRMED' and (cm.rounding_variance is not null or cm.rounding_variance !=0 ) \r\n"
					+ " GROUP BY st.Doc_Date, JSON_VALUE(lm.banking_details ,'$.data.sapCode'), fiscal_year, st.location_code , st.currency_code,st.txn_type "
					+ " union "
					+ " SELECT \r\n"
					+ " SUM(gr.rounding_variance)*-1 as rounding_variance,JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code,rt.fiscal_year, rt.location_code, rt.doc_date\r\n"
					+ " ,rt.currency_code, rt.txn_type "
					+ " from sales.dbo.goods_return gr inner join sales.dbo.refund_transaction rt on gr.id=rt.id\r\n"
					+ " inner join locations.dbo.location_master lm on lm.location_code=rt.location_code ,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "\r\n"
					+ " WHERE rt.doc_date = z.business_date and \r\n"
					+ " rt.location_code = z.location_code and \r\n"
					+ " rt.Status = 'Confirmed' and (gr.rounding_variance is not null or gr.rounding_variance != 0 ) \r\n"
					+ " GROUP BY rt.doc_date,JSON_VALUE(lm.banking_details ,'$.data.sapCode'),rt.fiscal_year, rt.doc_date, rt.location_code , rt.currency_code, rt.txn_type \r\n"
					+ " ) CMGRN inner join locations.dbo.location_master lm on lm.location_code = CMGRN.location_code , "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where lm.owner_type!= 'L3' and  CMGRN.location_code = z.location_code \r\n"
					+ " and CMGRN.doc_date=z.business_date \r\n"
					+ "GROUP by CMGRN.fiscal_year,CMGRN.SAP_Code, CMGRN.location_code,cmgrn.doc_date , CMGRN.currency_code, CMGRN.txn_type ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(3, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(4, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(5, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(6, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getCmRoundingOffRowMapper());
		return reader;
	}
		
//	@Bean(destroyMethod = "")
//	@StepScope
//	public JdbcCursorItemReader<DebitNoteDto> cmRoundingOffStagingReader(
//			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
//		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
//		reader.setDataSource(dataSource);
//		String sql = null;
//		if (!StringUtils.isEmpty(transactionDate)) {
//			sql = "select ct.doc_date,ct.location_code ,ct.fiscal_year,st.txn_type,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, cm.rounding_variance "
//					+ "from sales.dbo.refund_transaction ct inner join sales.dbo.sales_transaction st on ct.ref_sales_id = st.id "
//					+ "inner join sales.dbo.cash_memo cm on st.id = cm.id and cm.is_migrated = 'false' inner join locations.dbo.location_master lm on ct.location_code = lm.location_code where lm.owner_type!= 'L3' and cm.rounding_variance != 0 and ct.doc_date ='"
//					+ transactionDate + "';";
//		} else {
//			sql = "select ct.doc_date,ct.location_code ,ct.fiscal_year,st.txn_type,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, cm.rounding_variance\r\n"
//					+ " from sales.dbo.refund_transaction ct, sales.dbo.sales_transaction st, sales.dbo.cash_memo cm,locations.dbo.location_master lm,\r\n"
//					+ FileIntegrationConstants.BUSINESS_DAY_SQL
//					+ " where lm.owner_type!= 'L3' and cm.rounding_variance != 0 and ct.ref_sales_id = st.id and ct.location_code = lm.location_code and cm.is_migrated = 'false' and st.id = cm.id and st.location_code =z.location_code  and  st.doc_date = z.business_date";
//			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
//				public void setValues(PreparedStatement preparedStatement) throws SQLException {
//					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
//					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
//				}
//			});
//		}
//		reader.setSql(sql);
//		reader.setRowMapper(getCmRoundingOffRowMapper());
//		return reader;
//	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> paymentReversalStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.doc_no, ct.doc_date,ct.location_code ,ct.fiscal_year,st.txn_type,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code,"
					+ "pr.payment_code, pr.amount from sales.dbo.refund_transaction ct inner join sales.dbo.payment_refunds pr on ct.id =pr.cancel_txn_id inner join sales.dbo.sales_transaction st on ct.ref_sales_id = st.id "
					+ "inner join locations.dbo.location_master lm on ct.location_code = lm.location_code where lm.owner_type!= 'L3' and  ct.txn_type='CMCAN' and  ct.doc_date ='"
					+ transactionDate + "';";
		} else {
			sql = "select st.doc_no, ct.doc_date,ct.location_code ,ct.fiscal_year,st.txn_type,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code\r\n"
					+ ",pr.payment_code, pr.amount from sales.dbo.refund_transaction ct , sales.dbo.payment_refunds pr, sales.dbo.sales_transaction st , locations.dbo.location_master lm,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where lm.owner_type!= 'L3' and  ct.txn_type='CMCAN' and  ct.id =pr.cancel_txn_id and  ct.ref_sales_id = st.id and ct.location_code = lm.location_code and \r\n"
					+ "ct.location_code =z.location_code  and  ct.doc_date = z.business_date ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getPaymentReversalRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> creditNoteStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select  ct.doc_no, ct.doc_date,ct.location_code ,ct.fiscal_year,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code"
					+ ", cn.amount from sales.dbo.refund_transaction ct inner join locations.dbo.location_master lm "
					+ "on ct.location_code = lm.location_code inner join sales.dbo.credit_note cn on ct.id = cn.ref_cancel_id inner join sales.dbo.sales_transaction st on ct.ref_sales_id = st.id"
					+ "where lm.owner_type!= 'L3' and cn.id=cn.original_cn_id " // and cn.credit_note_type != 'TCS_CREDIT_NOTE' "
					+ "and  ct.txn_type='CMCAN'and ct.doc_date ='" + transactionDate + "'";
		} else {
			sql = "select ct.doc_no,  ct.doc_date,ct.location_code ,st.txn_type, ct.fiscal_year,ct.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code\r\n"
					+ ", cn.amount from sales.dbo.refund_transaction ct, locations.dbo.location_master lm , sales.dbo.credit_note cn, sales.dbo.sales_transaction st,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where lm.owner_type!= 'L3' and  ct.txn_type ='CMCAN' and ct.location_code = lm.location_code and cn.id=cn.original_cn_id and ct.id = cn.cancel_txn_id and ct.ref_sales_id = st.id \r\n"
				//	+ " and cn.credit_note_type != 'TCS_CREDIT_NOTE' " commented based on achyut's feedback
					+ "and ct.location_code =z.location_code  and  ct.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getCreditNoteRowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> goodsReturnReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select  'GRN' as debit_type,cn.doc_no, rt.location_code, rt.fiscal_year,rt.doc_date, cn.amount as amount, st.currency_code, rt.txn_type, \r\n"
					+ "					  JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code\r\n"
					+ "					 					from  sales.dbo.refund_transaction rt \r\n"
					+ "					 					inner join sales.dbo.credit_note cn on cn.cancel_txn_id= rt.id  \r\n"
					+ "					 					inner join locations.dbo.location_master lm on rt.location_code=lm.location_code\r\n"
					+ "					 					inner join sales.dbo.sales_transaction st on st.id=rt.ref_sales_id \r\n"
					+ "					where rt.txn_type='GRN'  and rt.status='CONFIRMED' \r\n"
					+ "					  and rt.doc_no=cn.ref_doc_no and rt.fiscal_year=cn.ref_fiscal_year and cn.ref_doc_type='GRN' and lm.owner_type!='L3' "
					+ "and rt.doc_date ='" + transactionDate + "'";
		} else {
			sql = "select  'GRN' as debit_type,cn.doc_no, rt.location_code, rt.fiscal_year,rt.doc_date, cn.amount as amount, st.currency_code, rt.txn_type, \r\n"
					+ "					  JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code\r\n"
					+ "					 					from  sales.dbo.refund_transaction rt \r\n"
					+ "					 					inner join sales.dbo.credit_note cn on cn.cancel_txn_id= rt.id  \r\n"
					+ "					 					inner join locations.dbo.location_master lm on rt.location_code=lm.location_code\r\n"
					+ "					 					inner join sales.dbo.sales_transaction st on st.id=rt.ref_sales_id, "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "  where rt.txn_type='GRN'  and rt.status='CONFIRMED' \r\n"
					+ "					  and rt.doc_no=cn.ref_doc_no and rt.fiscal_year=cn.ref_fiscal_year and cn.ref_doc_type='GRN'\r\n"
					+ "					  and rt.location_code =z.location_code  and  rt.doc_date = z.business_date and lm.owner_type!='L3' ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGrnDebitNoteRowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> goodsReturnEncircleReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "SELECT  'Encircle' as debit_type, st.doc_no , rt.location_code  ,rt.fiscal_year, rt.doc_date, pd.amount, st.currency_code, rt.txn_type,\r\n"
					+ "						  JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code									\r\n"
					+ "					FROM    \r\n"
					+ "							sales.dbo.REFUND_TRANSACTION rt inner join sales.dbo.sales_transaction st\r\n"
					+ "							on st.id = rt.ref_sales_id inner join locations.dbo.location_master lm on lm.location_code = rt.location_code\r\n"
					+ "							inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id\r\n"
					
					+ "	WHERE           \r\n"
					+ "							pd.payment_code = 'Encircle' and pd.status = 'COMPLETED'	\r\n"
					+ "							and rt.txn_type in ( 'GRN','CMCAN') and rt.status = 'Confirmed'	and lm.owner_type!= 'L3'	 "
					+ "and rt.doc_date ='" + transactionDate + "'";
		} else {
			sql = "SELECT  'Encircle' as debit_type, st.doc_no , rt.location_code  ,rt.fiscal_year, rt.doc_date, pd.amount, st.currency_code, rt.txn_type,\r\n"
					+ "						  JSON_VALUE(lm.banking_details ,'$.data.sapCode') as sap_code									\r\n"
					+ "					FROM    \r\n"
					+ "							sales.dbo.REFUND_TRANSACTION rt inner join sales.dbo.sales_transaction st\r\n"
					+ "							on st.id = rt.ref_sales_id inner join locations.dbo.location_master lm on lm.location_code = rt.location_code\r\n"
					+ "							inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "WHERE           \r\n"
					+ "							pd.payment_code = 'Encircle' and pd.status = 'COMPLETED'	\r\n"
					+ "							and pd.amount >0  and rt.txn_type in ( 'GRN','CMCAN') and rt.status = 'Confirmed'	"
					
					+ "					  and rt.location_code =z.location_code  and  rt.doc_date = z.business_date and lm.owner_type!='L3' ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGrnDebitNoteRowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> tcsCollectedReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.doc_date, ctd.fiscal_year, ctd.doc_no, ctd.tcs_amount_paid, ctd.location_code,st.currency_code,\r\n"
					+ "JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code \r\n"
					+ "from sales.dbo.customer_tcs_details ctd\r\n"
					+ "inner join locations.dbo.location_master lm on lm.location_code=ctd.location_code\r\n"
					+ "inner join sales.dbo.sales_transaction st on st.id=ctd.sales_txn_id"
					+ "					where ctd.tcs_amount_paid>0 and lm.owner_type!='L3'\r\n"
					+ "and st.doc_date ='" + transactionDate + "'";
		} else {
			sql = "select st.doc_date, ctd.fiscal_year, ctd.doc_no, ctd.tcs_amount_paid, ctd.location_code,st.currency_code,\r\n"
					+ "JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code \r\n"
					+ "from sales.dbo.customer_tcs_details ctd\r\n"
					+ "inner join locations.dbo.location_master lm on lm.location_code=ctd.location_code\r\n"
					+ "inner join sales.dbo.sales_transaction st on st.id=ctd.sales_txn_id,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where ctd.tcs_amount_paid>0 and lm.owner_type!='L3'\r\n "
					+ " and ctd.location_code =z.location_code  and  st.doc_date = z.business_date ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getTcsDebitNoteRowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> tcsReversalReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select rt.doc_date, ctd.fiscal_year, ctd.doc_no, -1*ctd.tcs_amount_paid as tcs_amount_paid, ctd.location_code, rt.currency_code,\r\n"
					+ "JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, rt.cancellation_type \r\n"
					+ "from sales.dbo.customer_tcs_details ctd\r\n"
					+ "inner join locations.dbo.location_master lm on lm.location_code=ctd.location_code\r\n"
					+ "inner join  sales.dbo.refund_transaction rt on rt.ref_sales_id=ctd.sales_txn_id"
					+ "	where ctd.tcs_amount_paid>0 and lm.owner_type!='L3'\r\n"
					+ "and rt.doc_date ='" + transactionDate + "'";
		} else {
			sql = "select rt.doc_date, ctd.fiscal_year, ctd.doc_no, -1*ctd.tcs_amount_paid as tcs_amount_paid, ctd.location_code, rt.currency_code,\r\n"
					+ "JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, rt.cancellation_type \r\n"
					+ "from sales.dbo.customer_tcs_details ctd\r\n"
					+ "inner join locations.dbo.location_master lm on lm.location_code=ctd.location_code\r\n"
					+ "inner join  sales.dbo.refund_transaction rt on rt.ref_sales_id=ctd.sales_txn_id,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where ctd.tcs_amount_paid>0 and lm.owner_type!='L3'\r\n "
					+ " and rt.location_code =z.location_code  and  rt.doc_date = z.business_date ";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getTcsReversalDebitNoteRowMapper());
		return reader;
	}

	
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> debitNoteFileReader(
			@Value("#{jobExecutionContext['debitNoteTransactionId']}") String fileId) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from debit_note_stage where file_id ='" + fileId + "'");
		reader.setRowMapper(getDebitNoteFileStepMapper());
		return reader;
	}

	@Bean
	public CmRoundingOffRowMapper getCmRoundingOffRowMapper() {
		return new CmRoundingOffRowMapper();
	}

	@Bean
	public PaymentReversalRowMapper getPaymentReversalRowMapper() {
		return new PaymentReversalRowMapper();
	}

	@Bean
	public CreditNoteRowMapper getCreditNoteRowMapper() {
		return new CreditNoteRowMapper();
	}
	
	@Bean
	public GrnDebitNoteRowMapper getGrnDebitNoteRowMapper() {
		return new GrnDebitNoteRowMapper();
	}
	
	@Bean
	public TcsDebitNoteRowMapper getTcsDebitNoteRowMapper() {
		return new TcsDebitNoteRowMapper();
	}
	
	@Bean
	public TcsReversalDebitNoteRowMapper getTcsReversalDebitNoteRowMapper() {
		return new TcsReversalDebitNoteRowMapper();
	}

	@Bean
	public DebitNoteFileStepMapper getDebitNoteFileStepMapper() {
		return new DebitNoteFileStepMapper();
	}
}