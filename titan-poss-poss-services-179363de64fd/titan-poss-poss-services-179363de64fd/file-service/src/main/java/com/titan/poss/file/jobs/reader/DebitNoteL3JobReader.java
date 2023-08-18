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
import com.titan.poss.file.jobs.mapper.DebitNoteL3FileStepMapper;
import com.titan.poss.file.jobs.mapper.DigiGoldRowMapper;
import com.titan.poss.file.jobs.mapper.GiftCardQcgcRedeemL3RowMapper;
import com.titan.poss.file.jobs.mapper.GiftCardQcgcSaleL3RowMapper;
import com.titan.poss.file.jobs.mapper.GvRedeemL3RowMapper;
import com.titan.poss.file.jobs.mapper.GvSaleL3RowMapper;
import com.titan.poss.file.jobs.mapper.PaymentReversalRowMapper;


@Configuration
public class DebitNoteL3JobReader {

	@Autowired
	private DataSource dataSource;
	
//	@Bean(destroyMethod = "")
//	@StepScope
//	public JdbcCursorItemReader<DebitNoteDto> giftVoucherSaleL3StagingReader(
//			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
//		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
//		reader.setDataSource(dataSource);
//		String sql = null;
//		if (!StringUtils.isEmpty(transactionDate)) {
//			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code \r\n" 
//					+ "  from sales.dbo.sales_transaction st \r\n" 
//					+ "  join locations.dbo.location_master lm on st.location_code = lm.location_code\r\n" 
//					+ "  join payments.dbo.gift_master gm on lm.location_code = gm.location_code\r\n" 
//					+ "  where st.sub_txn_type = 'GIFT_SALE' and lm.owner_type = 'L3' \r\n"
//					+ "  and st.doc_date ='" +  transactionDate + "'";
//		} else {
//			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code \r\n" 
//					+ "  from sales.dbo.sales_transaction st \r\n" 
//					+ "  join locations.dbo.location_master lm on st.location_code = lm.location_code\r\n" 
//					+ "  join payments.dbo.gift_master gm on lm.location_code = gm.location_code, \r\n" 
//					+ 	 FileIntegrationConstants.BUSINESS_DAY_SQL
//					+ "  where st.sub_txn_type = 'GIFT_SALE' and lm.owner_type = 'L3' \r\n"
//					+ "  and st.location_code =z.location_code  and  st.doc_date = z.business_date";
//					
//			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
//				public void setValues(PreparedStatement preparedStatement) throws SQLException {
//					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
//					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
//				}
//			});
//		}
//		reader.setSql(sql);
//		reader.setRowMapper(getGvSaleL3RowMapper());
//		return reader;
//	}
	
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> giftVoucherRedeemL3StagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code  \r\n"
					+ "					  inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id\r\n" + 
					" where pd.payment_code = 'GIFT VOUCHER' and lm.owner_type = 'L3' and st.status='CONFIRMED' \r\n"
					+ "					  and pd.status = 'COMPLETED' and st.location_code =z.location_code  and  st.doc_date = "
					+ transactionDate + "';";
		} else {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code  \r\n"
					+ "					  inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id ,\r\n" 
					+  FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where pd.payment_code = 'GIFT VOUCHER' and lm.owner_type = 'L3' and st.status='CONFIRMED' \r\n"
					+ "					  and pd.status = 'COMPLETED' and st.location_code =z.location_code  and  st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGvRedeemL3RowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> giftCardQcgcSaleL3StagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code, gd.total_value, st.doc_no , gd.instrument_no   \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code  \r\n"
					+ "					  inner join sales.dbo.gift_details gd on gd.cash_memo_id = st.id \r\n" +
					"  where st.sub_txn_type = 'GIFT_SALE' and lm.owner_type = 'L3' and gd.bin_code = 'QCGC' \r\n"
					+ "					  and st.location_code =z.location_code  and  st.doc_date = z.business_date "
					+  transactionDate + "';";
		} else {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code, gd.total_value, st.doc_no , gd.instrument_no   \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code  \r\n"
					+ "					  inner join sales.dbo.gift_details gd on gd.cash_memo_id = st.id , \r\n"  
					+  FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "  where st.sub_txn_type = 'GIFT_SALE' and lm.owner_type = 'L3' and gd.bin_code = 'QCGC' \r\n"
					+ "					  and st.location_code =z.location_code  and  st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGiftCardQcgcSaleL3RowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> giftCardQcgcRedeemL3StagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code,\r\n"
					+ "pd.amount as total_value, st.doc_no , pd.instrument_no   \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  join locations.dbo.location_master lm on st.location_code = lm.location_code   \r\n"
					+ "					  join sales.dbo.payment_details pd on pd.sales_txn_id = st.id \r\n" + 
					"  where pd.payment_code = 'QCGC'  and lm.owner_type = 'L3' and st.status='CONFIRMED' and pd.status = 'COMPLETED' \r\n"
					+ "					  and st.location_code =z.location_code  and  st.doc_date = '"
					+ transactionDate + "';";
		} else {
			sql = "select st.doc_date,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code, lm.cfa_code,\r\n"
					+ "pd.amount as total_value, st.doc_no , pd.instrument_no   \r\n"
					+ "					  from sales.dbo.sales_transaction st   \r\n"
					+ "					  join locations.dbo.location_master lm on st.location_code = lm.location_code   \r\n"
					+ "					  join sales.dbo.payment_details pd on pd.sales_txn_id = st.id ,\r\n" 
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where pd.payment_code = 'QCGC'  and lm.owner_type = 'L3' and st.status='CONFIRMED' and pd.status = 'COMPLETED' \r\n"
					+ "					  and st.location_code =z.location_code  and  st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getGiftCardQcgcRedeemL3RowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> creditNoteTransferL3StagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cnt.transfer_date as doc_date, cnt.src_location_code , cnt.dest_location_code,     \r\n"
					+ "					  src_lm.cfa_code, cn.amount, cn.doc_no, cn.fiscal_year, src_lm.region_code, CASE WHEN st.currency_code is NULL THEN 'INR' ELSE st.currency_code end as currency_code, JSON_VALUE(src_lm.banking_details ,'$.data.sapCode')as sap_code\r\n"
					+ "					  from sales.dbo.credit_note_transfer cnt   \r\n"
					+ "					  inner join sales.dbo.credit_note cn on cnt.src_cn_id = cn.id   \r\n"
					+ "					  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code  \r\n"
					+ "					  inner join locations.dbo.Location_Master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					  left join sales.dbo.sales_transaction st on st.id = cn.sales_txn_Id \r\n" + 
					"where  dest_lm.owner_type in ('L1' ,'L2') and src_lm.owner_type in ('L3') and cn.status ='TRANSFER_IBT' \r\n"
					+ "					 and cnt.status in ('ISSUED', 'RECEIVED') and cnt.src_location_code =z.location_code  and  cnt.transfer_date = "
					//"  where lm.owner_type = 'L3' 
					+" '" + transactionDate + "'";
		} else {
			sql = "select cnt.transfer_date as doc_date, cnt.src_location_code , cnt.dest_location_code,     \r\n"
					+ "					  src_lm.cfa_code, cn.amount, cn.doc_no, cn.fiscal_year, src_lm.region_code, CASE WHEN st.currency_code is NULL THEN 'INR' ELSE st.currency_code end as currency_code, JSON_VALUE(src_lm.banking_details ,'$.data.sapCode')as sap_code\r\n"
					+ "					  from sales.dbo.credit_note_transfer cnt   \r\n"
					+ "					  inner join sales.dbo.credit_note cn on cnt.src_cn_id = cn.id   \r\n"
					+ "					  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code  \r\n"
					+ "					  inner join locations.dbo.Location_Master dest_lm on dest_lm.location_code = cnt.dest_location_code\r\n"
					+ "					  left join sales.dbo.sales_transaction st on st.id = cn.sales_txn_Id , \r\n" 
					+  FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where  dest_lm.owner_type in ('L1' ,'L2') and src_lm.owner_type in ('L3') and cn.status ='TRANSFER_IBT' \r\n"
					+ "					 and cnt.status in ('ISSUED', 'RECEIVED') and cnt.src_location_code =z.location_code  and  cnt.transfer_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getCreditNoteTransferL3RowMapper());
		return reader;
	}
	
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> creditNoteReceiptL3StagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cnt.id,cn.doc_date,cnt.dest_location_code, cnt.src_location_code ,cn.fiscal_year,'INR' as currency_code, JSON_VALUE(dest_lm.banking_details ,'$.data.sapCode')as sap_code, \r\n"
					+ "						json_value(cnt.cn_details, '$.fiscalYear') as src_fiscal_year, cn.fiscal_year as dest_fiscal_year,\r\n"
					+ "					  dest_lm.cfa_code, cn.amount,  json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no , cn.doc_no as dest_cn_doc_no, cn.fiscal_year, dest_lm.region_code\r\n"
					+ "					  from sales.dbo.credit_note_transfer cnt   \r\n"
					+ "					  inner join sales.dbo.credit_note cn on cnt.doc_no = cn.ref_doc_no and cnt.fiscal_year = cn.ref_fiscal_year and cnt.dest_location_code = cn.location_code    \r\n"
					+ "					  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code  \r\n"
					+ "					  inner join locations.dbo.Location_Master dest_lm on dest_lm.location_code = cnt.dest_location_code \r\n" + 
					"  where  dest_lm.owner_type in ('L3') and src_lm.owner_type in ('L1' ,'L2') \r\n"
					+ "					 and cnt.status in ('RECEIVED')\r\n"
					+ "					and  cnt.dest_location_code =z.location_code  \r\n"
					+ "					and  cn.doc_date = "
					//"  where lm.owner_type = 'L3' 
					+" '" +  transactionDate + "'";
		} else {
			sql = "select cnt.id,cn.doc_date,cnt.dest_location_code, cnt.src_location_code ,cn.fiscal_year,'INR' as currency_code, JSON_VALUE(dest_lm.banking_details ,'$.data.sapCode')as sap_code, \r\n"
					+ "						json_value(cnt.cn_details, '$.fiscalYear') as src_fiscal_year, cn.fiscal_year as dest_fiscal_year,\r\n"
					+ "					  dest_lm.cfa_code, cn.amount,  json_value(cnt.cn_details, '$.docNo') as src_cn_doc_no , cn.doc_no as dest_cn_doc_no, cn.fiscal_year, dest_lm.region_code\r\n"
					+ "					  from sales.dbo.credit_note_transfer cnt   \r\n"
					+ "					  inner join sales.dbo.credit_note cn on cnt.doc_no = cn.ref_doc_no and cnt.fiscal_year = cn.ref_fiscal_year and cnt.dest_location_code = cn.location_code    \r\n"
					+ "					  inner join locations.dbo.location_master src_lm on src_lm.location_code = cnt.src_location_code  \r\n"
					+ "					  inner join locations.dbo.Location_Master dest_lm on dest_lm.location_code = cnt.dest_location_code , \r\n" 
					+  FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where  dest_lm.owner_type in ('L3') and src_lm.owner_type in ('L1' ,'L2') \r\n"
					+ "					 and cnt.status in ('RECEIVED')\r\n"
					+ "					and  cnt.dest_location_code =z.location_code  \r\n"
					+ "					and  cn.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getCreditNoteReceiptL3RowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> digiGoldStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select pd.amount, st.doc_date,st.doc_no,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code \r\n"
					+ "										  from sales.dbo.sales_transaction st \r\n"
					+ "					 					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code\r\n"
					+ "					 					  inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id "
					+ " where  pd.payment_code = 'DIGI GOLD TANISHQ' and lm.owner_type = 'L3' \r\n"
					+ "					  and st.status='CONFIRMED' and pd.status = 'COMPLETED' and st.location_code =z.location_code  and  st.doc_date = '" + transactionDate + "'";
		} else {
			sql = " select pd.amount, st.doc_date,st.doc_no,st.location_code ,st.fiscal_year,st.txn_type,st.currency_code,JSON_VALUE(lm.banking_details ,'$.data.sapCode')as sap_code \r\n"
					+ "										  from sales.dbo.sales_transaction st \r\n"
					+ "					 					  inner join locations.dbo.location_master lm on st.location_code = lm.location_code\r\n"
					+ "					 					  inner join sales.dbo.payment_details pd on pd.sales_txn_id = st.id ,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where  pd.payment_code = 'DIGI GOLD TANISHQ' and lm.owner_type = 'L3' \r\n"
					+ "					  and st.status='CONFIRMED' and pd.status = 'COMPLETED' and st.location_code =z.location_code  and  st.doc_date = z.business_date";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getDigiGoldRowMapper());
		return reader;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<DebitNoteDto> debitNoteL3FileReader(
			@Value("#{jobExecutionContext['debitNoteL3TransactionId']}") String fileId) {
		JdbcCursorItemReader<DebitNoteDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from debitnote_level_three_stage where file_id ='" + fileId + "'");
		reader.setRowMapper(getDebitNoteL3FileStepMapper());
		return reader;
	}
	
//	@Bean
//	public GvSaleL3RowMapper getGvSaleL3RowMapper() {
//		return new GvSaleL3RowMapper();
//	}
	
	@Bean
	public GvRedeemL3RowMapper getGvRedeemL3RowMapper() {
		return new GvRedeemL3RowMapper();
	}
	
	@Bean
	public GiftCardQcgcSaleL3RowMapper getGiftCardQcgcSaleL3RowMapper() {
		return new GiftCardQcgcSaleL3RowMapper();
	}
	
	@Bean
	public GiftCardQcgcRedeemL3RowMapper getGiftCardQcgcRedeemL3RowMapper() {
		return new GiftCardQcgcRedeemL3RowMapper();
	}
	
	@Bean
	public CreditNoteTransferL3RowMapper getCreditNoteTransferL3RowMapper() {
		return new CreditNoteTransferL3RowMapper();
	}
	
	@Bean
	public CreditNoteReceiptL3RowMapper getCreditNoteReceiptL3RowMapper() {
		return new CreditNoteReceiptL3RowMapper();
	}
	
	@Bean
	public DigiGoldRowMapper getDigiGoldRowMapper() {
		return new DigiGoldRowMapper();
	}
	
	@Bean
	public DebitNoteL3FileStepMapper getDebitNoteL3FileStepMapper() {
		return new DebitNoteL3FileStepMapper();
	}
	
}
