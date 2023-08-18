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
import org.springframework.stereotype.Component;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PriceMasterIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("priceMasterFileAuditId");
		// @formatter:off
		String updateStatusOfInsertFlowRecords = "update price_master_stage set transfer_type = 'INSERT' where  file_audit_id = '" + fileAuditId + "' and \r\n" + 
				"item_code not in  (select item_code from products.dbo.item_master im )";
		
		String priceMasterInsertSql = "insert into products.dbo.price_master(id, item_code,price_group, making_charge, is_active, created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id)\r\n" + 
				"SELECT id, item_code, price_group, making_charges, 'true', login_id,created_date,last_modified_id,\r\n" + 
				"last_modified_date, 0, 0, file_audit_id FROM price_master_stage\r\n" + 
				"where file_audit_id = '" + fileAuditId + "' AND transfer_type = 'INSERT'";
		
		String priceMasterUpdateSql ="update products.dbo.price_master \r\n" + 
				"set id=t2.id,item_code=t2.item_code,price_group=t2.price_group,making_charge=t2.making_charges,is_active='true',created_by=t2.login_id,created_date=t2.created_date,last_modified_by=t2.last_modified_id,\r\n" + 
				"last_modified_date=t2.last_modified_date,src_sync_id=(t1.src_sync_id+1),dest_sync_id='0',correlation_id=t2.file_audit_id\r\n" + 
				"from products.dbo.price_master t1\r\n" + 
				"inner join price_master_stage t2\r\n" + 
				"on t1.item_code = t2.item_code and t1.price_group = t2.price_group where t2.file_audit_id = '" + fileAuditId + "' and t2.transfer_type = 'UPDATE'";
		jdbcTemplate.execute(updateStatusOfInsertFlowRecords);
		jdbcTemplate.execute(priceMasterInsertSql);
		jdbcTemplate.execute(priceMasterUpdateSql);

		return RepeatStatus.FINISHED;
	}

}
