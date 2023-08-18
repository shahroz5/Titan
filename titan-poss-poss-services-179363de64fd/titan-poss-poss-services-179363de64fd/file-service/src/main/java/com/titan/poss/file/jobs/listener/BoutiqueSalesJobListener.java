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
public class BoutiqueSalesJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String fileName;

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Boutique Sales job has started at: {}", CalendarUtils.getCurrentDate());
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "false");
		fileName = fileService.getCommonOracleFileName(FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue(),
				FileGroupEnum.ORACLE.toString());
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName,
				FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue(), FileGroupEnum.ORACLE.toString(), manualJob, null,
				FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("boutiqueSalesTransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("fileName", fileName);
	}

	@Override
	public void afterJob(JobExecution jobExecution) {

		String fileId = jobExecution.getExecutionContext().getString("boutiqueSalesTransactionId");
		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(2));
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.EXPORT_SUCCESS_MSG, null, false,
					sequenceNo, null);

			// updating file_master_location_mapping table
			String locationCodeAndBusinessDateUpdateSql = "SELECT customer_name as location_code, max(item_attribute6) as business_date from [file].dbo.boutique_sales_hdr_stage"
					+ " where file_id ='" + fileId + "' and customer_name in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue() + "')) group by customer_name;";

			String locationCodeAndBusinessDateInsertSql = "SELECT customer_name as location_code ,max(item_attribute6) as business_date from [file].dbo.boutique_sales_hdr_stage "
					+ "where file_id = '" + fileId + "' and customer_name not in (select DISTINCT location_code \r\n"
					+ "from [file].dbo.file_master_location_mapping \r\n"
					+ "where file_master_id =(select id from [file].dbo.file_master where file_name ='"
					+ FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue() + "')) group by customer_name;";

			fileService.updateFileMasterLocationMapping(locationCodeAndBusinessDateUpdateSql,
					locationCodeAndBusinessDateInsertSql, FileMasterJobNameEnum.BOUTIQUE_SALES_JOB.getValue(), fileId);
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG, null, false, sequenceNo,
					null);
		}

		moveData("boutique_sales_hdr_stage", "boutique_sales_hdr_aud", fileId);
		moveData("boutique_sales_det_stage", "boutique_sales_det_aud", fileId);
		moveData("boutique_sales_tax_stage", "boutique_sales_tax_aud", fileId);

		log.debug("Boutique Sales data has been moved to the audit table");
		log.info("Boutique Sales job has ended at: {}", CalendarUtils.getCurrentDate());
	}

	private void moveData(String sourceTable, String destTable, String fileId) {
		String moveHdrDataSql = "INSERT into " + destTable + " select * from " + sourceTable + " where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveHdrDataSql);
		String removeDataSql = "DELETE from " + sourceTable + " where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);
	}

}
