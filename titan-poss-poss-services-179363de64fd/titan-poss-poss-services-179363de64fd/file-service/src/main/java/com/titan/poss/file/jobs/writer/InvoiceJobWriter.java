/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.InvoiceStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class InvoiceJobWriter {

	@Autowired
	private DataSource dataSource;

	@Bean()
	public JdbcBatchItemWriter<InvoiceStageDto> invoiceIhdrStagingWriter() {

		String sql = "Insert into inv_ihdr_stage (cfa_hdr,cfa_til,to_sub_inv,cfa_type,cfa_invoice_number,cfa_invoice_date,cfa_fiscal_year,cfa_customer_number,cfa_tot_primary_qty,"
				+ "cfa_tot_secondary_qty,cfa_item_basic_value,cfa_tot_discount_amount,cfa_tax_amount,cfa_other_charges,file_id,currency_code) values (:type, :tilConstant, :srcLocation, :cfaType, "
				+ ":cfaInvoiceNumber, :cfaInvoiceDate, :cfaFiscalYear, :cfaCustomerNumber, :ihdrCfaTotPrimaryQty, :ihdrCfaTotSecondaryQty, :ihdrCfaItemBasicValue, "
				+ ":ihdrCfaTotDiscountAmount, :ihdrCfaTaxAmount, :ihdrCfaOtherCharges, :fileId,:currencyCode) ";
		JdbcBatchItemWriter<InvoiceStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<InvoiceStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<InvoiceStageDto> invoiceIdtlStagingWriter() {

		String sql2 = "Insert into inv_idtl_stage(bin_code,bin_group_code,cfa_customer_number,cfa_diamond_weight,cfa_dtl,cfa_f1,cfa_fiscal_year,"
				+ "cfa_invoice_number,cfa_invoice_type,cfa_net_amount,cfa_other_stone_weight,cfa_product_code,cfa_til,cfa_type,cfa_variant_type,"
				+ "file_id,go_net_wt,invoice_date,isac_details,item_no,line_count,lot_number,mfg_date,order_no,other_net_wt,primary_qty,pt_net_wt,"
				+ "secondary_qty,si_net_wt,stn_net_wt,to_sub_inv,unit_price,issued_weight_details,product_category,item_details) values (:idtlBinCode, :idtlBinGroupCode, :cfaCustomerNumber, :idtlCfaDiamondWeight"
				+ ",:type,:idtlCfaF1,:cfaFiscalYear,:cfaInvoiceNumber,:idtlCfaInvoiceType,:idtlCfaNetAmount,:idtlCfaOtherStoneWeight,:cfaProductCode,:tilConstant"
				+ ",:cfaType,:idtlCfaVariantType,:fileId,:idtlGoNetWt,:cfaInvoiceDate,:idtlIsacDetails,:idtlItemNo2,:idtlLineCount,:idtlLotNumber,:idtlMfgDate"
				+ ",:idtlOrderNo,:idtlOtherNetWt,:idtlPrimaryQty,:idtlPtNetWt,:idtlSecondaryQty,:idtlSiNetWt,:idtlStnNetWt,:srcLocation,:idtlUnitPrice"
				+ ",:issuedWeightDetails,:productCategoryCode, :itemDetails)";

		JdbcBatchItemWriter<InvoiceStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql2);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<InvoiceStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<InvoiceStageDto> invoiceIldtlStagingWriter() {

		String sql = "Insert into inv_ildtl_stage(line_count, line_dtl_count, item_no, stn_weight, stn_qty ,item_code ,lot_number ,file_id, insert_update)"
				+ " values (:ildtlLineCount, :ildtlLineDtlCount, :ildtlItemNo, :ildtlStnWeight, :ildtlStnQty,:itemCode, :lotNumber, :fileId, :insertUpdate)";
		JdbcBatchItemWriter<InvoiceStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<InvoiceStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<InvoiceStageDto> invoiceImdtlStagingWriter() {

		String sql = "Insert into inv_imdtl_stage(line_count, line_dtl_count, item_no, stn_weight, stn_qty ,item_code ,lot_number ,file_id, insert_update)"
				+ "values (:imdtlLineCount, :imdtlLineDtlCount, :imdtlItemNo, :imdtlStnWeight, :imdtlStnQty, :itemCode, :lotNumber, :fileId, :insertUpdate)";
		JdbcBatchItemWriter<InvoiceStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<InvoiceStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
}
