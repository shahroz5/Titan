/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class BoutiqueSalesDbUpdateTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("boutiqueSalesTransactionId");
		
		String distinctLocationsSql = "Select distinct(location_id) from [file].dbo.boutique_sales_tax_stage where file_id = '"
				+ fileId + "'";

		List<String> distinctLocations = jdbcTemplate.queryForList(distinctLocationsSql, String.class);

		
		//commenting this as item_attribute4 of HDR logic is as above query in legacy
//		// updating Attribute4 (record id) 
//		String recordIdSql = "With UpdateData  As\r\n"
//				+ "(SELECT sys_document_ref,ROW_NUMBER() OVER( ORDER BY sys_document_ref ) AS RowNum FROM [file].dbo.boutique_sales_hdr_stage"
//				+ " where file_id = '" + fileId + "')\r\n"
//				+ "UPDATE [file].dbo.boutique_sales_hdr_stage  set item_attribute4 = RowNum from [file].dbo.boutique_sales_hdr_stage\r\n"
//				+ "INNER JOIN UpdateData ON [file].dbo.boutique_sales_hdr_stage.sys_document_ref = UpdateData.sys_document_ref where file_id = '"
//				+ fileId + "'";
//		jdbcTemplate.execute(recordIdSql);
		

		//item_attribute4 (record id of HDR) update
		for (String location : distinctLocations) {
		String maxCountHdrSql = "select COALESCE(max(item_attribute4),0) from [file].dbo.boutique_sales_hdr_aud where customer_name='"+ location+ "'";
		Integer maxCountHdr = jdbcTemplate.queryForObject(maxCountHdrSql, Integer.class);
		if(maxCountHdr==null || maxCountHdr==0)
			maxCountHdr = 0;
		String hdrRecordIdSql = "DECLARE @id int SET @id = " + maxCountHdr + "\r\n"
				+ "UPDATE [file].dbo.boutique_sales_hdr_stage SET @id = item_attribute4  = @id + 1 where file_id ='" + fileId + "' and customer_name='"+location+"'";
		jdbcTemplate.execute(hdrRecordIdSql);
		}

//		// updating shipment_ref
//		String shipmentRefSql = " DECLARE @id int SET @id = 0\r\n"
//				+ "UPDATE [file].dbo.boutique_sales_det_stage SET @id = shipment_ref  = @id + 1 where file_id = '"
//				+ fileId + "'";
//		jdbcTemplate.execute(shipmentRefSql);
		
		for (String location : distinctLocations) {
			String maxCountShipmentRefSql = "select COALESCE(max(shipment_ref),0) from [file].dbo.boutique_sales_det_aud where item_attribute_13='"+ location+ "'";
			Integer maxCountShipmentRef = jdbcTemplate.queryForObject(maxCountShipmentRefSql, Integer.class);
			if(maxCountShipmentRef==null || maxCountShipmentRef==0)
				maxCountShipmentRef = 0;
			String shipmentRefSql = "DECLARE @id int SET @id = " + maxCountShipmentRef + "\r\n"
					+ "UPDATE [file].dbo.boutique_sales_det_stage SET @id = shipment_ref  = @id + 1 where file_id ='" + fileId + "' and item_attribute_13='"+location+"'";
			jdbcTemplate.execute(shipmentRefSql);
			}

		// updating item attribute 12
//		String itemAttribute12Sql = "DECLARE @id int\r\n" + "SET @id = 0\r\n"
//				+ "UPDATE [file].dbo.boutique_sales_det_stage SET @id = item_attribute_12  = @id + 1 where file_id = '"
//				+ fileId + "'";
//		jdbcTemplate.execute(itemAttribute12Sql);
		
		for (String location : distinctLocations) {
			String maxCountItemAttribute12Sql = "select COALESCE(max(item_attribute_12),0) from [file].dbo.boutique_sales_det_aud where item_attribute_13='"+ location+ "'";
			Integer maxCountItemAttribute12 = jdbcTemplate.queryForObject(maxCountItemAttribute12Sql, Integer.class);
			if(maxCountItemAttribute12==null || maxCountItemAttribute12==0)
				maxCountItemAttribute12 = 0;
			String itemAttribute12Sql = "DECLARE @id int SET @id = " + maxCountItemAttribute12 + "\r\n"
					+ "UPDATE [file].dbo.boutique_sales_det_stage SET @id = item_attribute_12  = @id + 1 where file_id ='" + fileId + "' and item_attribute_13='"+location+"'";
			jdbcTemplate.execute(itemAttribute12Sql);
			}

		
		
		
//		String distinctBusinessDateSql = "Select distinct(business_date) from [file].dbo.boutique_sales_tax_stage where file_id = '"
//				+ fileId + "'";
//		List<String> distinctBusinessDate = jdbcTemplate.queryForList(distinctBusinessDateSql, String.class);
		
		// updating record id of tax section
		for (String location : distinctLocations) {
			
			
			String maxCountSql = "select COALESCE(max(record_id),0) from [file].dbo.boutique_sales_tax_aud where location_id='"+ location+ "'";
			Integer maxCount = jdbcTemplate.queryForObject(maxCountSql, Integer.class);
			String taxRecordIdSql = "DECLARE @id int SET @id = " + maxCount + "\r\n"
					+ "UPDATE [file].dbo.boutique_sales_tax_stage SET @id = record_id  = @id + 1 where file_id ='" + fileId + "' and location_id='"+location+"'";
			jdbcTemplate.execute(taxRecordIdSql);
			
		}
		
//		//updating line no.
//		for (String location : distinctLocations) {
//			
//			for(String date : distinctBusinessDate )
//			{
//			String lineNoSql = 	"With UpdateData  As (\r\n"
//					+ "SELECT record_id, business_date,sys_document_ref,inventory_item, lot_number,location_id, \r\n"
//					+ "Dense_rank()OVER(PARTITION BY sys_document_ref ORDER BY business_date,sys_document_ref,inventory_item, lot_number,location_id) as ref_line_no \r\n"
//					+ "FROM   [file].dbo.boutique_sales_tax_stage bsds where bsds.business_date='"+date+"' and bsds.location_id='" +location+"' ) \r\n"
//					+ "UPDATE [file].dbo.boutique_sales_tax_stage  set line_no = ref_line_no from [file].dbo.boutique_sales_tax_stage bs\r\n"
//					+ "INNER JOIN UpdateData ON bs.record_id = UpdateData.record_id  where file_id = '" + fileId +"' and bs.location_id='" +location+"'" ;
//					
//			jdbcTemplate.execute(lineNoSql);
//			}
//		}

		// updating tax line no
		String taxLineNoSql = "With UpdateData  As (\r\n"
				+ "SELECT record_id , row_number() OVER (PARTITION BY line_no,sys_document_ref ORDER BY line_no ,sys_document_ref) GROUPSEQ \r\n"
				+ "FROM [file].dbo.boutique_sales_tax_stage bsds \r\n" + ")\r\n"
				+ "UPDATE [file].dbo.boutique_sales_tax_stage  set tax_line_no =  GROUPSEQ from [file].dbo.boutique_sales_tax_stage bs\r\n"
				+ "INNER JOIN UpdateData ON bs.record_id = UpdateData.record_id  where file_id = '" + fileId + "'";
		jdbcTemplate.execute(taxLineNoSql);

		return RepeatStatus.FINISHED;
	}

}
