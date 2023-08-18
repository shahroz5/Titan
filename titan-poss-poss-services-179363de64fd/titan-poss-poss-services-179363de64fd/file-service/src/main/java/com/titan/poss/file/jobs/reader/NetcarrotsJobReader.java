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
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.PreparedStatementSetter;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.NcCustomerTransactionStageDto;
import com.titan.poss.file.dto.NcMemberDataStageDto;
import com.titan.poss.file.dto.NcStoreMasterStageDto;
import com.titan.poss.file.dto.NcTransactionDataStageDto;
import com.titan.poss.file.jobs.mapper.NcCustomerTransactionFileRowMapper;
import com.titan.poss.file.jobs.mapper.NcCustomerTransactionRowMapper;
import com.titan.poss.file.jobs.mapper.NcMemberDataRowMapper;
import com.titan.poss.file.jobs.mapper.NcStoreMasterRowMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Configuration
public class NetcarrotsJobReader {

	@Autowired
	private DataSource dataSource;

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcCustomerTransactionStageDto> customerTransactionCmStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<NcCustomerTransactionStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "  select st.id as txn_id, cmd.id as cash_memo_details_id,\r\n"
					+ " 'Invoice' as txn_type, st.location_code,st.doc_date as transac_doc_date, st.confirmed_time as transaction_time ,\r\n"
					+ " ct.ulp_id , st.doc_no , cmd.row_id , cmd.item_code , cmd.product_group_code ,\r\n"
					+ " cmd.total_quantity , cmd.final_value as gross_amount,\r\n"
					+ " cmd.total_discount, pd.reference_1 as rr_number ,'' as cm_date,'' as cm_doc_no,\r\n"
					+ " '' as brand_name, '' as cm_row_id, '' as cm_location_code, im.is_foc_item ,fsm.is_accrual_ulp,\r\n"
					+ " JSON_VALUE(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') as accural_encircle_points,\r\n"
					+ " COALESCE (pd1.amount / cm.final_value, 0) as tep_line_amount_value,\r\n"
					+ " COALESCE (did1.discount_value, 0) as ghs_discount,\r\n"
					+ " COALESCE (pd2.amount ,0) as encircle_points from\r\n" + " sales.dbo.sales_transaction st\r\n"
					+ "inner join sales.dbo.cash_memo cm on st.id = cm.id and cm.is_migrated = 'false' \r\n"
					+ "inner join sales.dbo.cash_memo_details cmd on\r\n" + " st.id = cmd.cash_memo_id\r\n"
					+ " left outer join sales.dbo.foc_schemes fs on fs.sales_txn_id = st.id\r\n" 
					+ " left outer join configs.dbo.foc_scheme_master fsm on fsm.id= JSON_VALUE(fs.scheme_details, '$.data.schemeId')\r\n"
					+ "left outer join sales.dbo.payment_details pd2 on\r\n"
					+ " pd2.sales_txn_id = cm.id and pd2.sales_txn_id = st.id\r\n"
					+ " and pd2.payment_code = 'ENCIRCLE' and pd2.status = 'CONFIMRED'\r\n"
					+ "left outer join sales.dbo.payment_item_mapping pim on pd2.id = pim.payment_id\r\n"
					+ " and pim.item_id = cmd.id left outer join sales.dbo.payment_details pd1 on\r\n"
					+ " pd1.sales_txn_id = cm.id and pd1.sales_txn_id = st.id\r\n"
					+ " and pd1.payment_code = 'CREDIT NOTE' and pd1.instrument_type = 'TEP'\r\n"
					+ " and pd1.status = 'CONFIMRED'\r\n" + "left outer join sales.dbo.payment_details pd on\r\n"
					+ " st.id = pd.sales_txn_id and pd.payment_code = 'ENCIRCLE'\r\n"
					+ " and pd.status = 'COMPLETED'\r\n" + "left outer join sales.dbo.discount_item_details did on\r\n"
					+ " cmd.id = did.item_id\r\n" + "left outer join sales.dbo.discount_details_sales dd on\r\n"
					+ " did.discount_details_id = dd.id\r\n"
					+ " left outer join sales.dbo.discount_config_details dcd on\r\n"
					+ " dd.discount_config_id = dcd.id\r\n"
					+ " left outer join sales.dbo.discount_item_details did1 on cmd.id = did1.item_id\r\n"
					+ " left outer join sales.dbo.discount_details_sales dd1 on\r\n"
					+ " did1.discount_details_id = dd1.id\r\n" + "and did1.item_id = cmd.id\r\n"
					+ " and dd1.discount_code = 'SYSTEM_DISCOUNT_DV', sales.dbo.customer_transaction ct ,\r\n"
					+ " products.dbo.item_master im where st.id = ct.id\r\n"
					+ " and cmd.item_code = im.item_code and st.status = 'CONFIRMED' and st.txn_type ='CM' and st.doc_date = '"
					+ transactionDate + "'";
		} else {
			sql = "(SELECT          st.id     AS txn_id,cmd.id    AS cash_memo_details_id,'Invoice' AS txn_type,st.location_code,z.business_date,\r\n" + 
					"st.doc_date AS transac_doc_date,st.confirmed_time AS transaction_time, ct.ulp_id ,st.doc_no ,cmd.row_id ,\r\n" + 
					"cmd.item_code\r\n" + 
					", cmd.product_group_code ,cmd.total_quantity ,cmd.final_value AS gross_amount,\r\n" + 
					"cmd.total_discount, pd.reference_1  AS rr_number ,'' AS cm_date,'' AS cm_doc_no,'' AS brand_name,'' AS cm_row_id,\r\n" + 
					"'' AS cm_location_code,im.is_foc_item , fsm.is_accrual_ulp,\r\n" + 
					"json_value(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') AS accural_encircle_points,\r\n" + 
					"COALESCE (pd1.amount / cm.final_value, 0) AS tep_line_amount_value,\r\n" + 
					"COALESCE (did1.discount_value, 0)  AS ghs_discount, COALESCE (pd2.amount ,0) AS encircle_points\r\n" + 
					"FROM           sales.dbo.sales_transaction st\r\n" + 
					"INNER JOIN      sales.dbo.cash_memo cm ON st.id = cm.id\r\n" + 
					"AND             cm.is_migrated = 'false'\r\n" + 
					"INNER JOIN      sales.dbo.cash_memo_details cmd ON             st.id = cmd.cash_memo_id\r\n" + 
					"FULL OUTER JOIN sales.dbo.foc_schemes fs ON              fs.sales_txn_id = st.id\r\n" + 
					"FULL OUTER JOIN configs.dbo.foc_scheme_master fsm ON              fsm.id= json_value(fs.scheme_details, '$.data.schemeId')\r\n" + 
					"LEFT OUTER JOIN sales.dbo.payment_details pd2 ON             pd2.sales_txn_id = cm.id\r\n" + 
					"AND pd2.sales_txn_id = st.id AND  pd2.payment_code = 'ENCIRCLE' AND pd2.status = 'CONFIMRED'\r\n" + 
					"LEFT OUTER JOIN sales.dbo.payment_item_mapping pim ON              pd2.id = pim.payment_id\r\n" + 
					"AND             pim.item_id = cmd.id\r\n" + 
					"LEFT OUTER JOIN sales.dbo.payment_details pd1 ON             pd1.sales_txn_id = cm.id\r\n" + 
					"AND             pd1.sales_txn_id = st.id\r\n" + 
					"AND             pd1.payment_code = 'CREDIT NOTE'\r\n" + 
					"AND             pd1.instrument_type = 'TEP'\r\n" + 
					"AND             pd1.status = 'CONFIMRED'\r\n" + 
					"LEFT OUTER JOIN sales.dbo.payment_details pd ON             st.id = pd.sales_txn_id\r\n" + 
					"AND             pd.payment_code = 'ENCIRCLE'\r\n" + 
					"AND             pd.status = 'COMPLETED'\r\n" + 
					"LEFT OUTER JOIN sales.dbo.discount_item_details did ON             cmd.id = did.item_id\r\n" + 
					"LEFT OUTER JOIN sales.dbo.discount_details_sales dd\r\n" + 
					"ON             did.discount_details_id = dd.id\r\n" + 
					"LEFT OUTER JOIN sales.dbo.discount_config_details dcd\r\n" + 
					"ON              dd.discount_config_id = dcd.id\r\n" + 
					"LEFT OUTER JOIN sales.dbo.discount_item_details did1\r\n" + 
					"ON              cmd.id = did1.item_id\r\n" + 
					"LEFT OUTER JOIN sales.dbo.discount_details_sales dd1\r\n" + 
					"ON              did1.discount_details_id = dd1.id\r\n" + 
					"AND             did1.item_id = cmd.id\r\n" + 
					"AND             dd1.discount_code = 'SYSTEM_DISCOUNT_DV' ,\r\n" + 
					"                sales.dbo.customer_transaction ct ,\r\n" + 
					"                products.dbo.item_master im ,\r\n"+ FileIntegrationConstants.BUSINESS_DAY_SQL +
					"WHERE          st.id = ct.id\r\n" + 
					"AND             cmd.item_code = im.item_code\r\n" + 
					"AND             st.location_code = z.location_code\r\n" + 
					"AND             st.txn_type ='CM'\r\n" + 
					"AND             st.doc_date = z.business_date\r\n" + 
					"AND             st.status = 'CONFIRMED')\r\n" + 
					"UNION\r\n" + 
					"SELECT \r\n" + 
					"  st.id AS txn_id, cmd.id AS cash_memo_details_id, \r\n" + 
					"  'Invoice' AS txn_type, st.location_code,  z.business_date, st.doc_date AS transac_doc_date, st.confirmed_time AS transaction_time, \r\n" + 
					"  ct.ulp_id, st.doc_no, cmd.row_id, fd.item_code, '73' as product_group_code  ,\r\n" + 
					"  fd.total_quantity, fd.total_value AS gross_amount, 0.0,pd.reference_1 AS rr_number, '' AS cm_date, '' AS cm_doc_no,\r\n" + 
					"  '' AS brand_name, '' AS cm_row_id, '' AS cm_location_code, im.is_foc_item,fsm.is_accrual_ulp, json_value(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') AS accural_encircle_points, COALESCE (pd1.amount / fd.total_value, 0) AS tep_line_amount_value,\r\n" + 
					"  COALESCE (did1.discount_value, 0) AS ghs_discount, COALESCE (pd2.amount, 0) AS encircle_points \r\n" + 
					"FROM \r\n" + 
					"  sales.dbo.sales_transaction st INNER JOIN sales.dbo.cash_memo cm ON st.id = cm.id AND cm.is_migrated = 'false' \r\n" + 
					"  INNER JOIN sales.dbo.cash_memo_details cmd ON st.id = cmd.cash_memo_id \r\n" + 
					"  FULL OUTER JOIN sales.dbo.foc_schemes fs ON fs.sales_txn_id = st.id \r\n" + 
					"  FULL OUTER JOIN configs.dbo.foc_scheme_master fsm ON fsm.id = json_value(fs.scheme_details, '$.data.schemeId') \r\n" + 
					"  full outer join sales.dbo.foc_details fd on fd.sales_txn_id = st.id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.payment_details pd2 ON pd2.sales_txn_id = cm.id AND pd2.sales_txn_id = st.id AND pd2.payment_code = 'ENCIRCLE' \r\n" + 
					"  AND pd2.status = 'CONFIMRED' \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.payment_item_mapping pim ON pd2.id = pim.payment_id AND pim.item_id = cmd.id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.payment_details pd1 ON pd1.sales_txn_id = cm.id \r\n" + 
					"  AND pd1.sales_txn_id = st.id  AND pd1.payment_code = 'CREDIT NOTE' AND pd1.instrument_type = 'TEP'  AND pd1.status = 'CONFIMRED' \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.payment_details pd ON st.id = pd.sales_txn_id AND pd.payment_code = 'ENCIRCLE' AND pd.status = 'COMPLETED' \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.discount_item_details did ON cmd.id = did.item_id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.discount_details_sales dd ON did.discount_details_id = dd.id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.discount_config_details dcd ON dd.discount_config_id = dcd.id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.discount_item_details did1 ON cmd.id = did1.item_id \r\n" + 
					"  LEFT OUTER JOIN sales.dbo.discount_details_sales dd1 ON did1.discount_details_id = dd1.id \r\n" + 
					"  AND did1.item_id = cmd.id AND dd1.discount_code = 'SYSTEM_DISCOUNT_DV', sales.dbo.customer_transaction ct, \r\n" + 
					"  products.dbo.item_master im, \r\n" + FileIntegrationConstants.BUSINESS_DAY_SQL +
					"WHERE \r\n" + 
					"  st.id = ct.id AND fd.item_code = im.item_code AND st.location_code = z.location_code AND st.txn_type = 'CM' \r\n" + 
					"  AND st.doc_date = z.business_date AND st.status = 'CONFIRMED';";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					preparedStatement.setString(3, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					preparedStatement.setString(4, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					
				}
			});
		}
		reader.setSql(sql);
		log.info("Inside customerTransactionCmStagingReader...........................................................{}",reader.getSql().toString());
		reader.setRowMapper(getNcCustomerTransactionRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcCustomerTransactionStageDto> customerTransactionBcStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<NcCustomerTransactionStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.id as txn_id, cmd.id as cash_memo_details_id, 'Cancelled' as txn_type,\r\n"
					+ "rt.location_code, 'Tanishq' as brand_name,st.doc_date as transac_doc_date,\r\n"
					+ " rt.cancelled_time as transaction_time, ct.ulp_id, rt.doc_no,\r\n"
					+ "cmd.row_id, cmd.item_code, cmd.product_group_code,\r\n"
					+ "cmd. total_quantity, cmd.total_value as gross_amount,\r\n"
					+ "cmd.total_discount, pd.reference_1 as rr_number, rt.txn_type,\r\n"
					+ " st.confirmed_time as cm_date, st.doc_no as cm_doc_no,\r\n"
					+ "st.location_code as cm_location_code, cmd.row_id as cm_row_id,\r\n" + "im.is_foc_item ,fsm.is_accrual_ulp,\r\n"
					+ "  JSON_VALUE(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') as accural_encircle_points,\r\n"
					+ "  COALESCE (pd1.amount / cm.final_value, 0) as tep_line_amount_value,\r\n"
					+ "  COALESCE (did1.discount_value, 0) as ghs_discount,\r\n"
					+ "  COALESCE (pd2.amount , 0) as encircle_points\r\n" + "from\r\n"
					+ "sales.dbo.refund_transaction rt, sales.dbo.sales_transaction st\r\n"
					+ "inner join sales.dbo.cash_memo cm on st.id = cm.id and cm.is_migrated = 'false'\r\n"
					+ " full outer join sales.dbo.foc_schemes fs on fs.sales_txn_id = st.id\r\n" 
					+ " full outer join configs.dbo.foc_scheme_master fsm on fsm.id= JSON_VALUE(fs.scheme_details, '$.data.schemeId')\r\n"
					+ "left outer join sales.dbo.payment_details pd on st.id = pd.sales_txn_id\r\n"
					+ "and pd.payment_code = 'ENCIRCLE' , sales.dbo.cash_memo_details cmd\r\n"
					+ "left outer join sales.dbo.payment_details pd2 on pd2.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd2.sales_txn_id = cmd.cash_memo_id and pd2.payment_code = 'ENCIRCLE'\r\n"
					+ "and pd2.status = 'CONFIMRED'\r\n" + "left outer join sales.dbo.payment_item_mapping pim on\r\n"
					+ "pd2.id = pim.payment_id and pim.item_id = cmd.id\r\n"
					+ "  left outer join sales.dbo.payment_details pd1 on\r\n"
					+ "pd1.sales_txn_id = cmd.cash_memo_id\r\n" + "and pd1.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd1.payment_code = 'CREDIT NOTE'\r\n"
					+ "  and pd1.instrument_type = 'TEP' and pd1.status = 'CONFIMRED'\r\n"
					+ "  left outer join sales.dbo.discount_item_details did on cmd.id = did.item_id\r\n"
					+ "  left outer join sales.dbo.discount_details_sales dd on did.discount_details_id = dd.id\r\n"
					+ "  left outer join sales.dbo.discount_config_details dcd on\r\n"
					+ "dd.discount_config_id = dcd.id\r\n"
					+ "  left outer join sales.dbo.discount_item_details did1 on cmd.id = did1.item_id\r\n"
					+ "  left outer join sales.dbo.discount_details_sales dd1 on did1.discount_details_id = dd1.id\r\n"
					+ "and did1.item_id = cmd.id and dd1.discount_code = 'SYSTEM_DISCOUNT_DV' ,\r\n"
					+ "sales.dbo.customer_transaction ct, products.dbo.item_master im " + "where\r\n"
					+ "st.id = cmd.cash_memo_id\r\n" + "and st.id = ct.id and ct.ulp_id is not null\r\n"
					+ "and rt.ref_sales_id = st.id\r\n" + "and rt.txn_type = 'CMCAN'\r\n"
					+ "and cmd.item_code = im.item_code and rt.doc_date = '" + transactionDate + "'";
			log.info(" BC query...........1........................................");
		} else {
			sql = "select st.id as txn_id, cmd.id as cash_memo_details_id, 'Cancelled' as txn_type,\r\n"
					+ "rt.location_code, 'Tanishq' as brand_name,st.doc_date as transac_doc_date,\r\n"
					+ "   rt.cancelled_time as transaction_time, ct.ulp_id, rt.doc_no,\r\n"
					+ "cmd.row_id, cmd.item_code, cmd.product_group_code,\r\n"
					+ "cmd. total_quantity, cmd.total_value as gross_amount,\r\n"
					+ "cmd.total_discount, pd.reference_1 as rr_number, rt.txn_type,\r\n"
					+ "  st.confirmed_time as cm_date, st.doc_no as cm_doc_no,\r\n"
					+ "st.location_code as cm_location_code, cmd.row_id as cm_row_id,\r\n" + "im.is_foc_item ,fsm.is_accrual_ulp,\r\n"
					+ "   JSON_VALUE(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') as accural_encircle_points,\r\n"
					+ "   COALESCE (pd1.amount / cm.final_value, 0) as tep_line_amount_value,\r\n"
					+ "   COALESCE (did1.discount_value, 0) as ghs_discount,\r\n"
					+ "   COALESCE (pd2.amount , 0) as encircle_points\r\n" + "from\r\n"
					+ "   sales.dbo.refund_transaction rt, sales.dbo.sales_transaction st\r\n"
					+ "inner join sales.dbo.cash_memo cm on st.id = cm.id and cm.is_migrated = 'false'\r\n"
					+ " full outer join sales.dbo.foc_schemes fs on fs.sales_txn_id = st.id\r\n" 
					+ " full outer join configs.dbo.foc_scheme_master fsm on fsm.id= JSON_VALUE(fs.scheme_details, '$.data.schemeId')\r\n"
					+ "left outer join sales.dbo.payment_details pd on st.id = pd.sales_txn_id\r\n"
					+ "and pd.payment_code = 'ENCIRCLE' , sales.dbo.cash_memo_details cmd\r\n"
					+ "left outer join sales.dbo.payment_details pd2 on pd2.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd2.sales_txn_id = cmd.cash_memo_id and pd2.payment_code = 'ENCIRCLE'\r\n"
					+ "and pd2.status = 'CONFIMRED'\r\n" + "left outer join sales.dbo.payment_item_mapping pim on\r\n"
					+ "pd2.id = pim.payment_id and pim.item_id = cmd.id\r\n"
					+ "   left outer join sales.dbo.payment_details pd1 on\r\n"
					+ "pd1.sales_txn_id = cmd.cash_memo_id\r\n" + "and pd1.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd1.payment_code = 'CREDIT NOTE'\r\n"
					+ "   and pd1.instrument_type = 'TEP' and pd1.status = 'CONFIMRED'\r\n"
					+ "   left outer join sales.dbo.discount_item_details did on cmd.id = did.item_id\r\n"
					+ "   left outer join sales.dbo.discount_details_sales dd on did.discount_details_id = dd.id\r\n"
					+ "   left outer join sales.dbo.discount_config_details dcd on\r\n"
					+ "dd.discount_config_id = dcd.id\r\n"
					+ "   left outer join sales.dbo.discount_item_details did1 on cmd.id = did1.item_id\r\n"
					+ "   left outer join sales.dbo.discount_details_sales dd1 on did1.discount_details_id = dd1.id\r\n"
					+ "and did1.item_id = cmd.id and dd1.discount_code = 'SYSTEM_DISCOUNT_DV' ,\r\n"
					+ "sales.dbo.customer_transaction ct, products.dbo.item_master im,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL + "where\r\n" + "st.id = cmd.cash_memo_id\r\n"
					+ "and st.id = ct.id and ct.ulp_id is not null\r\n"
					+ "and st.location_code = z.location_code and rt.ref_sales_id = st.id\r\n"
					+ "and rt.doc_date = z.business_date and rt.txn_type = 'CMCAN'\r\n"
					+ "and cmd.item_code = im.item_code;";
			log.info(" BC query...........2........................................");
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getNcCustomerTransactionRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcCustomerTransactionStageDto> customerTransactionGrnStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<NcCustomerTransactionStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select st.id as txn_id, cmd.id as cash_memo_details_id,\r\n"
					+ "'GRN' as txn_type, rt.location_code, 'Tanishq' as brand_name,st.doc_date as transac_doc_date,\r\n"
					+ "rt.cancelled_time as transaction_time, ct.ulp_id, rt.doc_no,\r\n"
					+ "'' as row_id, grd.item_code, cmd.product_group_code, grd.total_quantity,\r\n"
					+ "grd.final_value as gross_amount, 0 as total_discount, pd.reference_1 as rr_number,\r\n"
					+ "st.confirmed_time as cm_date, st.doc_no as cm_doc_no,\r\n"
					+ "st.location_code as cm_location_code, cmd.row_id as cm_row_id , im.is_foc_item ,fsm.is_accrual_ulp,\r\n"
					+ "JSON_VALUE(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') as accural_encircle_points,\r\n"
					+ "COALESCE (pd1.amount / cm.final_value, 0) as tep_line_amount_value,\r\n"
					+ "COALESCE (did1.discount_value, 0) as ghs_discount,\r\n"
					+ "COALESCE (pd2.amount ,0) as encircle_points from\r\n"
					+ "sales.dbo.refund_transaction rt , sales.dbo.sales_transaction st \r\n"
					+ " full outer join sales.dbo.foc_schemes fs on st.id = fs.sales_txn_id \r\n" 
					+ " full outer join configs.dbo.foc_scheme_master fsm on fsm.id = JSON_VALUE( fs.scheme_details, '$.data.schemeId'),\r\n"
					+ "sales.dbo.customer_transaction ct, sales.dbo.goods_return_details grd,\r\n"
					+ "sales.dbo.cash_memo cm, sales.dbo.cash_memo_details cmd\r\n"
					+ "left outer join sales.dbo.payment_details pd2 on  pd2.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd2.payment_code = 'ENCIRCLE'  and pd2.status = 'CONFIMRED'\r\n"
					+ "left outer join sales.dbo.payment_item_mapping pim on  pd2.id = pim.payment_id\r\n"
					+ "and pim.item_id = cmd.id\r\n" + "left outer join sales.dbo.payment_details pd1 on\r\n"
					+ "pd1.sales_txn_id = cmd.cash_memo_id and pd1.payment_code = 'CREDIT NOTE'\r\n"
					+ "and pd1.instrument_type = 'TEP' and pd1.status = 'CONFIMRED'\r\n"
					+ "left outer join sales.dbo.payment_details pd on cmd.cash_memo_id = pd.sales_txn_id\r\n"
					+ "and pd.payment_code = 'ENCIRCLE' and pd.status = 'COMPLETED'\r\n"
					+ "left outer join sales.dbo.discount_item_details did1 on cmd.id = did1.item_id\r\n"
					+ "left outer join sales.dbo.discount_details_sales dd1 on did1.discount_details_id = dd1.id\r\n"
					+ "and did1.item_id = cmd.id and dd1.discount_code = 'SYSTEM_DISCOUNT_DV'\r\n"
					+ "left outer join sales.dbo.discount_item_details did on cmd.id = did.item_id\r\n"
					+ "left outer join sales.dbo.discount_details_sales dd on did.discount_details_id = dd.id\r\n"
					+ "left outer join sales.dbo.discount_config_details dcd on\r\n"
					+ "dd.discount_config_id = dcd.id , products.dbo.item_master im where st.id = cm.id and cm.is_migrated = 'false'\r\n"
					+ "and rt.ref_sales_id = st.id and ct.ulp_id is not null and st.id = ct.id\r\n"
					+ "and st.id = cmd.cash_memo_id  and rt.txn_type = 'GRN'\r\n"
					+ "and cmd.item_code = im.item_code and grd.cash_memo_details_id = cmd.id\r\n"
					+ "and grd.cash_memo_details_id is not null and rt.doc_date = '" + transactionDate + "'";
			log.info(" GRN query...........1........................................");
			
		} else {
			sql = "select st.id as txn_id, cmd.id as cash_memo_details_id,\r\n"
					+ "'GRN' as txn_type, rt.location_code, 'Tanishq' as brand_name,st.doc_date as transac_doc_date,\r\n"
					+ "rt.cancelled_time as transaction_time, ct.ulp_id, rt.doc_no,\r\n"
					+ "'' as row_id, grd.item_code, cmd.product_group_code, grd.total_quantity,\r\n"
					+ "grd.final_value as gross_amount, 0 as total_discount, pd.reference_1 as rr_number,\r\n"
					+ "st.confirmed_time as cm_date, st.doc_no as cm_doc_no,\r\n"
					+ "st.location_code as cm_location_code, cmd.row_id as cm_row_id , im.is_foc_item ,fsm.is_accrual_ulp,\r\n"
					+ "JSON_VALUE(dcd.discount_atttributes, '$.data.isAccrualUlpPoints') as accural_encircle_points,\r\n"
					+ "COALESCE (pd1.amount / cm.final_value, 0) as tep_line_amount_value,\r\n"
					+ "COALESCE (did1.discount_value, 0) as ghs_discount,\r\n"
					+ "COALESCE (pd2.amount ,0) as encircle_points from\r\n"
					+ "sales.dbo.refund_transaction rt , sales.dbo.sales_transaction st \r\n"
					+ " full outer join sales.dbo.foc_schemes fs on st.id = fs.sales_txn_id \r\n" 
					+ " full outer join configs.dbo.foc_scheme_master fsm on fsm.id = JSON_VALUE( fs.scheme_details, '$.data.schemeId'),\r\n"
					+ "sales.dbo.customer_transaction ct, sales.dbo.goods_return_details grd,\r\n"
					+ "sales.dbo.cash_memo cm, sales.dbo.cash_memo_details cmd\r\n"
					+ "left outer join sales.dbo.payment_details pd2 on  pd2.sales_txn_id = cmd.cash_memo_id\r\n"
					+ "and pd2.payment_code = 'ENCIRCLE'  and pd2.status = 'CONFIMRED'\r\n"
					+ "left outer join sales.dbo.payment_item_mapping pim on  pd2.id = pim.payment_id\r\n"
					+ "and pim.item_id = cmd.id\r\n" + "left outer join sales.dbo.payment_details pd1 on\r\n"
					+ "pd1.sales_txn_id = cmd.cash_memo_id and pd1.payment_code = 'CREDIT NOTE'\r\n"
					+ "and pd1.instrument_type = 'TEP' and pd1.status = 'CONFIMRED'\r\n"
					+ "left outer join sales.dbo.payment_details pd on cmd.cash_memo_id = pd.sales_txn_id\r\n"
					+ "and pd.payment_code = 'ENCIRCLE' and pd.status = 'COMPLETED'\r\n"
					+ "left outer join sales.dbo.discount_item_details did1 on cmd.id = did1.item_id\r\n"
					+ "left outer join sales.dbo.discount_details_sales dd1 on did1.discount_details_id = dd1.id\r\n"
					+ "and did1.item_id = cmd.id and dd1.discount_code = 'SYSTEM_DISCOUNT_DV'\r\n"
					+ "left outer join sales.dbo.discount_item_details did on cmd.id = did.item_id\r\n"
					+ "left outer join sales.dbo.discount_details_sales dd on did.discount_details_id = dd.id\r\n"
					+ "left outer join sales.dbo.discount_config_details dcd on\r\n"
					+ "dd.discount_config_id = dcd.id , products.dbo.item_master im ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL + "where st.id = cm.id\r\n"
					+ "and rt.ref_sales_id = st.id and ct.ulp_id is not null and st.id = ct.id and cm.is_migrated = 'false'\r\n"
					+ "and st.id = cmd.cash_memo_id and st.location_code = z.location_code\r\n"
					+ "and rt.doc_date = z.business_date and rt.txn_type = 'GRN'\r\n"
					+ "and cmd.item_code = im.item_code and grd.cash_memo_details_id = cmd.id\r\n"
					+ "and grd.cash_memo_details_id is not null;";
			log.info(" GRN query...........2........................................");
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.NC_TRANSACTION_DATA_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getNcCustomerTransactionRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcCustomerTransactionStageDto> customerTransactionfileReader(
			@Value("#{jobExecutionContext['NcCustomerTransactionSavedId']}") String fileAuditId) {
		JdbcCursorItemReader<NcCustomerTransactionStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from ulp_customer_transaction_data_stage where file_audit_id ='" + fileAuditId
				+ "' and unified_loyalty_no is not null");
		reader.setRowMapper(getNcCustomerTransactionFileRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcMemberDataStageDto> memberDataStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<NcMemberDataStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select ct.location_code, ct.ulp_id, max(st.doc_date) as doc_date, max(ct.customer_name) as customer_name,max(ct.mobile_number) as mobile_number,\r\n"
					+ "max(ct.email_id) as email_id from sales.dbo.sales_transaction st, sales.dbo.customer_transaction ct\r\n"
					+ "where st.id = ct.id and st.txn_type ='CM' and \r\n"
					+ " len(ct.ulp_id) = 12 and (ct.ulp_id like '3%' or ct.ulp_id like '7%') and st.doc_date='"
					+ transactionDate + "'\r\n" + "group by ct.location_code , ct.ulp_id ;";
		} else {
			sql = "select ct.location_code, ct.ulp_id, max(st.doc_date) as doc_date, max(ct.customer_name) as customer_name,max(ct.mobile_number) as mobile_number,\r\n"
					+ "max(ct.email_id) as email_id from sales.dbo.sales_transaction st, sales.dbo.customer_transaction ct,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL + "where \r\n"
					+ "st.id = ct.id and st.location_code =z.location_code  and st.txn_type ='CM' and \r\n"
					+ "st.doc_date = z.business_date and len(ct.ulp_id) = 12 and (ct.ulp_id like '3%' or ct.ulp_id like '7%')\r\n"
					+ "group by ct.location_code , ct.ulp_id ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.NC_MEMBER_DATA_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getNcMemberDataRowMapper());
		log.info("memberDataStagingReader..............................................................................{}",reader.toString());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcMemberDataStageDto> memberDatafileReader(
			@Value("#{jobExecutionContext['NcMemberDataSavedId']}") String fileAuditId) {
		JdbcCursorItemReader<NcMemberDataStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from ulp_member_data_stage where file_audit_id ='" + fileAuditId
				+ "' and unified_loyalty_no is not null");
		reader.setRowMapper(new BeanPropertyRowMapper<>(NcMemberDataStageDto.class));
		log.info("memberDatafileReader......................................................................................{}",reader.toString());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcStoreMasterStageDto> storeMasterStagingReader() {
		JdbcCursorItemReader<NcStoreMasterStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql(
				"select lm.location_code, JSON_VALUE(lm.store_details , '$.data.companyName') as store_name, lm.owner_type ,tm.description as city, sm.description as state, lm.region_code, JSON_VALUE(store_details ,'$.data.pincode') as pin_code, lm.is_active from locations.dbo.location_master lm left join locations.dbo.town_master tm on lm.town_id = tm.town_id\r\n"
						+ "left join locations.dbo.state_master sm on lm.state_id = sm.state_id \r\n"
						+ "where location_type ='BTQ' and lm.is_active =1");
		reader.setRowMapper(getNcStoreMasterRowMapper());
		log.info("storeMasterStagingReader.................................................................................{}",reader.toString());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcStoreMasterStageDto> storeMasterfileReader(
			@Value("#{jobExecutionContext['NcStoreMasterSavedId']}") String fileAuditId) {
		log.info("Inside JdbcCursorItemReader for table ulp_store_master_stage....................................with audit id...{}",fileAuditId);
		JdbcCursorItemReader<NcStoreMasterStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from ulp_store_master_stage where file_audit_id = '" + fileAuditId + "'");
		log.info("Store master file read................");
		reader.setRowMapper(new BeanPropertyRowMapper<>(NcStoreMasterStageDto.class));
		log.info("storeMasterfileReader.....................................................................................{}",reader.toString());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<NcTransactionDataStageDto> transactionDatafileReader(
			@Value("#{jobExecutionContext['NcTransactionDataSavedId']}") String fileAuditId) {
		log.info("File audit id while trying to write into file..........from ulp_transaction_data_stage..............................{}",fileAuditId);
		JdbcCursorItemReader<NcTransactionDataStageDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from ulp_transaction_data_stage where file_audit_id = '" + fileAuditId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(NcTransactionDataStageDto.class));
		log.info("transactionDatafileReader......................................................................................{}",reader.toString());
		return reader;
	}

	@Bean
	public NcMemberDataRowMapper getNcMemberDataRowMapper() {
		return new NcMemberDataRowMapper();
	}

	@Bean
	public NcStoreMasterRowMapper getNcStoreMasterRowMapper() {
		return new NcStoreMasterRowMapper();
	}

	@Bean
	public NcCustomerTransactionRowMapper getNcCustomerTransactionRowMapper() {
		log.info("Customer transaction  row Mapper called.......................................................................");
		return new NcCustomerTransactionRowMapper();
	}
	
	@Bean
	public NcCustomerTransactionFileRowMapper getNcCustomerTransactionFileRowMapper() {
		log.info("Customer transaction  file row Mapper called...................................................................");
		return new NcCustomerTransactionFileRowMapper();
	}
}
