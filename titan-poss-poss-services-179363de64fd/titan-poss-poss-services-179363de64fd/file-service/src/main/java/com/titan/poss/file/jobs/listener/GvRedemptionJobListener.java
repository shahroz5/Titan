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
import com.titan.poss.file.service.FileService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class GvRedemptionJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("GV Redemption job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		fileName = fileService.getGvRedemptionFileName(FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("gvRedemptionTransactionId", savedFileAuditDto.getFileId());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileId = jobExecution.getExecutionContext().getString("gvRedemptionTransactionId");
		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim());
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT location_code ,max(date_and_time) as business_date from [file].dbo.gv_redemption_stage grs where file_id = '"
					+ fileId + "' and location_code in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue() + "')) group by location_code;";

			String locationCodeAndBusinessDateInsertSql = "SELECT location_code ,max(date_and_time) as business_date from [file].dbo.gv_redemption_stage grs where file_id = '"
					+ fileId + "' and location_code not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue() + "')) group by location_code;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.GV_REDEMPTION_JOB.getValue(), fileId);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}
		String moveDataSql = "INSERT into gv_redemption_aud select * from gv_redemption_stage where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveDataSql);
		String removeDataSql = "DELETE from gv_redemption_stage where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);
		log.debug("Gv Redemption data has been moved to the audit table");
		log.info("GV Redemption job has ended at: {}", CalendarUtils.getCurrentDate());
	}

}
