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
public class GeneralLedgerDbUpdateTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getStepExecution().getJobExecution()
				.getExecutionContext().get("generalLedgerTransactionId");

		// updating attribute4/max record count by taking the max count for that
		// location from general_ledger_stage_aud table

		String distinctLocationsSql = "Select distinct(attribute3) from [file].dbo.general_ledger_stage where file_id = '"
				+ fileId + "'";
		List<String> distinctLocations = jdbcTemplate.queryForList(distinctLocationsSql, String.class);
		for (String location : distinctLocations) {
			String maxCountSql = "select COALESCE(max(attribute4),0) from [file].dbo.general_ledger_stage_aud glsa where attribute3 ='"
					+ location + "'";
			Integer maxCount = jdbcTemplate.queryForObject(maxCountSql, Integer.class);
			String attribute4Sql = "DECLARE @id int SET @id = " + maxCount + "\r\n"
					+ "UPDATE [file].dbo.general_ledger_stage SET @id = attribute4  = @id + 1 where file_id ='" + fileId
					+ "' and attribute3 ='" + location + "'";
			jdbcTemplate.execute(attribute4Sql);
		}

		// updating je_line_num
		String jeLineNumSql = "With UpdateData  As (\r\n"
				+ "SELECT attribute3 ,attribute4, file_id ,row_number() OVER (PARTITION BY attribute3, attribute1 ORDER BY attribute3, attribute1 ) GROUPSEQ \r\n"
				+ "FROM [file].dbo.general_ledger_stage gl where file_id = '" + fileId + "'\r\n" + ")\r\n"
				+ "UPDATE [file].dbo.general_ledger_stage  set je_line_num =  GROUPSEQ from [file].dbo.general_ledger_stage gl\r\n"
				+ "INNER JOIN UpdateData ON gl.attribute3 = UpdateData.attribute3 and gl.attribute4 = UpdateData.attribute4 where gl.file_id = '"
				+ fileId + "';";
		jdbcTemplate.execute(jeLineNumSql);

		return RepeatStatus.FINISHED;
	}

}
