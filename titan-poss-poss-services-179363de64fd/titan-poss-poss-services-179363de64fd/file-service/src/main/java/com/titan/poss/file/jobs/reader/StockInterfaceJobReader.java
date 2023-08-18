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
import com.titan.poss.file.dto.StockInterfaceDto;
import com.titan.poss.file.jobs.mapper.StnStockInterfaceRowMapper;
import com.titan.poss.file.jobs.mapper.StockInterfaceRowMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class StockInterfaceJobReader {

	@Autowired
	private DataSource dataSource;

	
	@Bean(destroyMethod = "")
	@StepScope 
	public JdbcCursorItemReader<StockInterfaceDto> stnStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT '3' as transaction_type,\r\n"
				+ "				 st.transfer_type , st.status, \r\n"
				+ "				 case \r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='MER_BTQ' THEN  'B' + st.src_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_CFA' THEN 'B' + st.src_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_FAC' THEN 'B' + st.src_location_code\r\n"
				+ "				 END as from_where,\r\n"
				+ "\r\n"
				+ "				 case\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='MER_BTQ' THEN  'B' + st.src_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_CFA' THEN 'B' + st.src_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_FAC' THEN 'B' + st.src_location_code\r\n"
				+ "				 END as from_location,\r\n"
				+ "				 \r\n"
				+ "				 std.lot_number , \r\n"
				+ "				 \r\n"
				+ "				 std.issued_value as stm_value,\r\n"
				+ "\r\n"
				+ "				 case \r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='MER_BTQ' THEN  'HGIT'\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_CFA' THEN 'HGIT'\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_FAC' THEN 'HGIT'\r\n"
				+ "				 END as to_where,\r\n"
				+ "\r\n"
				+ "				 case \r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='MER_BTQ' THEN  'B' + st.dest_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_CFA' THEN 'B' + st.dest_location_code\r\n"
				+ "				 WHEN st.transfer_type = 'BTQ_FAC' THEN st.dest_location_code \r\n"
				+ "				 END as to_location,  \r\n"
				+ "				 \r\n"
				+ "				 std.issued_quantity as primary_quantity,\r\n"
				+ "\r\n"
				+ "				  std.issued_weight as secondary_quantity, \r\n"
				+ "				\r\n"
				+ "				 st.src_doc_date as business_date, \r\n"
				+ "				  \r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'  ELSE 'STRF' END as reason_code,\r\n"
				+ "				\r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN st.dest_location_code \r\n"
				+ "				 ELSE st.src_location_code END  as stm_number_1, \r\n"
				+ "\r\n"
				+ "				st.src_doc_no  as stm_number_2,\r\n"
				+ "\r\n"
				+ "				 std.item_code ,'Interface' as attribute,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'  ELSE 'STRF' END as attribute_2,\r\n"
				+ "\r\n"
				+ "				 'ISSUE' as attribute_3,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.order_type is null THEN JSON_VALUE(st.carrier_details,  '$.data.companyName')\r\n"
				+ "				 				ELSE JSON_VALUE(st.carrier_details,  '$.data.courierCompany') END as logistic_partner_name,\r\n"
				+ "\r\n"
				+ "				 JSON_VALUE(st.carrier_details,  '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.IGSTPct') as igst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.IGSTVal') as igst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.SGSTPct') as sgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.SGSTVal') as sgst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.CGSTPct') as cgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.CGSTVal') as cgst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.UTSTPct') as utgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.UTGSTVal') as utgst_amount,\r\n"
				+ "				  \r\n"
				+ "				  st.src_location_code as btq_code\r\n"
				+ "\r\n"
				+ "				 From inventory.dbo.stock_transfer st\r\n"
				+ "				 inner join  inventory.dbo.stock_transfer_details std on st.id = std.stock_transfer_id \r\n"
				+ "				 inner join  locations.dbo.location_master lm1 on st.src_location_code = lm1.location_code \r\n"
				+ "				 inner join  locations.dbo.location_master lm2 on st.dest_location_code = lm2.location_code \r\n");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append(
					"where st.transfer_type in ('MER_BTQ' ,'BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')\r\n"
							+ "and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
							+ "and ((st.transfer_type ='FAC_BTQ' and st.status ='RECEIVED' and st.dest_doc_date = '"
							+ transactionDate + "') or"
							+ " ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='MER_BTQ') and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "') \r\n"
							+ "or (st.transfer_type ='BTQ_CFA' and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "') or "
							+ "(st.transfer_type ='BTQ_FAC' and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "')\r\n"
							+ "or ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='MER_BTQ' or st.transfer_type ='BTQ_CFA') and st.status ='RECEIVED' and st.dest_doc_date = '"
							+ transactionDate + "'))");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.transfer_type in ( 'MER_BTQ' , 'BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')\r\n"
					+ "				and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
					+ "				and ((st.status = 'ISSUED' and st.src_location_code = z.location_code and st.src_doc_date = z.business_date) OR \r\n"
					+ "				(st.status = 'RECEIVED' and st.src_doc_date = z.business_date and st.src_location_code = z.location_code))");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(3, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(4, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		
		sb.append("  UNION ALL  \r\n"
				+ "\r\n"
				+ "  SELECT '3' as transaction_type,\r\n"
				+ "				 st.transfer_type , st.status, \r\n"
				+ "				 case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
				+ "				 WHEN (st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' or st.transfer_type ='MER_BTQ') and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
				+ "				 END as from_where,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.transfer_type='FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
				+ "				 WHEN (st.transfer_type='BTQ_BTQ' or st.transfer_type ='BTQ_CFA' or st.transfer_type ='MER_BTQ') and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
				+ "				 END as from_location,std.lot_number , \r\n"
				+ "				\r\n"
				+ "				 std.received_value as stm_value,\r\n"
				+ "				\r\n"
				+ "				 case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
				+ "				 WHEN (st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' or st.transfer_type ='MER_BTQ') and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
				+ "				 END as to_where,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code \r\n"
				+ "				 WHEN (st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' or st.transfer_type ='MER_BTQ') and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code				\r\n"
				+ "				 END as to_location,  \r\n"
				+ "				 \r\n"
				+ "				 std.received_quantity as primary_quantity,\r\n"
				+ "\r\n"
				+ "				 std.received_weight as secondary_quantity, \r\n"
				+ "				\r\n"
				+ "				 st.dest_doc_date as business_date,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'  ELSE 'STRF' END as reason_code,\r\n"
				+ "				\r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN st.dest_location_code \r\n"
				+ "				 ELSE st.src_location_code END  as stm_number_1, \r\n"
				+ "\r\n"
				+ "				 st.src_doc_no as stm_number_2,\r\n"
				+ "				\r\n"
				+ "				 std.item_code ,'Interface' as attribute,\r\n"
				+ "\r\n"
				+ "\r\n"
				+ "				 case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'  ELSE 'STRF' END as attribute_2,\r\n"
				+ "\r\n"
				+ "				 'RECEIVE' as attribute_3,\r\n"
				+ "\r\n"
				+ "				 case WHEN st.order_type is null THEN JSON_VALUE(st.carrier_details,  '$.data.companyName')\r\n"
				+ "				 	ELSE JSON_VALUE(st.carrier_details,  '$.data.courierCompany') END as logistic_partner_name,\r\n"
				+ "\r\n"
				+ "				 JSON_VALUE(st.carrier_details,  '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.IGSTPct') as igst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.IGSTVal') as igst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.SGSTPct') as sgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.SGSTVal') as sgst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.CGSTPct') as cgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.CGSTVal') as cgst_amount,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.UTSTPct') as utgst_percentage,\r\n"
				+ "				 JSON_VALUE(std.tax_details, '$.data.UTGSTVal') as utgst_amount,\r\n"
				+ "				    \r\n"
				+ "				  st.dest_location_code as btq_code\r\n"
				+ "				  \r\n"
				+ "				 From inventory.dbo.stock_transfer st\r\n"
				+ "				 inner join  inventory.dbo.stock_transfer_details std on st.id = std.stock_transfer_id \r\n"
				+ "				 inner join  locations.dbo.location_master lm1 on st.src_location_code = lm1.location_code \r\n"
				+ "				 inner join  locations.dbo.location_master lm2 on st.dest_location_code = lm2.location_code ");
		
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append(
					" where st.transfer_type in ( 'MER_BTQ' , 'BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')\r\n"
							+ "and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
							+ "and ((st.transfer_type ='FAC_BTQ' and st.status ='RECEIVED' and st.dest_doc_date = '"
							+ transactionDate + "') or"
							+ " ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='MER_BTQ') and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "') \r\n"
							+ "or (st.transfer_type ='BTQ_CFA' and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "') or "
							+ "(st.transfer_type ='BTQ_FAC' and st.status ='ISSUED' and st.src_doc_date = '"
							+ transactionDate + "')\r\n"
							+ "or ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='MER_BTQ' or st.transfer_type ='BTQ_CFA') and st.status ='RECEIVED' and st.dest_doc_date = '"
							+ transactionDate + "'))");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "  where st.transfer_type in ('MER_BTQ' , 'BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')\r\n"
					+ "					  and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
					+ "					  and st.status = 'RECEIVED' and st.dest_location_code = z.location_code and st.dest_doc_date = z.business_date");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(3, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(4, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		
		
		reader.setSql(sb.toString());
		reader.setRowMapper(getStnStockInterfaceRowMapper());
		return reader;
	}
	
	
	
//	@Bean(destroyMethod = "")
//	@StepScope 
//	public JdbcCursorItemReader<StockInterfaceDto> stnStagingReader(
//			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
//		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
//		reader.setDataSource(dataSource);
//		StringBuilder sb = new StringBuilder("SELECT '3' as transaction_type,\r\n"
//				+ "st.transfer_type , st.status, \r\n"
//				+ "case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' and st.status = 'ISSUED' THEN  'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_CFA' and st.status = 'ISSUED' THEN 'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_FAC' and st.status = 'ISSUED' THEN 'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
//				+ "END as from_where,\r\n"
//				+ "case WHEN st.transfer_type='FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' and st.status = 'ISSUED' THEN  'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_CFA' and st.status = 'ISSUED' THEN 'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_FAC' and st.status = 'ISSUED' THEN 'B' + st.src_location_code\r\n"
//				+ "WHEN st.transfer_type='BTQ_BTQ' or st.transfer_type ='BTQ_CFA' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
//				+ "END as from_location,std.lot_number , \r\n"
//				
//				+ "case WHEN st.status ='ISSUED' THEN std.issued_value \r\n"
//				+ "ELSE std.received_value END as stm_value,\r\n"//stm_value should take from std table
//				
//				+ "case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' and st.status = 'ISSUED' THEN  'HGIT'\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_CFA' and st.status = 'ISSUED' THEN 'HGIT'\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_FAC' and st.status = 'ISSUED' THEN 'HGIT'\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
//				+ "END as to_where,\r\n"
//				+ "case WHEN st.transfer_type = 'FAC_BTQ' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n" //68-73 for 5.
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' and st.status = 'ISSUED' THEN  'B' + st.dest_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_CFA' and st.status = 'ISSUED' THEN 'B' + st.dest_location_code\r\n"
//				+ "WHEN st.transfer_type = 'BTQ_FAC' and st.status = 'ISSUED' THEN st.dest_location_code\r\n" //(old) - WHEN st.transfer_type = 'BTQ_FAC' and st.status = 'ISSUED' THEN 'B' + st.dest_location_code\r\n
//				+ "WHEN st.transfer_type = 'BTQ_BTQ' or st.transfer_type ='BTQ_CFA' and st.status = 'RECEIVED' THEN 'B' + st.dest_location_code\r\n"
//				
//				+ "END as to_location,\r\n" + "case WHEN st.status ='ISSUED' THEN std.issued_quantity \r\n"
//				+ "ELSE std.received_quantity END as primary_quantity,\r\n"///std - stock details table
//				+ "case WHEN st.status ='ISSUED' THEN std.issued_weight \r\n"
//				+ "ELSE std.received_weight END as secondary_quantity,\r\n" //sec qty //std.received_weight (new) //st.total_issued_weight (old)
//				
//				+ "case WHEN st.status ='ISSUED' THEN st.src_doc_date \r\n"
//				+ "ELSE st.dest_doc_date END as business_date,\r\n"
//				+ "case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'\r\n" + "ELSE 'STRF' END as reason_code,\r\n"
//				
//				+ "case WHEN st.transfer_type ='FAC_BTQ' THEN st.dest_location_code \r\n"
//				+ "ELSE st.src_location_code END  as stm_number_1,\r\n" //stm no.
//				+ "case WHEN st.status ='ISSUED' THEN st.src_doc_no \r\n"
//				+ "ELSE st.src_doc_no END  as stm_number_2, \r\n" 
//				
//				+ "std.item_code ,'Interface' as \"attribute\",\r\n"
//				+ "case WHEN st.transfer_type ='FAC_BTQ' THEN 'FTRF'\r\n" + "ELSE 'STRF' END as attribute_2,\r\n"
//				+ "case WHEN st.status ='ISSUED' THEN 'ISSUE'\r\n" + "ELSE 'RECEIVE' END as attribute_3,\r\n"
//				+ "case WHEN st.order_type is null THEN JSON_VALUE(st.carrier_details,  '$.data.companyName')\r\n"
//				+ "				ELSE JSON_VALUE(st.carrier_details,  '$.data.courierCompany') END as logistic_partner_name,\r\n"
//				+ "JSON_VALUE(st.carrier_details,  '$.data.docketNumber') as logistic_doc_number,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.IGSTPct') as igst_percentage,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.IGSTVal') as igst_amount,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.SGSTPct') as sgst_percentage,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.SGSTVal') as sgst_amount,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.CGSTPct') as cgst_percentage,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.CGSTVal') as cgst_amount,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.UTGSTPct') as utgst_percentage,\r\n"
//				+ "JSON_VALUE(std.tax_details, '$.data.UTGSTVal') as utgst_amount,\r\n"
//				+ " case when st.status = 'ISSUED' then st.src_location_code \r\n"
//				+ " else st.dest_location_code END as btq_code " + "from inventory.dbo.stock_transfer st\r\n"
//				+ "inner join  inventory.dbo.stock_transfer_details std on st.id = std.stock_transfer_id \r\n"
//				+ "inner join  locations.dbo.location_master lm1 on st.src_location_code = lm1.location_code \r\n"
//				+ "inner join  locations.dbo.location_master lm2 on st.dest_location_code = lm2.location_code \r\n");
//		if (!StringUtils.isEmpty(transactionDate)) {
//			sb.append(
//					"where st.transfer_type in ('BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')\r\n"
//							+ "and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
//							+ "and ((st.transfer_type ='FAC_BTQ' and st.status ='RECEIVED' and st.dest_doc_date = '"
//							+ transactionDate + "') or"
//							+ " (st.transfer_type ='BTQ_BTQ' and st.status ='ISSUED' and st.src_doc_date = '"
//							+ transactionDate + "') \r\n"
//							+ "or (st.transfer_type ='BTQ_CFA' and st.status ='ISSUED' and st.src_doc_date = '"
//							+ transactionDate + "') or "
//							+ "(st.transfer_type ='BTQ_FAC' and st.status ='ISSUED' and st.src_doc_date = '"
//							+ transactionDate + "')\r\n"
//							+ "or ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='BTQ_CFA') and st.status ='RECEIVED' and st.dest_doc_date = '"
//							+ transactionDate + "'))");
//		} else {
//			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
//					+ " where st.transfer_type in ('BTQ_BTQ','BTQ_CFA','BTQ_FAC','FAC_BTQ') and (lm1.owner_type is null or lm1.owner_type != 'L3')"
//					+ " and (lm2.owner_type is null or lm2.owner_type != 'L3')"
//					+ " and ((st.transfer_type ='FAC_BTQ' and st.status ='RECEIVED' and st.dest_location_code = z.location_code and st.dest_doc_date = z.business_date) or"
//					+ " (st.transfer_type ='BTQ_BTQ' and st.status ='ISSUED' and st.src_location_code = z.location_code and st.src_doc_date = z.business_date) "
//					+ " or (st.transfer_type ='BTQ_CFA' and st.status ='ISSUED'and st.src_location_code = z.location_code and st.src_doc_date = z.business_date) or"
//					+ " (st.transfer_type ='BTQ_FAC' and st.status ='ISSUED' and st.src_location_code = z.location_code and st.src_doc_date = z.business_date)"
//					+ " or ((st.transfer_type ='BTQ_BTQ' or st.transfer_type ='BTQ_CFA') and st.status ='RECEIVED' and st.dest_location_code = z.location_code and st.dest_doc_date = z.business_date))");
//
//			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
//				public void setValues(PreparedStatement preparedStatement) throws SQLException {
//					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
//					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
//				}
//			});
//		}
//		reader.setSql(sb.toString());
//		reader.setRowMapper(getStnStockInterfaceRowMapper());
//		return reader;
//	}
	
	

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StockInterfaceDto> otherStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT \r\n"
				+ "case when st.transaction_type ='LOAN' or  st.transaction_type ='EXH' THEN '3'\r\n"
				+ "ELSE '2' END as transaction_type,\r\n"
				
				+ "case WHEN st.transaction_type ='LOAN' and st.status = 'ISSUED' THEN\r\n"
				+ "				\r\n"
				+ "					CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END\r\n"
				+ "				WHEN st.transaction_type = 'LOAN' and st.status = 'RECEIVED' THEN\r\n"
				+ "					CASE WHEN st.issued_doc_date = z.business_date THEN \r\n"
				+ "						CASE WHEN lm.location_type ='BTQ' THEN 'B' + st.location_code ELSE st.location_code END\r\n"
				+ "					ELSE 'HGIT' END \r\n"
				
				+ "WHEN st.transaction_type ='LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ' then 'B'  +    st.location_code \r\n"
				+ " ELSE st.location_code END\r\n"
				+ "WHEN st.transaction_type ='PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ'  then 'B' + st.location_code \r\n"
				+ "ELSE st.location_code   END\r\n"
				+ "WHEN st.transaction_type ='ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type = 'BTQ' then 'B' + st.location_code \r\n"
				+ "ELSE st.location_code END WHEN st.transaction_type ='EXH' and st.status = 'ISSUED' THEN\r\n"
				+ "CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code   ELSE st.location_code END\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN  'HGIT' \r\n"
				+ "WHEN st.transaction_type ='CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ'   then 'B' + st.location_code \r\n"
				+ "ELSE  st.location_code  END\r\n"
				+ "WHEN st.transaction_type ='FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type =  'BTQ' then 'B' + st.location_code \r\n"
				+ " ELSE st.location_code END  END as from_where,\r\n"
				
				+ "case WHEN st.transaction_type ='LOAN' and st.status = 'ISSUED' THEN\r\n"
				+ "					CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END\r\n"
				+ "				WHEN st.transaction_type = 'LOAN' and st.status = 'RECEIVED' THEN  \r\n"
				+ "				CASE WHEN st.issued_doc_date = z.business_date THEN \r\n"
				+ "						CASE WHEN lm.location_type ='BTQ' THEN 'B' + st.location_code ELSE st.location_code END\r\n"
				+ "					ELSE 'BLON' END	 \r\n"
				
				+ "WHEN st.transaction_type ='LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type = 'BTQ' then  'B' + st.location_code \r\n"
				+ "ELSE    st.location_code END\r\n"
				+ "WHEN st.transaction_type ='PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code \r\n"
				+ "  ELSE  st.location_code END\r\n"
				+ "WHEN st.transaction_type ='ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code \r\n"
				+ "  ELSE st.location_code END\r\n"
				+ "WHEN st.transaction_type ='EXH' and st.status = 'ISSUED' THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ' then  'B' + st.location_code \r\n"
				+ " ELSE st.location_code END\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN  'BEXH' \r\n"
				+ "WHEN st.transaction_type ='CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ' then 'B'  + st.location_code \r\n"
				+ "   ELSE st.location_code END\r\n"
				+ "WHEN st.transaction_type ='FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "CASE WHEN lm.location_type ='BTQ' then 'B'  + st.location_code \r\n"
				+ "    ELSE st.location_code END\r\n" + "END as from_location,\r\n" + "std.lot_number ,\r\n"
				
				//stm value
				+ "case WHEN st.status ='ISSUED' THEN std.issued_value \r\n"
				+ "ELSE std.received_value END as stm_value,\r\n"//stm value 
				
				+ "case WHEN st.transaction_type = 'LOAN' and st.status = 'ISSUED' THEN 'HGIT'\r\n"
				+ "				WHEN st.transaction_type ='LOAN' and st.status = 'RECEIVED' THEN\r\n"
				+ "					CASE WHEN st.issued_doc_date = z.business_date THEN 'HGIT'\r\n"
				+ "					ELSE \r\n"
				+ "						CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END\r\n"
				+ "					END\r\n"
				
				+ "WHEN st.transaction_type = 'LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'ISSUED' THEN 'HGIT'\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN 'B'+st.location_code\r\n"
				+ "WHEN st.transaction_type = 'CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "END as to_where,\r\n"
				
				+ "case WHEN st.transaction_type = 'LOAN' and st.status = 'ISSUED' THEN 'BLON'\r\n"
				+ "				WHEN st.transaction_type ='LOAN' and st.status = 'RECEIVED' THEN\r\n"
				+ "					CASE WHEN st.issued_doc_date = z.business_date THEN 'BLON'\r\n"
				+ "					ELSE\r\n"
				+ "						CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END\r\n"
				+ "					END\r\n"
				
				+ "WHEN st.transaction_type = 'LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'ISSUED' THEN 'BEXH'\r\n"
				+ "WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN 'B'+st.location_code\r\n"
				+ "WHEN st.transaction_type = 'CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "WHEN st.transaction_type = 'FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "END as to_location,\r\n"
				
				//primary secondary qty
				+ "CASE WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') THEN\r\n"
				+ "CASE WHEN st.status ='ISSUED' THEN CONCAT('-',std.issued_quantity) \r\n"
				+ "ELSE std.received_quantity END ELSE \r\n"
				+ "CASE WHEN st.status ='ISSUED' THEN std.issued_quantity\r\n"
				+ "ELSE std.received_quantity END END as primary_quantity,\r\n"
				
				+ "CASE WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') THEN\r\n" 
				+ "CASE WHEN st.status ='ISSUED' THEN CONCAT('-',std.issued_weight) \r\n"
				+ "ELSE std.received_weight END ELSE \r\n"
				+ "CASE WHEN st.status ='ISSUED' THEN std.issued_weight\r\n" 
				+ "ELSE std.received_weight END\r\n" + "END as secondary_quantity,\r\n" //sec qty
				
				//+ "--case WHEN st.status ='ISSUED' THEN st.issued_doc_date\r\n"
				//+ " --ELSE st.received_doc_date END as business_date,\r\n"
				+ "z.business_date,"
				+ "case WHEN st.transaction_type ='LOAN' THEN 'LOAN'\r\n"
				+ " WHEN st.transaction_type ='LOSS' THEN 'LOS'\r\n" + " WHEN st.transaction_type ='PSV' THEN 'PSV'\r\n"
				+ " WHEN st.transaction_type ='ADJ' THEN 'ADJ'\r\n" + " WHEN st.transaction_type ='EXH' THEN 'EXHB'\r\n"
				+ " WHEN st.transaction_type ='CONV' THEN 'CONV'\r\n"
				+ " WHEN st.transaction_type ='FOC' THEN 'FOC'\r\n" + "END as reason_code,\r\n"
				
				//stm no.
				+ "case WHEN st.transaction_type ='LOAN' or st.transaction_type ='EXH' THEN CONCAT(st.location_code, '/', st.issued_doc_no)\r\n" //stm no.
				+ "WHEN st.status ='ISSUED' THEN CONCAT(st.location_code, '/', st.issued_doc_no)\r\n"
				+ "WHEN st.Status = 'RECEIVED' AND st.issued_doc_no > 0 AND st.issued_doc_date != st.received_doc_date  AND st.issued_doc_date = z.business_date AND st.total_issued_quantity>0 THEN  CONCAT(st.location_code, '/', st.issued_doc_no)"
				+ "WHEN st.status ='RECEIVED' and st.received_doc_date = z.business_date THEN CONCAT(st.location_code, '/', st.issued_doc_no)\r\n"
				+ " END  as stm_number,\r\n" 
				
				+ "std.item_code ,\r\n" + " 'Interface' as \"attribute\",\r\n"
				+ "case WHEN st.transaction_type ='LOAN' THEN CONCAT(JSON_VALUE(st.carrier_details , '$.data.employeeId'), '-', JSON_VALUE(st.carrier_details , '$.data.employeeName')  )\r\n"
				+ "WHEN st.status ='ISSUED' THEN LEFT(st.issued_remarks,44)\r\n"
				+ "WHEN st.status ='RECEIVED' THEN LEFT(st.received_remarks,44)\r\n" + " END as attribute_2,\r\n"
				+ "case WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') then 'ADJUST'\r\n"
				+ "WHEN st.status ='ISSUED' THEN 'ISSUE' WHEN st.Status = 'RECEIVED' AND st.issued_doc_date != st.received_doc_date AND st.issued_doc_no > 0  AND st.issued_doc_date = z.business_date AND st.total_issued_quantity>0 THEN  'ISSUE' WHEN st.Status = 'RECEIVED' Then 'RECEIVE' END as attribute_3,\r\n"
				+ "JSON_VALUE(st.carrier_details ,  '$.data.courierName') as logistic_partner_name,\r\n"
				+ "JSON_VALUE(st.carrier_details ,  '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details, '$.data.IGSTPct') ELSE NULL END as igst_percentage,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.IGSTVal') ELSE NULL END as igst_amount,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.SGSTPct') ELSE NULL END as sgst_percentage,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.SGSTVal') ELSE NULL END as sgst_amount,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.CGSTPct') ELSE NULL END as cgst_percentage,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.CGSTVal') ELSE NULL END as cgst_amount,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.UTSTPct') ELSE NULL END as utgst_percentage,\r\n"
				+ "	CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.UTGSTVal') ELSE NULL END as utgst_amount,\r\n"
				+ "st.location_code  as btq_code\r\n" + "from inventory.dbo.stock_transaction st \r\n"
				+ "inner join inventory.dbo.stock_transaction_details std on st.id =std.stock_transaction_id \r\n"
				+ "inner join locations.dbo.location_master lm on st.location_code = lm.location_code");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append(
					"where lm.owner_type != 'L3' and st.transaction_type in ('ADJ','EXH','LOAN','PSV','CONV', 'LOSS') and st.status in ('ISSUED', 'RECEIVED') \r\n"
					+ "	and ((st.status='ISSUED'  and st.issued_doc_date = '" + transactionDate + "') or (st.status='RECEIVED'  and st.received_doc_date = '" + transactionDate +"') or (st.status='RECEIVED' and st.issued_doc_date = '" + transactionDate +  "' and st.issued_doc_no > 0 AND st.total_issued_quantity>0 ))\r\n"
					//+ ""
						//	+ "and ((st.status='ISSUED'  and st.issued_doc_date = '" + transactionDate
							//+ "') or (st.status='RECEIVED'  and st.received_doc_date = '" + transactionDate + "'))"
									+ "");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where lm.owner_type != 'L3' and st.transaction_type in ('ADJ','EXH','LOAN','PSV','CONV', 'LOSS') and st.status in ('ISSUED', 'RECEIVED') and st.location_code = z.location_code\r\n"
					+ "					and ((st.status='ISSUED'  and st.issued_doc_date = z.business_date) or (st.status='RECEIVED'  and st.received_doc_date = z.business_date) or (st.status='RECEIVED' and st.issued_doc_date = z.business_date and st.issued_doc_no > 0 AND st.total_issued_quantity>0 ))\r\n"
					+ "");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(3, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(4, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		
		///UNION START
		sb.append("union all\r\n"
				+ "\r\n"
				+ "			SELECT \r\n"
				+ "			case when st.transaction_type ='LOAN' or  st.transaction_type ='EXH' THEN '3'\r\n"
				+ "			ELSE '2' END as transaction_type,\r\n"
				+ "\r\n"
				+ "			case WHEN st.transaction_type ='LOAN' and st.status = 'RECEIVED' THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END \r\n"
				+ "			WHEN st.transaction_type ='LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then 'B'  +    st.location_code \r\n"
				+ "			 ELSE st.location_code END\r\n"
				+ "			WHEN st.transaction_type ='PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ'  then 'B' + st.location_code \r\n"
				+ "			ELSE st.location_code   END\r\n"
				+ "			WHEN st.transaction_type ='ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type = 'BTQ' then 'B' + st.location_code \r\n"
				+ "			ELSE st.location_code END \r\n"
				+ "			WHEN st.transaction_type ='EXH' and st.status = 'RECEIVED' THEN\r\n"
				+ "			CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code   ELSE st.location_code END \r\n"
				+ "			WHEN st.transaction_type ='CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ'   then 'B' + st.location_code\r\n"
				+ "			ELSE  st.location_code  END\r\n"
				+ "			WHEN st.transaction_type ='FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type =  'BTQ' then 'B' + st.location_code \r\n"
				+ "			 ELSE st.location_code END  END as from_where,\r\n"
				+ "			\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type ='LOAN' and st.status = 'RECEIVED' THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then 'B' + st.location_code  ELSE st.location_code END \r\n"
				+ "			WHEN st.transaction_type ='LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type = 'BTQ' then  'B' + st.location_code \r\n"
				+ "			ELSE    st.location_code END\r\n"
				+ "			WHEN st.transaction_type ='PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code \r\n"
				+ "			  ELSE  st.location_code END\r\n"
				+ "			WHEN st.transaction_type ='ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN  lm.location_type ='BTQ' then 'B' + st.location_code \r\n"
				+ "			  ELSE st.location_code END\r\n"
				+ "			WHEN st.transaction_type ='EXH' and st.status = 'RECEIVED' THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then  'B' + st.location_code \r\n"
				+ "			 ELSE st.location_code END \r\n"
				+ "			WHEN st.transaction_type ='CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then 'B'  + st.location_code \r\n"
				+ "			   ELSE st.location_code END\r\n"
				+ "			WHEN st.transaction_type ='FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN\r\n"
				+ "			CASE WHEN lm.location_type ='BTQ' then 'B'  + st.location_code \r\n"
				+ "			    ELSE st.location_code END END as from_location,\r\n"
				+ "				\r\n"
				+ "				std.lot_number ,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.status ='RECEIVED' THEN std.issued_value \r\n"
				+ "			ELSE std.received_value END as stm_value,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type = 'LOAN' and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
				+ "			WHEN st.transaction_type = 'LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN 'HGIT'\r\n"
				+ "			WHEN st.transaction_type = 'CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			END as to_where,\r\n"
				+ "		\r\n"
				+ "		\r\n"
				+ "			case WHEN st.transaction_type = 'LOAN' and st.status = 'RECEIVED' THEN 'BLON'\r\n"
				+ "			WHEN st.transaction_type = 'LOSS' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'PSV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'ADJ' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'EXH' and st.status = 'RECEIVED' THEN 'BEXH'\r\n"
				+ "			WHEN st.transaction_type = 'CONV' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			WHEN st.transaction_type = 'FOC' and (st.status = 'ISSUED' or st.status ='RECEIVED') THEN ''\r\n"
				+ "			END as to_location,\r\n"
				+ "			\r\n"
				+ "			CASE WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') THEN\r\n"
				+ "			CASE WHEN st.status ='RECEIVED' THEN CONCAT('-',std.issued_quantity) \r\n"
				+ "			ELSE std.received_quantity END ELSE \r\n"
				+ "			CASE WHEN st.status ='RECEIVED' THEN std.issued_quantity\r\n"
				+ "			ELSE std.received_quantity END END as primary_quantity,\r\n"
				+ "			\r\n"
				+ "			\r\n"
				
				+ "			CASE WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') THEN\r\n"
				+ "			CASE WHEN st.status ='ISSUED' THEN CONCAT('-',std.issued_weight) \r\n"
				+ "			ELSE std.received_weight END ELSE \r\n"
				+ "			CASE WHEN st.status ='ISSUED' THEN std.issued_weight\r\n"
				+ "			ELSE std.received_weight END END as secondary_quantity,\r\n"
				
				+ "			\r\n"
				+ "			case WHEN st.status ='RECEIVED' THEN st.issued_doc_date\r\n"
				+ "			END as business_date,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type ='LOAN' THEN 'LOAN'\r\n"
				+ "			 WHEN st.transaction_type ='LOSS' THEN 'LOS' WHEN st.transaction_type ='PSV' THEN 'PSV'\r\n"
				+ "			 WHEN st.transaction_type ='ADJ' THEN 'ADJ' WHEN st.transaction_type ='EXH' THEN 'EXHB'\r\n"
				+ "			 WHEN st.transaction_type ='CONV' THEN 'CONV'\r\n"
				+ "			 WHEN st.transaction_type ='FOC' THEN 'FOC' END as reason_code,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type ='LOAN' or st.transaction_type ='EXH' THEN CONCAT(st.location_code, '/', st.issued_doc_no)\r\n"
				+ "			WHEN st.status ='RECEIVED' THEN CONCAT(st.location_code, '/', st.issued_doc_no)\r\n"
				+ "			 END  as stm_number,\r\n"
				+ "			std.item_code , \r\n"
				+ "			\r\n"
				+ "			'Interface' as attribute,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type ='LOAN' THEN CONCAT(JSON_VALUE(st.carrier_details , '$.data.employeeId'), '-', JSON_VALUE(st.carrier_details , '$.data.employeeName'))\r\n"
				+ "			WHEN st.status ='RECEIVED' THEN LEFT(st.issued_remarks,44)\r\n"
				+ "			END as attribute_2,\r\n"
				+ "			\r\n"
				+ "			case WHEN st.transaction_type in ('LOSS','PSV','ADJ','CONV','FOC') then 'ADJUST'\r\n"
				+ "			WHEN st.status ='RECEIVED' THEN 'ISSUE' END as attribute_3,\r\n"
				+ "			\r\n"
				+ "			JSON_VALUE(st.carrier_details ,  '$.data.courierName') as logistic_partner_name,\r\n"
				+ "			JSON_VALUE(st.carrier_details ,  '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details, '$.data.IGSTPct') ELSE NULL END as igst_percentage,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.IGSTVal') ELSE NULL END as igst_amount,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.SGSTPct') ELSE NULL END as sgst_percentage,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.SGSTVal') ELSE NULL END as sgst_amount,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.CGSTPct') ELSE NULL END as cgst_percentage,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.CGSTVal') ELSE NULL END as cgst_amount,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.UTSTPct') ELSE NULL END as utgst_percentage,\r\n"
				+ "			CASE WHEN st.transaction_type ='LOSS' THEN JSON_VALUE(std.tax_details , '$.data.UTGSTVal') ELSE NULL END as utgst_amount, \r\n"
				+ "			st.location_code  as btq_code \r\n"
				+ "			\r\n"
				+ "			from inventory.dbo.stock_transaction st \r\n"
				+ "			inner join inventory.dbo.stock_transaction_details std on st.id =std.stock_transaction_id \r\n"
				+ "			inner join locations.dbo.location_master lm on st.location_code = lm.location_code");
		
		///
				if (!StringUtils.isEmpty(transactionDate)) {
					sb.append(
							"where lm.owner_type != 'L3' and st.transaction_type in ('EXH','LOAN','CONV', 'LOSS') and st.status in ('RECEIVED') \r\n"
							+ "		and st.total_issued_weight>0 and st.total_issued_value>0 and total_issued_quantity>0	and st.issued_doc_date=st.received_doc_date 	and  (st.status='RECEIVED'  and st.received_doc_date = '" + transactionDate + "')");
				} else {
					sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
							+ "where lm.owner_type != 'L3' and st.transaction_type in ('EXH','LOAN','CONV', 'LOSS') and st.status in ('RECEIVED') and st.location_code = z.location_code \r\n"
							+ " and st.total_issued_weight>0 and st.total_issued_value>0 and total_issued_quantity>0 and st.issued_doc_date=st.received_doc_date and (st.status='RECEIVED'  and st.received_doc_date = z.business_date)");

					reader.setPreparedStatementSetter(new PreparedStatementSetter() {
						public void setValues(PreparedStatement preparedStatement) throws SQLException {
							preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
							preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
							preparedStatement.setString(3, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
							preparedStatement.setString(4, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
						}
					});
				}
				
				///
		
		/////UNION END
		
		
		
		reader.setSql(sb.toString());
		reader.setRowMapper(getStockInterfaceRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StockInterfaceDto> tepGepIssueStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT st.transfer_type , '3' as transaction_type,\r\n"
				+ "				'B' + st.src_location_code as from_where, 'B' + st.src_location_code as from_location,\r\n"
				+ "				std.lot_number ,  std.issued_value as stm_value, 'HGIT' as to_where, \r\n"
				+ "				case WHEN lm2.location_type ='BTQ' then 'B' + st.dest_location_code \r\n"
				+ "				WHEN lm2.location_type ='C' then 'C' + st.dest_location_code \r\n"
				+ "				WHEN lm2.location_type ='FAC' then st.dest_location_code END as to_location, \r\n"
				+ "				\r\n"
				+ "				CASE\r\n"
				+ "				WHEN st.transfer_type in ('TEP_GOLD_COIN','TEP_PLAIN','TEP_STUDDED') and (std.item_code like '20%' or std.item_code like '21%') then std.issued_quantity *5\r\n"
				+ "				ELSE \r\n"
				+ "				std.issued_quantity END as primary_quantity,\r\n"
				+ "				\r\n"
				+ "				CASE WHEN std.bin_group_code = 'DISPUTE' THEN CAST(std.std_weight as varchar) ELSE CAST(std.issued_weight as varchar) END as secondary_quantity, \r\n"
				+ "				\r\n"
				+ "				st.src_doc_date as business_date,  \r\n"
				+ "				CASE WHEN st.transfer_type ='DEFECTIVE' then\r\n"
				+ "				'STRF' else\r\n"
				+ "				'TGEP' END \r\n"
				+ "				as reason_code,\r\n"
				+ "\r\n"
				+ "				CASE WHEN st.transfer_type in ('TEP_GOLD_COIN','TEP_PLAIN','TEP_STUDDED') then st.src_location_code + '/TEPR/' + TRY_CONVERT(varchar, st.src_doc_no) \r\n"
				+ "				WHEN st.transfer_type = 'GEP' then st.src_location_code + '/GEPR/' + TRY_CONVERT(varchar, st.src_doc_no) \r\n"
				+ "				ELSE st.src_location_code + '/DEF/' + TRY_CONVERT(varchar, st.src_doc_no) END as stm_number, \r\n"
				+ "				 std.item_code , 'Interface' as  attribute,\r\n"
				+ "				\r\n"
				+ "				CASE WHEN st.transfer_type='DEFECTIVE' then 'STRF' \r\n"
				+ "				 				WHEN st.transfer_type='GEP' THEN  \r\n"
				+ "				 				CONCAT( st.src_location_code , 'GEP', TRY_CONVERT(varchar,std.ref_doc_no ),TRY_CONVERT(varchar,std.ref_fiscal_year) , \r\n"
				+ "				 				TRY_CONVERT(varchar,(ged.row_id)))\r\n"
				+ "				 \r\n"
				+ "				 				ELSE CONCAT(st.src_location_code, TRY_CONVERT(varchar,std.ref_doc_no), TRY_CONVERT(varchar,std.ref_fiscal_year) , \r\n"
				+ "								TRY_CONVERT(varchar,(ged.row_id)))\r\n"
				+ "				 				end as attribute_2,\r\n"
				+ "\r\n"
				+ "				'ISSUE'as attribute_3,\r\n"
				+ "				case WHEN st.order_type is null THEN JSON_VALUE(st.carrier_details,  '$.data.companyName')\r\n"
				+ "								ELSE JSON_VALUE(st.carrier_details,  '$.data.courierCompany') END as logistic_partner_name,\r\n"
				+ "				JSON_VALUE(st.carrier_details , '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.IGSTPct') as igst_percentage,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.IGSTVal') as igst_amount,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.SGSPct') as sgst_percentage,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.SGSTVal') as sgst_amount,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.CGSPct') as cgst_percentage,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.CGSTVal') as cgst_amount,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.UTSTPct') as utgst_percentage,\r\n"
				+ "				JSON_VALUE(std.tax_details , '$.data.UTGSTVal') as utgst_amount,\r\n"
				+ "				case when st.status = 'ISSUED' then st.src_location_code \r\n"
				+ "				else st.dest_location_code END as btq_code \r\n"
				+ "				\r\n"
				+ "				from inventory.dbo.stock_transfer st \r\n"
				+ "				inner join inventory.dbo.stock_transfer_details std on st.id =std.stock_transfer_id \r\n"
				+ "				inner join locations.dbo.location_master lm1 on st.src_location_code = lm1.location_code \r\n"
				+ "				inner join locations.dbo.location_master lm2 on st.dest_location_code = lm2.location_code \r\n"
				+ "			    left join sales.dbo.goods_exchange_details ged on ged.inventory_id = std.inventory_id");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append(
					"where st.transfer_type in ('DEFECTIVE','TEP_GOLD_COIN','TEP_PLAIN','TEP_STUDDED','GEP') and st.status ='ISSUED' and st.src_location_code = z.location_code \r\n"
					+ "					and (lm1.owner_type is null or lm1.owner_type != 'L3') and (lm2.owner_type is null or lm2.owner_type != 'L3') and st.src_doc_date='"
							+ transactionDate + "'");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where st.transfer_type in ('DEFECTIVE','TEP_GOLD_COIN','TEP_PLAIN','TEP_STUDDED','GEP') and st.status ='ISSUED' and st.src_location_code = z.location_code and st.src_doc_date = z.business_date \r\n"
					+ "					and (lm1.owner_type is null or lm1.owner_type != 'L3') and (lm2.owner_type is null or lm2.owner_type != 'L3') ");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		reader.setSql(sb.toString());
		reader.setRowMapper(getStockInterfaceRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StockInterfaceDto> tepGepCancelStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT \r\n" + "'2' as transaction_type,\r\n"
				+ "'B' + st.location_code as from_where,\r\n" + "'B' + st.location_code as from_location,\r\n"
				+ "ged.lot_number , \r\n" + "ged.total_value as stm_value,\r\n" + "'' as to_where,\r\n"
				+ "'' as to_location,\r\n" + "CASE WHEN st.txn_type ='GEP' then CONCAT('-', ged.total_weight )\r\n"
				+ "WHEN st.txn_type   = 'TEP' THEN  CONCAT('-', ged.quantity)\r\n" + "END as primary_quantity,\r\n"
				+ "CASE WHEN st.txn_type ='TEP' then  CONCAT('-', ged.total_weight ) \r\n" + "ELSE ''\r\n"//sec qt  //else?
				+ "END  as secondary_quantity,\r\n" + "st.doc_date as business_date,\r\n" + "'TGEC' as reason_code,\r\n"
				+ "CONCAT(st.location_code, '/TGEC/',st.doc_no) as stm_number,\r\n" + " ged.item_code , " // STN number (old)- CONCAT(st.location_code, '/TGEC/',st.doc_no)
				+ "'Interface' as \"attribute\",\r\n"
				+ "case WHEN st.txn_type ='TEP' THEN CONCAT(st.location_code, st.doc_no ,st.fiscal_year,ged.row_id)\r\n"
				+ "ELSE  CONCAT(st.location_code, 'GEP', st.doc_no ,st.fiscal_year,ged.row_id) \r\n"
				+ "END as attribute_2,\r\n" + "'ADJUST'as attribute_3,\r\n" + "'' as logistic_partner_name,\r\n"
				+ "'' as logistic_doc_number,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.IGST.taxPercentage') as igst_percentage,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.IGST.taxValue') as igst_amount,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.SGST.taxPercentage') as sgst_percentage,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.SGST.taxValue') as sgst_amount,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.CGST.taxPercentage') as cgst_percentage,\r\n"   //3. ged or ge?
				+ "JSON_VALUE(ged.tax_details , '$.data.CGST.taxValue') as cgst_amount,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.UTGST.taxPercentage') as utgst_percentage,\r\n"
				+ "JSON_VALUE(ged.tax_details , '$.data.UTGST.taxValue') as utgst_amount,\r\n"
				+ "st.location_code as btq_code\r\n" + "from sales.dbo.sales_transaction st \r\n"
				+ "inner join sales.dbo.goods_exchange ge on st.id=ge.id \r\n"
				+ "inner join sales.dbo.goods_exchange_details ged on ged.goods_exchange_id = ge.id");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append("where st.txn_type in ('GEP','TEP') and st.status='CANCELLED' and st.doc_date='" + transactionDate
					+ "'");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where st.txn_type in ('GEP','TEP') and st.status='CANCELLED' and st.location_code = z.location_code and st.doc_date = z.business_date");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		reader.setSql(sb.toString());
		reader.setRowMapper(getStockInterfaceRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StockInterfaceDto> cutpieceTepStagingReader(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		StringBuilder sb = new StringBuilder("SELECT st.transfer_type ,\r\n" + "'3' as transaction_type,\r\n"
				+ "'B' + st.src_location_code as from_where,\r\n" + "'B' + st.src_location_code as from_location,\r\n"
				+ "std.lot_number , \r\n" + "std.issued_value as stm_value,\r\n" + "'HGIT' as to_where,\r\n"
				+ "st.dest_location_code  as to_location,\r\n" 
				
				+ "std.issued_quantity as primary_quantity,\r\n"
				+ "std.issued_weight as secondary_quantity,\r\n" //sec qty
				
				+ "st.src_doc_date as business_date,\r\n" 
				+ "'STRF' as reason_code,\r\n"
				+ " st.src_location_code+'/'+ TRY_CONVERT(varchar, st.src_doc_no)  as stm_number, \r\n"
				+ " std.item_code ," + "'Interface' as \"attribute\",\r\n"
				+ "'STRF' attribute_2, -- need to update this later as row id is not available\r\n"
				+ "'ISSUE'as attribute_3,\r\n"
				+ "case WHEN st.order_type is null THEN JSON_VALUE(st.carrier_details,  '$.data.companyName')\r\n"
				+ "				ELSE JSON_VALUE(st.carrier_details,  '$.data.courierCompany') END as logistic_partner_name,\r\n"
				+ "JSON_VALUE(st.carrier_details , '$.data.docketNumber') as logistic_doc_number,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.IGSTPct') as igst_percentage,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.IGSTVal') as igst_amount,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.SGSTPct') as sgst_percentage,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.SGSTVal') as sgst_amount,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.CGSTPct') as cgst_percentage,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.CGSTVal') as cgst_amount,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.UTSTPct') as utgst_percentage,\r\n"
				+ "JSON_VALUE(std.tax_details , '$.data.UTGSTVal') as utgst_amount,\r\n"
				+ " st.src_location_code  as btq_code\r\n" + "from inventory.dbo.stock_transfer st \r\n"
				+ "inner join inventory.dbo.stock_transfer_details std on st.id =std.stock_transfer_id and std.bin_code ='CUTPIECE'\r\n"
				+ "inner join locations.dbo.location_master lm1 on st.src_location_code = lm1.location_code \r\n"
				+ "inner join locations.dbo.location_master lm2 on st.dest_location_code = lm2.location_code \r\n"
				+ "inner join products.dbo.item_master im on std.item_code = im.item_code");
		if (!StringUtils.isEmpty(transactionDate)) {
			sb.append(" where st.transfer_type in ('TEP_PLAIN','TEP_STUDDED') and st.status ='ISSUED' and \r\n"
					+ "(lm1.owner_type is null or lm1.owner_type != 'L3') and (lm2.owner_type is null or lm2.owner_type != 'L3') and st.src_doc_date='"
					+ transactionDate + "'");
		} else {
			sb.append("," + FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.transfer_type in ('TEP_PLAIN','TEP_STUDDED') and st.status ='ISSUED' and \r\n"
					+ "(lm1.owner_type is null or lm1.owner_type != 'L3') and (lm2.owner_type is null or lm2.owner_type != 'L3')\r\n"
					+ "and st.src_doc_date = z.business_date and st.src_location_code = z.location_code");

			reader.setPreparedStatementSetter(new PreparedStatementSetter() {
				public void setValues(PreparedStatement preparedStatement) throws SQLException {
					preparedStatement.setString(1, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
					preparedStatement.setString(2, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue());
				}
			});
		}
		reader.setSql(sb.toString());
		reader.setRowMapper(getStockInterfaceRowMapper());
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StockInterfaceDto> stockInterfaceFileReader(
			@Value("#{jobExecutionContext['stockInterfaceTransactionId']}") String fileId) {
		JdbcCursorItemReader<StockInterfaceDto> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		//reader.setSql("select * from stock_interface_stage where file_id ='" + fileId + "'");
		// removing gst columns when reason_code = TGEC
		reader.setSql("SELECT sis.transaction_type\r\n"
				+ "      ,sis.from_where\r\n"
				+ "      ,sis.from_location\r\n"
				+ "      ,sis.lot_no\r\n"
				+ "      ,sis.stm_value\r\n"
				+ "      ,sis.to_where\r\n"
				+ "      ,sis.to_location\r\n"
				+ "      ,sis.primary_qty\r\n"
				+ "      ,sis.secondary_qty2\r\n"
				+ "      ,sis.business_date\r\n"
				+ "      ,sis.reason_code\r\n"
				+ "      ,sis.stm_number\r\n"
				+ "      ,sis.item_no\r\n"
				+ "      ,sis.attribute\r\n"
				+ "      ,sis.attribute1\r\n"
				+ "      ,sis.attribute2\r\n"
				+ "      ,sis.attribute3\r\n"
				+ "      ,sis.logistic_partner_name\r\n"  
				+ "      ,sis.logistic_doc_number\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.igst_percentage = 0 THEN NULL ELSE CAST(sis.igst_percentage AS INT) END) as igst_percentage\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.igst_amount = 0 THEN NULL ELSE sis.igst_amount END) as igst_amount\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.sgst_percentage = 0 THEN NULL ELSE sis.sgst_percentage END) as sgst_percentage\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.sgst_amount = 0 THEN NULL ELSE sis.sgst_amount END) as sgst_amount\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.cgst_percentage = 0 THEN NULL ELSE sis.cgst_percentage END) as cgst_percentage\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.cgst_amount = 0 THEN NULL ELSE sis.cgst_amount END) as cgst_amount\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.utgst_percentage = 0 THEN NULL ELSE sis.utgst_percentage END) as utgst_percentage\r\n"
				+ "      ,(CASE WHEN sis.reason_code ='TGEC' OR sis.utgst_amount = 0 THEN NULL ELSE sis.utgst_amount END) as utgst_amount\r\n"
				+ "      ,sis.record_id\r\n"
				+ "      ,sis.btq_code\r\n"
				+ "      ,sis.file_name\r\n"
				+ "      ,sis.file_id\r\n"
				+ "      ,sis.business_date2\r\n"
				+ "  FROM stock_interface_stage sis where file_id ='" + fileId + "'");
		reader.setRowMapper(new BeanPropertyRowMapper<>(StockInterfaceDto.class));
		return reader;
	}

	@Bean
	public StnStockInterfaceRowMapper getStnStockInterfaceRowMapper() {
		return new StnStockInterfaceRowMapper();
	}

	@Bean
	public StockInterfaceRowMapper getStockInterfaceRowMapper() {
		return new StockInterfaceRowMapper();
	}
}
