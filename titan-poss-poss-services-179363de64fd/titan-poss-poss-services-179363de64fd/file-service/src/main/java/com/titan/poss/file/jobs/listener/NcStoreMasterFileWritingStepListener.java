/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileAuditService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class NcStoreMasterFileWritingStepListener implements StepExecutionListener {

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final String MOVE_STORE_DATA_TO_AUDIT = "INSERT into ulp_store_master_aud select * from ulp_store_master_stage where file_audit_id = '";

	private static final String STORE_MASTER_TRUNCATE_SQL = "DELETE from ulp_store_master_stage where file_audit_id = '";

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// Default implementation Ignored

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		String fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("NcStoreMasterSavedId");
		String sequenceNoString = stepExecution.getJobExecution().getExecutionContext().getString("sequenceNo");
		Integer sequenceNo = Integer.parseInt(sequenceNoString);
		BatchStatus status = stepExecution.getStatus();
		if (status.toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.NETCARROTS.toString(),
					FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false, sequenceNo, null);
			jdbcTemplate.execute(MOVE_STORE_DATA_TO_AUDIT + fileAuditId + "'");
			log.debug("store master stage data moved to audit table");
			jdbcTemplate.execute(STORE_MASTER_TRUNCATE_SQL + fileAuditId + "'");
			log.debug("store master stage table truncated succesfully");
		} else {
			fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.NETCARROTS.toString(),
					FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo, null);
		}
		log.debug("NcStore Master job is completed at " + CalendarUtils.getCurrentDate());
		return ExitStatus.COMPLETED;
	}

}
