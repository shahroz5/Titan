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
public class StockInterfaceJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Stock Interface job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("stockInterfaceTransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("fileName", fileName);
		
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileId = jobExecution.getExecutionContext().getString("stockInterfaceTransactionId");

		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT btq_code as location_code, max(business_date2) as business_date from [file].dbo.stock_interface_stage"
					+ " where file_id ='" + fileId + "' and btq_code in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue() + "')) group by btq_code;";

			String locationCodeAndBusinessDateInsertSql = "SELECT btq_code as location_code ,max(business_date2) as business_date from [file].dbo.stock_interface_stage "
					+ "where file_id = '" + fileId + "' and btq_code not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue() + "')) group by btq_code;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.STOCK_INTERFACE_JOB.getValue(),
					fileId);

		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}
		String moveDataSql = "INSERT into stock_interface_aud select * from stock_interface_stage where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveDataSql);
		String removeDataSql = "DELETE from stock_interface_stage where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);
		log.debug("Stock interface data has been moved to the audit table");
		log.info("Stock interface job has ended at: {}", CalendarUtils.getCurrentDate());
	}

}
