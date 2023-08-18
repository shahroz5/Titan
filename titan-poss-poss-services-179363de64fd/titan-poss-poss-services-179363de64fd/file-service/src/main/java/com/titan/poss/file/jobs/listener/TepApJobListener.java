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
public class TepApJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Tep Ap job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.TEP_AP_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("tepApTransactionId", savedFileAuditDto.getFileId());
//		fileName = fileService.getOutBoundFileName(FileMasterJobNameEnum.TEP_AP_JOB.getValue(),
//				FileGroupEnum.ORACLE.toString());
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.TEP_AP_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		jobExecution.getExecutionContext().put("fileName", fileName);
	}

	@Override
	public void afterJob(JobExecution jobExecution) {

		String fileId = jobExecution.getExecutionContext().getString("tepApTransactionId");
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG,
					FileGroupEnum.ORACLE.toString(), false, sequenceNo, null);
			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT location_code, max(business_date) as business_date from [file].dbo.tep_ap_header_stage"
					+ " where file_id ='" + fileId + "' and location_code in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.TEP_AP_JOB.getValue() + "')) group by location_code;";

			String locationCodeAndBusinessDateInsertSql = "SELECT location_code ,max(business_date) as business_date from [file].dbo.tep_ap_header_stage "
					+ "where file_id = '" + fileId + "' and location_code not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.TEP_AP_JOB.getValue() + "')) group by location_code;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.TEP_AP_JOB.getValue(), fileId);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.TEP_AP.toString(), FileIntegrationConstants.FAILURE_MSG,
					FileGroupEnum.ORACLE.toString(), false, null, null);
		}

		moveData("tep_ap_header_stage", "tep_ap_header_aud", fileId);
		moveData("tep_ap_details_stage", "tep_ap_details_aud", fileId);

		log.debug("Tep Ap data has been moved to the audit table");

	}

	private void moveData(String sourceTable, String destTable, String fileId) {
		String moveHdrDataSql = "INSERT into " + destTable + " select * from " + sourceTable + " where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveHdrDataSql);
		String removeDataSql = "DELETE from " + sourceTable + " where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);
	}

}
