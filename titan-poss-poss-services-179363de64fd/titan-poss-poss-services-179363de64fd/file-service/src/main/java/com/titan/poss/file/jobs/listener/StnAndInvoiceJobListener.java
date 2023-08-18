/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.FileAuditDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.util.FileServiceUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class StnAndInvoiceJobListener implements JobExecutionListener {

	private static final String FALSE = "false";

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Environment env;

	private String sourceFilePath;

	private String successFilePath;

	private String failureFilePath;

	private String jobName;

	private String jobFileName;

	private String fileAuditIdName;

	public StnAndInvoiceJobListener() {

	}

	public StnAndInvoiceJobListener(String sourceFilePath, String successFilePath, String failureFilePath,
			String jobName, String jobFileName, String fileAuditIdName) {

		this.sourceFilePath = sourceFilePath;
		this.successFilePath = successFilePath;
		this.failureFilePath = failureFilePath;
		this.jobName = jobName;
		this.jobFileName = jobFileName;
		this.fileAuditIdName = fileAuditIdName;
	}

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info(jobName + " has started at: {}", CalendarUtils.getCurrentDate());
		String fileName = jobExecution.getJobParameters().getString(jobFileName);
		String srcFolder = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(sourceFilePath)
				+ fileName;
		String manualJob = jobExecution.getJobParameters().getString("manualJob", FALSE);
		int totalCount = FileServiceUtil.getTotalCount(srcFolder);
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName, jobName,
				FileGroupEnum.ORACLE.toString(), manualJob, totalCount, FileIntegrationConstants.ERP_USER, srcFolder);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put(fileAuditIdName, savedFileAuditDto.getFileId());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		log.info("--------------invoiceStn-----------"+jobExecution.toString());
		String fileAuditId = jobExecution.getExecutionContext().getString(fileAuditIdName);
		String fileName = jobExecution.getJobParameters().getString(jobFileName);
		Integer sequenceNo = null;
		String errorMsg = "";
		if (jobName.equalsIgnoreCase("Invoice")) {
			String sequenceNoString = fileName.replaceAll("[^0-9]", "");
			sequenceNo = Integer.parseInt(sequenceNoString.substring(2, sequenceNoString.length()));
			errorMsg = "Invoice already present in stock invoice table";
		} else {
			if(Boolean.valueOf(jobExecution.getJobParameters().getString("ibt"))) {
				String stn =  fileName.replaceAll("[^0-9]", "");
				String fiscalyear = stn.substring(stn.length()-4);
				stn = stn.replace(fiscalyear, "");
				sequenceNo = Integer.parseInt(stn);
			}
			else {
				sequenceNo = Integer.parseInt(fileName.replaceAll("[^0-9]", ""));
			}
			log.info("-----------------file seq no------------------"+sequenceNo);
			errorMsg = "Stn already present in stock transfer table";
		}
		log.info("--------file status of invoice---------"+jobExecution.getStatus());
		String fileBaseFolder = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String sourceFolder = fileBaseFolder + env.getProperty(sourceFilePath) + fileName;
		String successFolder = fileBaseFolder + env.getProperty(successFilePath) + fileName;
		String failurePath = fileBaseFolder + env.getProperty(failureFilePath) + fileName;

		BatchStatus status = jobExecution.getStatus();
		if (status.toString().equalsIgnoreCase("COMPLETED")) {
			String validationFailed = jobExecution.getExecutionContext().getString("validationFailed", FALSE);
			String alreadyPresent = jobExecution.getExecutionContext().getString("alreadyPresent", FALSE);
			if (validationFailed.equalsIgnoreCase("true")) {
				status = BatchStatus.FAILED;
				updateFileAudit(fileAuditId, status.toString(), "Validations failed", sourceFolder, failurePath,
						sequenceNo);
			} else if (alreadyPresent.equalsIgnoreCase("true")) {
				status = BatchStatus.FAILED;
				updateFileAudit(fileAuditId, status.toString(), errorMsg, sourceFolder, failurePath, sequenceNo);
			} else {
				updateFileAudit(fileAuditId, status.toString(), FileIntegrationConstants.IMPORT_SUCCESS_MSG,
						sourceFolder, successFolder, sequenceNo);
			}
		} else {
			updateFileAudit(fileAuditId, status.toString(), null, sourceFolder, failurePath, sequenceNo);
		}

		// deleting records from staging table
		if (jobName.equalsIgnoreCase("Stn")) {
			jdbcTemplate.execute("DELETE from stn_hdr_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from stn_dtl_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from stn_ldtl_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from stn_mdtl_stage where file_id = '" + fileAuditId + "'");
		} else {
			jdbcTemplate.execute("DELETE from inv_ihdr_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from inv_idtl_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from inv_ildtl_stage where file_id = '" + fileAuditId + "'");
			jdbcTemplate.execute("DELETE from inv_imdtl_stage where file_id = '" + fileAuditId + "'");
		}
		log.info(jobName + " has ended at: {}", CalendarUtils.getCurrentDate());
	}

	private void updateFileAudit(String fileAuditId, String status, String remarks, String srcFolder, String destFolder,
			Integer sequenceNo) {
		FileServiceUtil.moveFileFromSrcToDst(srcFolder, destFolder);
		fileAuditService.updateFileAudit(fileAuditId, status, FileGroupEnum.ORACLE.toString(), remarks,
				FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
	}
}
