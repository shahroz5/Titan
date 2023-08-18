/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.FirMerStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class FirMerJobWriter {

	@Bean()
	public ItemWriter<FirMerStageDto> firMerStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<FirMerStageDto> firMerWriter = new JdbcBatchItemWriter<>();
		firMerWriter.setDataSource(dataSource);
		firMerWriter.setSql(
				"Insert into fir_mer_stage(type,item_code,lot_number,unitweight, quantity,initiated_location_code,source_location_code\r\n"
						+ ",destination_location_code,fiscal_year,file_id,mfg_date,total_value,std_weight,std_value,total_quantity\r\n"
						+ ",bin_group_code,bin_code,inventory_id,created_by,created_date,last_modified_by,last_modified_date,product_category,product_group) values (:type, :itemCode, :lotNumber, :unitWeight, :quantity, :initiatedLocationCode,"
						+ " :sourceLocationCode, :destinationLocationCode, :fiscalYear, :fileId, :mfgDate, :totalValue, :stdWeight, :stdValue, :totalQuantity,"
						+ " :binGroupCode, :binCode, :inventoryId,:createdBy,:createdDate, :lastModifiedBy, :lastModifiedDate,:productCategory,:productGroup)");
		firMerWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<FirMerStageDto>());
		firMerWriter.afterPropertiesSet();
		return firMerWriter;
	}

}
