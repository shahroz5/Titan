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
public class GiftVoucherIndentIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("giftVoucherIndentSavedId");

		String giftMasterInsertSql = "Insert into payments.dbo.gift_master (gift_code, serial_no, region_code, denomination, quantity, total_value, status, mfg_date, location_code, remarks, excludes, validity_days, indent_no, gift_details, created_by, created_date, last_modified_by, last_modified_date, correlation_id) SELECT item_code, gv_serial_no, region, denomination, quantity, total_value, transition_status , gv_creation_date, location_code, remarks, excludes, validity_days, indent_no, gift_details, created_by, created_date, last_modified_by, last_modified_date, file_audit_id FROM gift_voucher_indent_stage where file_audit_id = '"
				+ fileAuditId + "'";

		jdbcTemplate.execute(giftMasterInsertSql);
		return RepeatStatus.FINISHED;
	}

}
