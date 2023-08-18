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
public class BoutiqueRevenueDbUpdateTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("boutiqueRevenueTransactionId");
		String distinctLocationsSql = "Select distinct(attribute3) from [file].dbo.boutique_revenue_stage where file_id = '"
				+ fileId + "'";

		List<String> distinctLocations = jdbcTemplate.queryForList(distinctLocationsSql, String.class);
		
		// updating Attribute5 (recordId = Attribute5)
		for (String location : distinctLocations) {
			String maxCountSql = "select COALESCE(max(attribute5),0) from [file].dbo.boutique_revenue_aud  where attribute3 ='"
					+ location + "'";
			Integer maxCount = jdbcTemplate.queryForObject(maxCountSql, Integer.class);
			String recordIdSql = "DECLARE @id int SET @id = " + maxCount + "\r\n"
					+ ";with q as ( Select Top 10000 * FROM [file].dbo.boutique_revenue_stage WHERE file_id='" + fileId + "' and attribute3 ='" + location + "' Order by attribute7 ASC) "
					+ "Update q SET @id = attribute5 = @id+1";
				    //+ "UPDATE [file].dbo.boutique_revenue_stage SET @id = attribute5  = @id + 1 where file_id ='" + fileId
				//	+ "' and attribute3 ='" + location + "'";
			jdbcTemplate.execute(recordIdSql);
		}
		
		/*// updating Attribute5 (record id)
		String recordIdSql = "With UpdateData  As (SELECT receipt_no,ROW_NUMBER() OVER(\r\n"
				+ " ORDER BY receipt_no ) AS RowNum\r\n" + "FROM [file].dbo.boutique_revenue_stage brs where file_id ='"
				+ fileId + "')\r\n"
				+ "UPDATE [file].dbo.boutique_revenue_stage  set attribute5 = RowNum from [file].dbo.boutique_revenue_stage\r\n"
				+ "INNER JOIN UpdateData ON [file].dbo.boutique_revenue_stage.receipt_no = UpdateData.receipt_no where [file].dbo.boutique_revenue_stage.file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(recordIdSql);*/

		return RepeatStatus.FINISHED;
	}

}
