/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileSequenceService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class StnIbtJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileSequenceService fileSequenceService;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Stn Ibt job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(null,
				FileMasterJobNameEnum.IBT_STN_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("ibtStnTransactionId", savedFileAuditDto.getFileId());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {

		String fileId = jobExecution.getExecutionContext().getString("ibtStnTransactionId");
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false, null,
					null);
			fileSequenceService.updateFileSequenceByGroupAndName(FileGroupEnum.ORACLE.toString(),
					FileMasterJobNameEnum.IBT_STN_JOB.getValue(), null);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.STN_IBT.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, null, null);
		}
		jdbcTemplate.execute("DELETE from stn_hdr_stage where file_id = '" + fileId + "'");
		jdbcTemplate.execute("DELETE from stn_dtl_stage where file_id = '" + fileId + "'");
		jdbcTemplate.execute("DELETE from stn_ldtl_stage where file_id = '" + fileId + "'");
		jdbcTemplate.execute("DELETE from stn_mdtl_stage where file_id = '" + fileId + "'");
	}

}
