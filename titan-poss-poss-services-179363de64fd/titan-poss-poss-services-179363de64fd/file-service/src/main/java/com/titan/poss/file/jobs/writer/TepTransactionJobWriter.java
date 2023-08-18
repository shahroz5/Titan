/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.TepTransactionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class TepTransactionJobWriter {

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<TepTransactionDto> tepTransactionStagingWriter(
			@Value("#{jobExecutionContext['tepTransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {
		String tepTransactionFileName = fileName.substring(0, fileName.indexOf('.'));
		String stockInterfaceStageInsertQuery = "INSERT into tep_transaction_stage (rec_type,line_num,doc_type,item,qty,sec_qty,unit_price,vendor_name,site_name,ship_to,bill_to,item_attribute,item_attribute1,item_attribute2,item_attribute3,item_attribute4,\r\n"
				+ "item_attribute5,item_attribute6,item_attribute7,item_attribute8,item_attribute9,item_attribute10,item_attribute11,item_attribute12,item_attribute13,record_id,btq_id,business_date,\r\n"
				+ "igst_percentage,igst_value,sgst_percentage,sgst_value,cgst_percentage,cgst_value,utgst_percentage,utgst_value,file_name,file_id,goods_exchange_id,doc_date)\r\n"
				+ "values (:recType,:lineNum,:docType,:item,:qty,:secQty,:unitPrice,:vendorName,:siteName,:shipTo,:billTo,:itemAttribute,:itemAttribute1,:itemAttribute2,\r\n"
				+ ":itemAttribute3,:itemAttribute4,:itemAttribute5,:itemAttribute6,:itemAttribute7,:itemAttribute8,:itemAttribute9,:itemAttribute10,:itemAttribute11,:itemAttribute12,\r\n"
				+ ":itemAttribute13,:recordId,:btqId,:businessDate,:igstPercentage,:igstValue,:sgstPercentage,:sgstValue,:cgstPercentage,:cgstValue,:utgstPercentage,:utgstValue,'"
				+ tepTransactionFileName + "','" + fileId + "',:goodsExchangeId,:docDate)";
		JdbcBatchItemWriter<TepTransactionDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(stockInterfaceStageInsertQuery);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<TepTransactionDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
}
