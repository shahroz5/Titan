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

@Slf4j
@Component
public class DebitNoteL3JobListener implements JobExecutionListener {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Debit Note L3 job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("debitNoteL3TransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("fileName", fileName);

	}
	
	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileId = jobExecution.getExecutionContext().getString("debitNoteL3TransactionId");

		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT customer_name as location_code, max(trx_date) as business_date from [file].dbo.debitnote_level_three_stage" 
					+ " where file_id ='" + fileId + "' and customer_name in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue() + "')) group by customer_name;";

			String locationCodeAndBusinessDateInsertSql = "SELECT customer_name as location_code ,max(trx_date) as business_date from [file].dbo.debitnote_level_three_stage "
					+ "where file_id = '" + fileId + "' and customer_name not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue() + "')) group by customer_name;"; 

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue(), fileId);

			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}
		String moveDataSql = "INSERT into debitnote_level_three_aud select * from debitnote_level_three_stage where file_id = '" + fileId 
				+ "'";
		jdbcTemplate.execute(moveDataSql);
		String removeDataSql = "DELETE from debitnote_level_three_stage where file_id = '" + fileId + "'"; 
		jdbcTemplate.execute(removeDataSql);

		log.debug("Debit Note L3 data has been moved to the audit table");
		log.info("Debit Note L3 job has ended at: {}", CalendarUtils.getCurrentDate());
	}

}
