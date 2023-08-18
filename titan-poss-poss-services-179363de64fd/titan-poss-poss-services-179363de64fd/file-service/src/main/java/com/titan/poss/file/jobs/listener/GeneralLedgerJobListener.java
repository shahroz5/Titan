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
import com.titan.poss.location.dao.CountryDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class GeneralLedgerJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("General Ledger job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
//		fileName = fileService.getOutBoundFileName(FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue(),
//				FileGroupEnum.ORACLE.toString());
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("generalLedgerTransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("fileName", fileName);
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		jobExecution.getExecutionContext().put("currencyCode", currencyCode);

	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileId = jobExecution.getExecutionContext().getString("generalLedgerTransactionId");

		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT attribute3 as location_code, max(attribute1) as business_date from [file].dbo.general_ledger_stage"
					+ " where file_id ='" + fileId + "' and attribute3 in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue() + "')) group by attribute3;";

			String locationCodeAndBusinessDateInsertSql = "SELECT attribute3 as location_code ,max(attribute1) as business_date from [file].dbo.general_ledger_stage "
					+ "where file_id = '" + fileId + "' and attribute3 not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue() + "')) group by attribute3;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.GENERAL_LEDGER_JOB.getValue(), fileId);

		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}
		String moveDataSql = "INSERT into general_ledger_stage_aud select * from general_ledger_stage where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveDataSql);
		String removeDataSql = "DELETE from general_ledger_stage where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);

		log.debug("General Ledger data has been moved to the audit table");
		log.info("General Ledger job has ended at: {}", CalendarUtils.getCurrentDate());
	}

}