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
public class GiftVoucherStatusIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("giftVoucherStatusSavedId");

		String giftMasterUpdateSql = "update payments.dbo.gift_master set status = gv.transition_status, activation_date = gv.act_blocked_date , valid_from=gv.valid_from , \r\n"
				+ "valid_till=gv.valid_till , validity_days=gv.validity_days , last_modified_by=gv.last_modified_by , last_modified_date = gv.last_modified_date \r\n"
				+ "from payments.dbo.gift_master gm\r\n"
				+ "inner join [file].dbo.gift_voucher_status_stage gv on gm.serial_no = gv.gv_serial_no \r\n"
				+ "where gv.file_audit_id ='" + fileAuditId + "'";
		jdbcTemplate.execute(giftMasterUpdateSql);
		return RepeatStatus.FINISHED;
	}

}
