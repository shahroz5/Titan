/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class ItemStoneMappingIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final String DELETE_DATA_FROM_ITEM_STONE_MAPPING_QUERY = "DELETE FROM products.dbo.item_stone_mapping where item_code IN (SELECT item_code FROM item_stone_mapping_stage GROUP BY item_code);";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("itemStoneMappingFileAuditId");

		log.info("Before ItemStoneMappingIngestionTasklet");
		String itemStoneMappingInsertSql = "Insert into products.dbo.item_stone_mapping (id, item_code, no_of_stones, stone_code, is_active,"
				+ "created_by, created_date, last_modified_by, last_modified_date,src_sync_id, dest_sync_id, correlation_id) SELECT id, item_code, no_of_stones, stone_code, is_active,login_id, created_date, last_modified_id, last_modified_date, 0, 0, file_audit_id FROM item_stone_mapping_stage where file_audit_id = '"
				+ fileAuditId + "'";
	
		jdbcTemplate.execute(DELETE_DATA_FROM_ITEM_STONE_MAPPING_QUERY);
		jdbcTemplate.execute(itemStoneMappingInsertSql);
		log.info("After ItemStoneMappingIngestionTasklet");
		return RepeatStatus.FINISHED;
	}

}
