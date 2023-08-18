/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.TepApDetailsDto;
import com.titan.poss.file.dto.TepApHdrDto;
import com.titan.poss.file.jobs.mapper.TepApDetMapper;
import com.titan.poss.file.jobs.mapper.TepApHdrMapper;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class TepApStagingTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private TepApHdrMapper tepApHdrMapper;

	@Autowired
	private TepApDetMapper tepApDetMapper;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext().get("tepApTransactionId");
		String fileName = (String) chunkContext.getStepContext().getJobExecutionContext().get("fileName");
		String tepSql = null;
		String transactionDate = (String) chunkContext.getStepContext().getJobParameters()
				.get(FileIntegrationConstants.TRANSACTION_DATE);
		String locationCode = (String) chunkContext.getStepContext().getJobParameters()
				.get(FileIntegrationConstants.LOCATION_CODE);
		if (StringUtils.isEmpty(transactionDate)) {
			String initialTepSql = "select 'TEP' as record_type, st.id, st.doc_no ,st.doc_date ,JSON_VALUE(rm.config_details ,'$.data.vendorCode') as vendor_code,JSON_VALUE(rm.config_details ,'$.data.vendorSite')as vendor_site,\r\n"
					+ "ge.final_value as final_value, st.currency_code, ge.refund_details, ct.email_id , ct.customer_name,JSON_VALUE(ge.refund_details,'$.data.bankAccountNo')as account_no,\r\n"
					+ "JSON_VALUE(ge.refund_details,'$.data.ifscCode') as ifsc_code, st.fiscal_year, st.location_code,JSON_VALUE(lm.store_details ,'$.data.boutiqueEmailId') as boutique_email_id\r\n"
					+ "from sales.dbo.sales_transaction st, locations.dbo.location_master lm, sales.dbo.goods_exchange ge, sales.dbo.customer_transaction ct , locations.dbo.region_master rm,\r\n"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.id=ge.id and st.id=ct.id and st.location_code =lm.location_code and lm.region_code = rm.region_code and st.txn_type ='TEP' and st.status ='CONFIRMED' "
					+ "and (JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'CHEQUE'  or\r\n"
					+ "					JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'RTGS'   \r\n"
					+ "					  ) \r\n"
					+ "and st.doc_date = z.business_date and st.location_code =z.location_code and ge.refund_details is not null \r\n"
					
					+ " UNION "
					
					+ " select 'CN' as record_type, st.id, cn.doc_no ,st.doc_date ,JSON_VALUE(rm.config_details ,'$.data.vendorCode') as vendor_code,JSON_VALUE(rm.config_details ,'$.data.vendorSite')as vendor_site,\r\n"
					+ "cn.refund_value as final_value , st.currency_code, pr.other_details as refund_details, ct.email_id , ct.customer_name, JSON_VALUE(pr.other_details,'$.accountNumber') as account_no,\r\n"
					+ "JSON_VALUE(pr.other_details,'$.ifscCode') as ifsc_code, cn.fiscal_year, st.location_code,JSON_VALUE(lm.store_details ,'$.data.boutiqueEmailId') as boutique_email_id\r\n"
					+ "from sales.dbo.payment_refunds pr inner join sales.dbo.credit_note cn on cn.id=pr.credit_note_id\r\n"
					+ "inner join sales.dbo.sales_transaction st on st.id=cn.sales_txn_id\r\n"
					+ "inner join locations.dbo.location_master lm on st.location_code =lm.location_code\r\n"
					+ "inner join sales.dbo.customer_transaction ct on ct.id=st.id\r\n"
					+ "inner join locations.dbo.region_master rm on lm.region_code = rm.region_code,"
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.status='Cancelled' and st.txn_type = 'TEP' and pr.instrument_type in ('CHEQUE','RO PAYMENT','RTGS') and pr.payment_code='RO PAYMENT'\r\n"
					+ "and st.doc_date = z.business_date and st.location_code =z.location_code";
			
			tepSql = initialTepSql.replace("?", "'" + FileMasterJobNameEnum.TEP_AP_JOB.getValue() + "'");
		} else {
			tepSql = "select 'TEP' as record_type, st.id, st.doc_no ,st.doc_date ,JSON_VALUE(rm.config_details ,'$.data.vendorCode') as vendor_code,JSON_VALUE(rm.config_details ,'$.data.vendorSite')as vendor_site,\r\n"
					+ "ge.final_value as final_value, st.currency_code, ge.refund_details, ct.email_id , ct.customer_name,JSON_VALUE(ge.refund_details,'$.data.bankAccountNo')as account_no,\r\n"
					+ "JSON_VALUE(ge.refund_details,'$.data.ifscCode') as ifsc_code, st.fiscal_year, st.location_code,JSON_VALUE(lm.store_details ,'$.data.boutiqueEmailId') as boutique_email_id\r\n"
					+ "from sales.dbo.sales_transaction st, locations.dbo.location_master lm, sales.dbo.goods_exchange ge, sales.dbo.customer_transaction ct , locations.dbo.region_master rm\r\n"
					+ "where st.id=ge.id and st.id=ct.id and st.location_code =lm.location_code and lm.region_code = rm.region_code and st.txn_type ='TEP' and st.status ='CONFIRMED'"
					+ "and (JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'CHEQUE'  or\r\n"
					+ "					JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'RTGS'    \r\n"
					+ "					  ) \r\n "
					+ "and ge.refund_details is not null and st.doc_date = '" + transactionDate + "' "
					+ " UNION "
					+ " select 'CN' as record_type, st.id, cn.doc_no ,st.doc_date ,JSON_VALUE(rm.config_details ,'$.data.vendorCode') as vendor_code,JSON_VALUE(rm.config_details ,'$.data.vendorSite')as vendor_site,\r\n"
					+ "cn.refund_value as final_value , st.currency_code, pr.other_details as refund_details, ct.mobile_number,  ct.email_id , ct.customer_name, JSON_VALUE(pr.other_details,'$.accountNumber') as account_no,\r\n"
					+ "JSON_VALUE(pr.other_details,'$.ifscCode') as ifsc_code, pr.payment_code, cn.fiscal_year, st.location_code,JSON_VALUE(lm.store_details ,'$.data.boutiqueEmailId') as boutique_email_id\r\n"
					+ "from sales.dbo.payment_refunds pr inner join sales.dbo.credit_note cn on cn.id=pr.credit_note_id\r\n"
					+ "inner join sales.dbo.sales_transaction st on st.id=cn.sales_txn_id\r\n"
					+ "inner join locations.dbo.location_master lm on st.location_code =lm.location_code\r\n"
					+ "inner join sales.dbo.customer_transaction ct on ct.id=st.id\r\n"
					+ "inner join locations.dbo.region_master rm on lm.region_code = rm.region_code"
					+ "where cn.status='Cancelled' and st.txn_type ='TEP' and pr.instrument_type in ('CHEQUE','RO PAYMENT','RTGS') and pr.payment_code='RO PAYMENT'\r\n"
					+ "and st.doc_date = '" + transactionDate + "' and st.location_code ='" + locationCode + "'";
		}
		List<TepApHdrDto> tepApHdrs = namedParameterJdbcTemplate.query(tepSql, tepApHdrMapper);

		for (TepApHdrDto tepApHdr : tepApHdrs) {
			// Insert tep ap hdr to stage table
			String tepApHdrSql = "Insert into [file].dbo.tep_ap_header_stage(rec_type,invoice_type,invoice_number,business_date,vendor_code,vendor_site,amount,currency_code,description\r\n"
					+ ",customer_email_id,customer_name,customer_bank_acc_no,bank_ifsc_code,btq_email_id,file_name,file_id, location_code) values ('"
					+ tepApHdr.getRecType() + "','" + tepApHdr.getInvoiceType() + "','" + tepApHdr.getInvoiceNumber()
					+ "','" + tepApHdr.getBusinessDate() + "','" + tepApHdr.getVendorCode() + "','"
					+ tepApHdr.getVendorSite() + "','" + tepApHdr.getAmount() + "','" + tepApHdr.getCurrencyCode()
					+ "','" + tepApHdr.getDescription() + "','" + tepApHdr.getCustomerEmailId() + "','"
					+ tepApHdr.getCustomerName() + "','" + returnEmptyIfNull(tepApHdr.getCustomerBankAccNo()) + "','"
					+ returnEmptyIfNull(tepApHdr.getBankIfscCode()) + "','" + tepApHdr.getBtqEmailId() + "','"
					+ fileName.replace(".txt", "") + "','" + fileId + "','" + tepApHdr.getLocationCode() + "')";
			jdbcTemplate.execute(tepApHdrSql);
		}
		String tepDetSql = null;
		if (StringUtils.isEmpty(transactionDate)) {
			String initialTepDetSql = "select st.id,  'TEP' as record_type, st.doc_no, '' as debit_note_doc_no, '' as debit_note_fiscal_year , st.location_code, st.fiscal_year,st.doc_date , gbcm.cost_center,\r\n"
					+ "	(select gbpm.gl_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  z.location_code ) as gl_code,\r\n"
					+ "	(select gbpm.payment_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  z.location_code ) as payment_code ,\r\n"
					+ "	ged.final_value as final_value , ged.item_code from sales.dbo.sales_transaction st, locations.dbo.location_master lm, sales.dbo.goods_exchange ge,\r\n"
					+ "						locations.dbo.region_master rm, sales.dbo.goods_exchange_details ged, \r\n"
					+ "						payments.dbo.gl_boutique_code_master gbcm, \r\n"
					
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ " where st.id=ge.id and st.location_code =lm.location_code and ge.id= ged.goods_exchange_id and lm.region_code = rm.region_code and st.location_code = gbcm.location_code\r\n"
					+ "					and st.txn_type ='TEP' and st.status ='CONFIRMED' and\r\n"
					+ "					(JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'CHEQUE'  or\r\n"
					+ "					 JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'RTGS'  \r\n"
					+ "					 )\r\n"
					+ "					and  st.doc_date = z.business_date and st.location_code = z.location_code  \r\n"
					+ " UNION "
					+ "select cn.id,  'CN' as record_type, cn.doc_no , cn.debit_note_doc_no, cn.debit_note_fiscal_year  ,cn.location_code, cn.fiscal_year,cn.doc_date , gbcm.cost_center,\r\n"
					+ "						(select gbpm.gl_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  z.location_code ) as gl_code,\r\n"
					+ "						(select gbpm.payment_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  z.location_code ) as payment_code ,\r\n"
					+ "						cn.refund_value as final_value, 'cnCan docNo' as item_code --, ged.item_code \r\n"
					+ "						from sales.dbo.sales_transaction st \r\n"
					+ "						, locations.dbo.location_master lm, \r\n"
					+ "						locations.dbo.region_master rm, \r\n"
					+ "						payments.dbo.gl_boutique_code_master gbcm, \r\n"
					+ "						sales.dbo.credit_note cn,\r\n"
					+ "						sales.dbo.payment_refunds pr , "
					+ FileIntegrationConstants.BUSINESS_DAY_SQL
					+ "where cn.id=pr.credit_note_id and pr.instrument_type in ('CHEQUE','RO PAYMENT','RTGS')  and st.location_code =lm.location_code  and lm.region_code = rm.region_code and st.location_code = gbcm.location_code and st.id=cn.sales_txn_id\r\n"
					+ "										and st.txn_type ='TEP'  and cn.status='CANCELLED' \r\n"
					+ "										and  st.doc_date = z.business_date and st.location_code = z.location_code ";
			
			
			tepDetSql = initialTepDetSql.replace("?", "'" + FileMasterJobNameEnum.TEP_AP_JOB.getValue() + "'");
		} else {
			tepDetSql = " select 'TEP' as record_type, st.doc_no , '' as debit_note_doc_no, '' as debit_note_fiscal_year ,st.location_code, st.fiscal_year,st.doc_date , gbcm.cost_center,\r\n"
					+ "(select gbpm.gl_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  '"+ locationCode +"' ) as gl_code,\r\n"
					+ "(select gbpm.payment_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  '"+ locationCode +"' ) as payment_code ,\r\n"
					+ "ged.final_value as final_value , ged.item_code from sales.dbo.sales_transaction st, locations.dbo.location_master lm, sales.dbo.goods_exchange ge,\r\n"
					+ "					locations.dbo.region_master rm, sales.dbo.goods_exchange_details ged, \r\n"
					+ "					payments.dbo.gl_boutique_code_master gbcm \r\n"
					
					+ "where st.id=ge.id and st.location_code =lm.location_code and ge.id= ged.goods_exchange_id and lm.region_code = rm.region_code and st.location_code = gbcm.location_code\r\n"
					+ "					and st.txn_type ='TEP' and st.status ='CONFIRMED' and\r\n"
					+ "					(JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'CHEQUE'  or\r\n"
					+ "					 JSON_VALUE(ge.refund_details, '$.data.refundMode') LIKE 'RTGS' \r\n"
					+ "					)\r\n "
					
					+ "and st.doc_date ='"
					
					+ transactionDate + "' "
				    + " UNION "
				   
				    + " select  'CN' as record_type, cn.doc_no , cn.debit_note_doc_no, cn.debit_note_fiscal_year  ,st.location_code, cn.fiscal_year,st.doc_date , gbcm.cost_center,\r\n"
				    + "					(select gbpm.gl_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  '"+ locationCode +"' ) as gl_code,\r\n"
				    + "					(select gbpm.payment_code from payments.dbo.gl_boutique_payment_mapping gbpm where gbpm.payment_code='RO PAYMENT' and gbpm.location_code=  '"+ locationCode +"' ) as payment_code ,\r\n"
				    + "					cn.refund_value as final_value , 'cnCan docNo' as item_code from sales.dbo.sales_transaction st, locations.dbo.location_master lm, \r\n"
				    + "										locations.dbo.region_master rm,  \r\n"
				    + "										payments.dbo.gl_boutique_code_master gbcm, sales.dbo.credit_note cn"
				    + "where  st.location_code =lm.location_code  and lm.region_code = rm.region_code and st.location_code = gbcm.location_code and st.id=cn.sales_txn_id\r\n"
				    + "										and st.txn_type ='TEP' and cn.status='CANCELLED'   \r\n"
				    + "										and  st.doc_date = '" + transactionDate + "' and st.location_code = '" + locationCode + "' ";
		}
		List<TepApDetailsDto> tepApDetails = namedParameterJdbcTemplate.query(tepDetSql, tepApDetMapper);
		for (TepApDetailsDto tepApDetail : tepApDetails) {
			// Insert into tep ap detail
			String insertTepApDetSql = "INSERT into [file].dbo.tep_ap_details_stage (rec_type,invoice_type,invoice_number,business_date,vendor_code,vendor_site,amount,currency_code,gl_code_combination,\r\n"
					+ "item_code,customer_name,customer_bank_acc_no,bank_ifsc_code,btq_email_id,file_name,file_id) values('"
					+ tepApDetail.getRecType() + "','','" + tepApDetail.getInvoiceNumber() + "','"
					+ tepApDetail.getBusinessDate() + "','','','" + tepApDetail.getAmount() + "','','"
					+ tepApDetail.getGlCodeCombination() + "','" + tepApDetail.getItemCode() + "','','','','','"
					+ fileName.replace(".txt", "") + "','" + fileId + "')";
			jdbcTemplate.execute(insertTepApDetSql);
		}

		return RepeatStatus.FINISHED;
	}

	private String returnEmptyIfNull(String value) {
		return StringUtils.isEmpty(value) ? "" : value;
	}
}
