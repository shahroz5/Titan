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
public class DebitNoteDbUpdateTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("debitNoteTransactionId");

		String distinctLocationsSql = "Select distinct(btq_code) from [file].dbo.debit_note_stage where file_id = '"
				+ fileId + "'";
		List<String> distinctLocations = jdbcTemplate.queryForList(distinctLocationsSql, String.class);
		
		// updating record id
		for (String location : distinctLocations) {
			String maxCountDnSql = "select COALESCE(max(record_id),0) from [file].dbo.debit_note_aud where btq_code='"+ location+ "'";
			Integer maxCountDn = jdbcTemplate.queryForObject(maxCountDnSql, Integer.class);
			if(maxCountDn==null || maxCountDn==0)
				maxCountDn = 1;
			String dnRecordIdSql = "DECLARE @id int SET @id = " + maxCountDn + "\r\n"
					+ "UPDATE [file].dbo.debit_note_stage SET @id = record_id  = @id + 1 where file_id ='" + fileId + "' and customer_name='"+location+"'";
			jdbcTemplate.execute(dnRecordIdSql);
			}
		
//		// updating record id
//		String recordIdSql = "DECLARE @id int \r\n" + "SET @id = 0 \r\n" + "UPDATE [file].dbo.debit_note_stage\r\n"
//				+ "SET @id = record_id  = @id + 1 \r\n" + "where file_id ='" + fileId + "'";
//		jdbcTemplate.execute(recordIdSql);

		// updating reference1 using row number and grouping by refernece column
		String reference1Sql = "With UpdateData  As\r\n" + "(\r\n"
				+ "SELECT reference1 ,record_id , row_number() OVER (PARTITION BY reference ORDER BY reference) GROUPSEQ \r\n"
				+ "FROM [file].dbo.debit_note_stage  where  file_id ='" + fileId + "'\r\n" + ")\r\n"
				+ "UPDATE [file].dbo.debit_note_stage  set reference1 = CONCAT(UpdateData.reference1 , GROUPSEQ) from [file].dbo.debit_note_stage dbns\r\n"
				+ "INNER JOIN UpdateData ON dbns.record_id = UpdateData.record_id  where  file_id ='" + fileId + "'";
		jdbcTemplate.execute(reference1Sql);

		return RepeatStatus.FINISHED;
	}

}
