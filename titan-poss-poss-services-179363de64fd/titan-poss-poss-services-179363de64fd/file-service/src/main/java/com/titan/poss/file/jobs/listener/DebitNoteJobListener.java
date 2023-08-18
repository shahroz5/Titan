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
public class DebitNoteJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Debit Note job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("debitNoteTransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("fileName", fileName);

	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileId = jobExecution.getExecutionContext().getString("debitNoteTransactionId");

		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT customer_name as location_code, max(trx_date) as business_date from [file].dbo.debit_note_stage"
					+ " where file_id ='" + fileId + "' and customer_name in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue() + "')) group by customer_name;";

			String locationCodeAndBusinessDateInsertSql = "SELECT customer_name as location_code ,max(trx_date) as business_date from [file].dbo.debit_note_stage "
					+ "where file_id = '" + fileId + "' and customer_name not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue() + "')) group by customer_name;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue(), fileId);

			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}
		String moveDataSql = "INSERT into debit_note_aud select * from debit_note_stage where file_id = '" + fileId
				+ "'";
		jdbcTemplate.execute(moveDataSql);
		String removeDataSql = "DELETE from debit_note_stage where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);

		log.debug("Debit Note data has been moved to the audit table");
		log.info("Debit Note job has ended at: {}", CalendarUtils.getCurrentDate());
	}

}
