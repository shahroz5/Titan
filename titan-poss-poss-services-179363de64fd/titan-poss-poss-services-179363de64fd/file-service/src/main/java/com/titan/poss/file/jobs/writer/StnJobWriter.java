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

import com.titan.poss.file.dto.StnStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class StnJobWriter {

	@Autowired
	private DataSource dataSource;

	@Bean()
	public JdbcBatchItemWriter<StnStageDto> stnHdrStagingWriter() {

		String sql = "Insert into stn_hdr_stage (location, transfer_type, product_group_code, created_year, delivery_no, stm_date, factory_code,ship_qty, ship_qty2, stm_value, carrier_name, created_by, "
				+ "stm_created_date, stm_created_time, modified_by,docket_number, file_id, carrier_details, stock_transfer_type, created_date) values (:location, :transferType, :productGroup, :createdYear, :deliveryNo, :stmDate, :factoryCode, :hdrShipQty, "
				+ ":hdrShipQty2, :hdrStmValue, :hdrCarrierName, :hdrCreatedBy, :hdrStmCreatedDate, :hdrStmCreatedTime, :hdrUpdatedBy, :hdrDocketNumber, :fileId, :hdrCarrierDetails, :hdrStockTransferType, :hdrCreatedDate) ";
		JdbcBatchItemWriter<StnStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<StnStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<StnStageDto> stnDtlStagingWriter() {

		String sql = "Insert into stn_dtl_stage(product_group, sl_no, stm_date, order_type, product_code, product_value1, product_qty, product_wt, "
				+ "product_value2, lot_number, actual_f1, diamond_wt, other_stone_wt, order_no, igst_perc, igst_val, sgst_perc, sgst_val, "
				+ "cgst_perc, cgst_val, utgst_perc, utgst_val, go_net_wt, pt_net_wt, stn_net_wt, si_net_wt, other_net_wt, file_id, bin_code, bin_group_code, tax_details,"
				+ " issued_weight_details, item_details, product_category, created_by, created_date) values "
				+ "(:productGroup, :dtlSlNo, :stmDate, :dtlOrderType, :dtlProductCode, :dtlProductValue1, :dtlProductQty, :dtlProductWt, :dtlProductValue2, "
				+ ":dtlLotNumber, :dtlActualF1, :dtlDiamondWt, :dtlOtherStoneWt, :dtlOrderNo, :dtlIgstPerc, :dtlIgstVal, :dtlSgstPerc, :dtlSgstVal, "
				+ ":dtlCgstPerc, :dtlCgstVal, :dtlUtgstPerc, :dtlUtgstVal, :dtlGoNetWt, :dtlPtNetWt, :dtlStnNetWt, :dtlSiNetWt, :dtlOtherNetWt, "
				+ " :fileId, :dtlBinCode, :dtlBinGroupCode, :dtlTaxDetails, :dtlIssuedWeightDetails, :dtlItemDetails, :dtlProductCategory, :dtlCreatedBy, :dtlCreatedDate)";
		JdbcBatchItemWriter<StnStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<StnStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<StnStageDto> stnLdtlStagingWriter() {

		String sql = "Insert into stn_ldtl_stage(line_count, line_dtl_count, item_no, stn_weight, stn_qty ,item_code ,lot_number ,file_id, created_by, created_date, insert_update)"
				+ " values (:ldtlLineCount, :ldtlLineDtlCount, :ldtlItemNo, :ldtlStnWeight, :ldtlStnQty, :itemCode, :lotNumber, :fileId, :ldtlCreatedBy, :ldtlCreatedDate, :insertUpdate)";
		JdbcBatchItemWriter<StnStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<StnStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<StnStageDto> stnMdtlStagingWriter() {

		String sql = "Insert into stn_mdtl_stage(line_count, line_dtl_count, item_no, stn_weight, stn_qty ,item_code ,lot_number ,file_id, created_by, created_date, insert_update)"
				+ " values (:mdtlLineCount, :mdtlLineDtlCount, :mdtlItemNo, :mdtlStnWeight, :mdtlStnQty, :itemCode, :lotNumber, :fileId, :mdtlCreatedBy, :mdtlCreatedDate, :insertUpdate)";
		JdbcBatchItemWriter<StnStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<StnStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
}
