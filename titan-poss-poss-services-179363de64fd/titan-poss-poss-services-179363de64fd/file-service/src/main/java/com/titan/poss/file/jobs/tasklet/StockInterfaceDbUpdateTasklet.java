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
public class StockInterfaceDbUpdateTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("stockInterfaceTransactionId");

		
		// updating shipment_ref
		String distinctLocationsSql = "Select distinct(btq_code) from [file].dbo.stock_interface_stage where file_id = '"
				+ fileId + "'";
		List<String> distinctLocations = jdbcTemplate.queryForList(distinctLocationsSql, String.class);
		for (String location : distinctLocations) {
			String maxCountSql = "select COALESCE(max(record_id),0) from [file].dbo.stock_interface_aud where btq_code ='"
					+ location + "'";
			Integer maxCount = jdbcTemplate.queryForObject(maxCountSql, Integer.class);
			String attribute4Sql = "DECLARE @id int SET @id = " + maxCount + "\r\n"
					+ "UPDATE [file].dbo.stock_interface_stage SET @id = record_id  = @id + 1 where file_id ='" + fileId
					+ "' and btq_code ='" + location + "'";
			jdbcTemplate.execute(attribute4Sql);
		}
		
		// updating Attribute1 (record id)
				String recordIdSql = "With UpdateData  As\r\n" + 
						"(SELECT stm_number ,item_no ,lot_no,record_id ,ROW_NUMBER() OVER(PARTITION BY stm_number ORDER BY stm_number) AS RowNum FROM [file].dbo.stock_interface_stage sis \r\n" + 
						" where file_id = '" + fileId + "')\r\n" + 
						"UPDATE [file].dbo.stock_interface_stage  set attribute1 = RowNum from [file].dbo.stock_interface_stage sis\r\n" + 
						"INNER JOIN UpdateData ON sis.record_id = UpdateData.record_id\r\n" + 
						"and sis.item_no =UpdateData.item_no and sis.lot_no = UpdateData.lot_no where file_id = '" + fileId + "'";
				jdbcTemplate.execute(recordIdSql);

		
		return RepeatStatus.FINISHED;
	}

}
