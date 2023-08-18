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
import com.titan.poss.file.dto.BoutiqueSalesDto;
import com.titan.poss.file.jobs.mapper.BoutiqueSalesFileDetMapper;
import com.titan.poss.file.jobs.mapper.BoutiqueSalesFileHdrMapper;
import com.titan.poss.file.jobs.mapper.BoutiqueSalesFileTaxMapper;
import com.titan.poss.file.jobs.mapper.BoutiqueSalesRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class BoutiqueSalesJobReader {

	@Autowired
	private DataSource dataSource;

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesCmStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cm.is_migrated,cmd.item_details,xyz.[value] as lotNumber,cmd.lot_number,\r\n"
					+ "case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, st.id,st.doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,st.location_code,st.txn_type, cmd.row_id, st.doc_date ,cmd.item_code ,(CASE WHEN cmd.lot_number is null then abc.[value] else cmd.total_quantity \r\n" + 
					"END ) AS total_quantity, cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 as making_charge,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0') as stone_value, cmd.price_details  \r\n"
					+ "					 ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY st.location_code, st.doc_date ORDER BY  cmd.id,st.doc_date,st.txn_type,cmd.item_code, xyz.[value] , NewID() ) AS ref_line_no, \r\n"
					+ "					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))   \r\n"
					+ "					 		else 0 end as other_charges, \r\n"
					+ "					\r\n"
					+ "					(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS ghs_discount, \r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)\r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS encircle_discount, \r\n"
					+ "						\r\n"
					+ "						(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "								END) AS encircle_discount2, \r\n"
					+ "\r\n"
					+ "								(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "								END) AS encircle_discount3,\r\n"
					+ "						\r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS digi_gold_discount		\r\n"
					+ "from sales.dbo.sales_transaction st, sales.dbo.cash_memo cm,locations.dbo.location_master lm, sales.dbo.cash_memo_details cmd \r\n"
					+ "  CROSS APPLY OPENJSON(JSON_QUERY(item_details,'$.data')) AS x   CROSS APPLY OPENJSON(x.[value], '$') AS xyz "
					+ "  CROSS APPLY OPENJSON(x.[value], '$') AS abc \r\n"
					+ "where st.id = cm.id and cm.is_migrated = 'false' and cm.id = cmd.cash_memo_id and st.location_code = lm.location_code and st.txn_type = 'CM' \r\n"
					+ "					 and st.status in ('CONFIRMED','CANCELLED') and lm.owner_type in ('L1', 'L2') \r\n"
					+ "					 and xyz.[key] in ('lotNumber') and  abc.[key] in ('quantity') order by st.location_code, st.doc_date, cmd.id  \r\n"
					+ " and st.doc_date = '" + transactionDate + "'   order by st.location_code, st.doc_date, cmd.id ";
		} else {
			sql = "select cm.is_migrated, cmd.item_details,xyz.[value] as lotNumber,cmd.lot_number,\r\n"
					+ "case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, st.id,st.doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,st.location_code,st.txn_type, cmd.row_id, st.doc_date ,cmd.item_code ,(CASE WHEN cmd.lot_number is null then abc.[value] else cmd.total_quantity \r\n" + 
					"END ) AS total_quantity, cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 as making_charge,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0') as stone_value, cmd.price_details  \r\n"
					+ "					 ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY st.location_code, st.doc_date ORDER BY  cmd.id,st.doc_date,st.txn_type,cmd.item_code, xyz.[value] , NewID() ) AS ref_line_no, \r\n"
					+ "					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))   \r\n"
					+ "					 		else 0 end as other_charges, \r\n"
					+ "					\r\n"
					+ "					(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS ghs_discount, \r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)\r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS encircle_discount, \r\n"
					+ "						\r\n"
					+ "						(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "								END) AS encircle_discount2, \r\n"
					+ "\r\n"
					+ "								(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "								END) AS encircle_discount3,\r\n"
					+ "						\r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS digi_gold_discount		\r\n"
					+ "from sales.dbo.sales_transaction st, sales.dbo.cash_memo cm,locations.dbo.location_master lm, sales.dbo.cash_memo_details cmd \r\n"
					+ "  CROSS APPLY OPENJSON(JSON_QUERY(item_details,'$.data')) AS x   CROSS APPLY OPENJSON(x.[value], '$') AS xyz "
					+ "  CROSS APPLY OPENJSON(x.[value], '$') AS abc , \r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.id = cm.id and cm.is_migrated = 'false' and cm.id = cmd.cash_memo_id and st.location_code = lm.location_code and st.txn_type = 'CM' \r\n"
					+ "					 and st.status in ('CONFIRMED','CANCELLED') and lm.owner_type in ('L1', 'L2') \r\n"
					+ "					 and xyz.[key] in ('lotNumber') and  abc.[key] in ('quantity') and st.location_code =z.location_code \r\n"
					+ " and  st.doc_date = z.business_date order by st.location_code, st.doc_date, cmd.id ;";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getBoutiqueSalesRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesBcStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cm.is_migrated, cmd.item_details,xyz.[value] as lotNumber,cmd.lot_number,\r\n"
					+ "case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, st.doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,rt.location_code,rt.txn_type, rt.doc_date ,cmd.row_id, cmd.item_code ,cmd.lot_number ,\r\n"
					+ "					 (CASE WHEN cmd.lot_number is null then abc.[value] else cmd.total_quantity \r\n" + 
					"END ) AS total_quantity, cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 as making_charge ,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0')\r\n"
					+ "					 as stone_value, cmd.price_details  ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY rt.location_code ORDER BY cmd.id,rt.doc_date,rt.txn_type,cmd.item_code, xyz.[value] , NewID()  ) AS ref_line_no, \r\n"
					+ "					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))     \r\n"
					+ "					 		else 0 end as other_charges, \r\n"
					+ "					\r\n"
					+ "					(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS ghs_discount, \r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)\r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS encircle_discount, \r\n"
					+ "						\r\n"
					+ "						(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								END) AS encircle_discount2, \r\n"
					+ "\r\n"
					+ "								(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "								END) AS encircle_discount3,\r\n"
					+ "						\r\n"
					+ "						\r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS digi_gold_discount\r\n"
					+ "					\r\n"
					+ "					\r\n"
					+ "			\r\n"
					+ "					from sales.dbo.sales_transaction st, \r\n"
					+ "					 locations.dbo.location_master lm, sales.dbo.refund_transaction rt,  sales.dbo.cash_memo cm,\r\n"
					+ "					 sales.dbo.cash_memo_details cmd \r\n"
					+ "  CROSS APPLY OPENJSON(JSON_QUERY(item_details,'$.data')) AS x   CROSS APPLY OPENJSON(x.[value], '$') AS xyz"
					+ "  CROSS APPLY OPENJSON(x.[value], '$') AS abc \r\n"
					+ "where rt.ref_sales_id = cm.id and cm.is_migrated = 'false' and cm.id = cmd.cash_memo_id and rt.ref_sales_id = st.id\r\n"
					+ "					 and st.location_code = lm.location_code and rt.txn_type = 'CMCAN' and rt.status='CONFIRMED'\r\n"
					+ "					  and lm.owner_type in ('L1', 'L2')  \r\n"
					+ "					   and xyz.[key] in ('lotNumber') and  abc.[key] in ('quantity') order by st.location_code, st.doc_date, cmd.id "
					+ " and rt.doc_date = '" + transactionDate + "'";
		} else {
			sql = "select cm.is_migrated,cmd.item_details,xyz.[value] as lotNumber,cmd.lot_number,\r\n"
					+ "case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, st.doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,rt.location_code,rt.txn_type, rt.doc_date ,cmd.row_id, cmd.item_code ,cmd.lot_number ,\r\n"
					+ "					 (CASE WHEN cmd.lot_number is null then abc.[value] else cmd.total_quantity \r\n" + 
					"END ) AS total_quantity, cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 as making_charge ,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0')\r\n"
					+ "					 as stone_value, cmd.price_details  ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY rt.location_code ORDER BY cmd.id,rt.doc_date,rt.txn_type,cmd.item_code, xyz.[value] , NewID()  ) AS ref_line_no, \r\n"
					+ "					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))     \r\n"
					+ "					 		else 0 end as other_charges, \r\n"
					+ "					\r\n"
					+ "					(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS ghs_discount, \r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)\r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS encircle_discount, \r\n"
					+ "						\r\n"
					+ "						(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								END) AS encircle_discount2, \r\n"
					+ "\r\n"
					+ "								(CASE \r\n"
					+ "								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)\r\n"
					+ "								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "								END) AS encircle_discount3,\r\n"
					+ "						\r\n"
					+ "						\r\n"
					+ "							(CASE \r\n"
					+ "							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "							END) AS digi_gold_discount\r\n"
					+ "					\r\n"
					+ "					\r\n"
					+ "			\r\n"
					+ "					from sales.dbo.sales_transaction st, \r\n"
					+ "					 locations.dbo.location_master lm, sales.dbo.refund_transaction rt,  sales.dbo.cash_memo cm,\r\n"
					+ "					 sales.dbo.cash_memo_details cmd \r\n"
					+ "  CROSS APPLY OPENJSON(JSON_QUERY(item_details,'$.data')) AS x   CROSS APPLY OPENJSON(x.[value], '$') AS xyz"
					+ "  CROSS APPLY OPENJSON(x.[value], '$') AS abc ,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where rt.ref_sales_id = cm.id and cm.is_migrated = 'false' and cm.id = cmd.cash_memo_id and rt.ref_sales_id = st.id\r\n"
					+ "					 and st.location_code = lm.location_code and rt.txn_type = 'CMCAN' and rt.status='CONFIRMED'\r\n"
					+ "					  and lm.owner_type in ('L1', 'L2') and rt.location_code =z.location_code  and  rt.doc_date = z.business_date\r\n"
					+ "					   and xyz.[key] in ('lotNumber') and  abc.[key] in ('quantity') order by st.location_code, st.doc_date, cmd.id";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getBoutiqueSalesRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesGrnStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		String sql = null;
		if (!StringUtils.isEmpty(transactionDate)) {
			sql = "select cm.is_migrated,cmd.item_details, grd.lot_number as lotNumber,grd.lot_number,\r\n"
					+ "					 case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, replace('00001',right('00001',Len(Convert(Varchar(20),rt.doc_no))),Convert(Varchar(20),rt.doc_no)) as doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,rt.location_code,rt.txn_type, rt.doc_date ,grd.item_code ,grd.lot_number ,\r\n"
					+ "					 					grd.total_quantity , cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 					as making_charge,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0')\r\n"
					+ "					 					as stone_value, cmd.row_id, cmd.price_details  ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY rt.location_code,rt.doc_date ORDER BY cmd.id,rt.doc_date,rt.txn_type,grd.item_code, grd.lot_number) AS ref_line_no,\r\n"
					+ "					 					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))  \r\n"
					+ "					 									else 0 end as other_charges, \r\n"
					+ "					 				\r\n"
					+ "					 					(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS ghs_discount, \r\n"
					+ "					 							(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY') \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS encircle_discount, \r\n"
					+ "					 						\r\n"
					+ "					 						(CASE \r\n"
					+ "					 								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY') \r\n"
					+ "					 								WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 								END) AS encircle_discount2, \r\n"
					+ "					 \r\n"
					+ "					 								(CASE \r\n"
					+ "					 								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY')\r\n"
					+ "					 								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "					 								END) AS encircle_discount3,\r\n"
					+ "					 						\r\n"
					+ "					 						\r\n"
					+ "					 							(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS digi_gold_discount\r\n"
					+ "					 					\r\n"
					+ "					 					\r\n"
					+ "					 				\r\n"
					+ "				from sales.dbo.cash_memo cm inner join sales.dbo.refund_transaction rt on rt.ref_sales_id = cm.id \r\n"
					+ "				inner join sales.dbo.goods_return_details grd on grd.goods_return_id = rt.id\r\n"
					+ "				inner join locations.dbo.location_master lm on lm.location_code = rt.location_code \r\n"
					+ "				inner join sales.dbo.cash_memo_details cmd on cmd.cash_memo_id = cm.id \r\n"
					+ "				inner join sales.dbo.sales_transaction st on cm.id = st.id\r\n"
					+ "where rt.ref_sales_id= cm.id  and cm.id = cmd.cash_memo_id \r\n"
					+ "					 					and grd.cash_memo_details_id is not null and grd.cash_memo_details_id = cmd.id\r\n"
					+ "					 					and rt.location_code = lm.location_code and rt.txn_type = 'GRN' and rt.status='CONFIRMED'\r\n"
					+ "										and grd.item_code = cmd.item_code and grd.lot_number = cmd.lot_number\r\n"
					+ "					 					and lm.owner_type in ('L1', 'L2') and rt.location_code =z.location_code  and  rt.doc_date = z.business_date\r\n"
					+ "										order by st.location_code, st.doc_date, cmd.id \r\n"
					+ "and lm.owner_type in ('L1', 'L2') " + " and rt.doc_date = '" + transactionDate + "'";
		} else {
			sql = "\r\n"
					+ "select cm.is_migrated, cmd.item_details, grd.lot_number as lotNumber,grd.lot_number,\r\n"
					+ "					 case when cmd.lot_number is null then 'YES' else 'NO' end as is_coin, replace('00001',right('00001',Len(Convert(Varchar(20),rt.doc_no))),Convert(Varchar(20),rt.doc_no)) as doc_no, JSON_VALUE(banking_details ,'$.data.sapCode') as sap_code ,rt.location_code,rt.txn_type, rt.doc_date ,grd.item_code ,grd.lot_number ,\r\n"
					+ "					 					grd.total_quantity , cmd.total_quantity as original_qty, cmd.total_weight ,cmd.unit_value ,st.metal_rate_details ,COALESCE (JSON_VALUE(cmd.price_details ,'$.makingChargeDetails.preDiscountValue'),'0')\r\n"
					+ "					 					as making_charge,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0')\r\n"
					+ "					 					as stone_value, cmd.row_id, cmd.price_details  ,st.doc_no, cmd.tax_details, cmd.total_discount, DENSE_RANK() OVER (PARTITION BY rt.location_code,rt.doc_date ORDER BY cmd.id,rt.doc_date,rt.txn_type,grd.item_code, grd.lot_number) AS ref_line_no,\r\n"
					+ "					 					 case when JSON_VALUE(cm.[other_charges],'$.type') ='OTHERCHARGES' and JSON_VALUE(cm.[other_charges],'$.data.value') >0 then ( convert (float ,JSON_VALUE(cm.[other_charges],'$.data.value')) +  convert (float, JSON_VALUE(cm.[other_charges],'$.data.taxValue')))  \r\n"
					+ "					 									else 0 end as other_charges, \r\n"
					+ "					 				\r\n"
					+ "					 					(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 						    (select  COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='SYSTEM_DISCOUNT_GHS_BONUS' and did.item_id=cmd.id) \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS ghs_discount, \r\n"
					+ "					 							(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_ANNIVERSARY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY') \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS encircle_discount, \r\n"
					+ "					 						\r\n"
					+ "					 						(CASE \r\n"
					+ "					 								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_BIRTHDAY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY') \r\n"
					+ "					 								WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 								END) AS encircle_discount2, \r\n"
					+ "					 \r\n"
					+ "					 								(CASE \r\n"
					+ "					 								WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 								    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='ULP_DISCOUNT_SPOUSE_BIRTHDAY' and did.item_id=cmd.id)-- or dd.discount_type='ULP_DISCOUNT_SPOUSE_BIRTHDAY' or dd.discount_type='ULP_DISCOUNT_BIRTHDAY')\r\n"
					+ "					 								WHEN cmd.total_discount < 0 THEN 0\r\n"
					+ "					 								END) AS encircle_discount3,\r\n"
					+ "					 						\r\n"
					+ "					 						\r\n"
					+ "					 							(CASE \r\n"
					+ "					 							WHEN cmd.total_discount > 0 THEN \r\n"
					+ "					 							    (select COALESCE(sum(did.discount_value),0) from sales.dbo.discount_details_sales dd inner join sales.dbo.discount_item_details did on dd.id = did.discount_details_id where dd.sales_txn_id = st.id and dd.discount_type ='DIGI_GOLD_DISCOUNT' and did.item_id=cmd.id) \r\n"
					+ "					 							WHEN cmd.total_discount < 0 THEN 0 \r\n"
					+ "					 							END) AS digi_gold_discount\r\n"
					+ "					 					\r\n"
					+ "					 					\r\n"
					+ "					 				\r\n"
					+ "				from sales.dbo.cash_memo cm inner join sales.dbo.refund_transaction rt on rt.ref_sales_id = cm.id \r\n"
					+ "				inner join sales.dbo.goods_return_details grd on grd.goods_return_id = rt.id\r\n"
					+ "				inner join locations.dbo.location_master lm on lm.location_code = rt.location_code \r\n"
					+ "				inner join sales.dbo.cash_memo_details cmd on cmd.cash_memo_id = cm.id \r\n"
					+ "				inner join sales.dbo.sales_transaction st on cm.id = st.id,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where rt.ref_sales_id= cm.id and cm.id = cmd.cash_memo_id \r\n"
					+ "					 					and grd.cash_memo_details_id is not null and grd.cash_memo_details_id = cmd.id\r\n"
					+ "					 					and rt.location_code = lm.location_code and rt.txn_type = 'GRN' and rt.status='CONFIRMED'\r\n"
					+ "										and grd.item_code = cmd.item_code and grd.lot_number = cmd.lot_number\r\n"
					+ "					 					and lm.owner_type in ('L1', 'L2') and rt.location_code =z.location_code  and  rt.doc_date = z.business_date\r\n"
					+ "										order by st.location_code, st.doc_date, cmd.id";
			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue());
				}
			});
		}
		reader.setSql(sql);
		reader.setRowMapper(getBoutiqueSalesRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesFileHdrReader(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql(
				"select * from boutique_sales_hdr_stage where file_id ='" + fileId + "' order by item_attribute4");
		reader.setRowMapper(getBoutiqueSalesFileHdrMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesFileDetReader(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from boutique_sales_det_stage where file_id ='" + fileId + "'");
		reader.setRowMapper(getBoutiqueSalesFileDetMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<BoutiqueSalesDto> boutiqueSalesFileTaxReader(
			@Value("#{jobExecutionContext['boutiqueSalesTransactionId']}") String fileId) {
		JdbcCursorItemReader<BoutiqueSalesDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("select * from boutique_sales_tax_stage where file_id ='" + fileId + "' order by record_id");
		reader.setRowMapper(getBoutiqueSalesFileTaxMapper());
		return reader;
	}

	@Bean
	public BoutiqueSalesRowMapper getBoutiqueSalesRowMapper() {
		return new BoutiqueSalesRowMapper();
	}

	@Bean
	public BoutiqueSalesFileHdrMapper getBoutiqueSalesFileHdrMapper() {
		return new BoutiqueSalesFileHdrMapper();
	}

	@Bean
	public BoutiqueSalesFileDetMapper getBoutiqueSalesFileDetMapper() {
		return new BoutiqueSalesFileDetMapper();
	}

	@Bean
	public BoutiqueSalesFileTaxMapper getBoutiqueSalesFileTaxMapper() {
		return new BoutiqueSalesFileTaxMapper();
	}
}
