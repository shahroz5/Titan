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
public class MasterIngestionListener implements StepExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	private String jobFileName;

	private String fileIdName;

	private String tableName;

	private String deleteQuery;

	public MasterIngestionListener() {

	}

	public MasterIngestionListener(String jobFileName, String fileIdName, String tableName, String deleteQuery) {

		this.jobFileName = jobFileName;
		this.fileIdName = fileIdName;
		this.tableName = tableName;
		this.deleteQuery = deleteQuery;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// Default implementation Ignored
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		String fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString(fileIdName);

		String fileName = stepExecution.getJobParameters().getString(jobFileName);
		String sourcePath = stepExecution.getJobParameters().getString("sourcePath") + fileName;
		String successPath = stepExecution.getJobParameters().getString("successPath") + fileName;
		String failurePath = stepExecution.getJobParameters().getString("failurePath") + fileName;
		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", " ").trim().substring(4));
		try {
			// extracting the sequence number from file name
			BatchStatus status = stepExecution.getStatus();
			if (status.toString().equalsIgnoreCase("COMPLETED")) {
				fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.ORACLE.toString(),
						FileIntegrationConstants.IMPORT_SUCCESS_MSG, FileGroupEnum.ORACLE.toString(), true, sequenceNo,
						null);
			} else {
				fileAuditService.updateFileAudit(fileAuditId, status.toString(), FileGroupEnum.ORACLE.toString(),
						FileIntegrationConstants.FAILURE_MSG, FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
			}

			// move file to success or failure folder
			fileService.moveMasterFile(fileAuditId, sourcePath, successPath, failurePath);

			jdbcTemplate.execute(deleteQuery + fileAuditId + "'");
			log.info(tableName + " table is truncated");
		} catch (Exception e) {
			fileAuditService.updateFileAudit(fileAuditId, "FAILED", FileGroupEnum.ORACLE.toString(), e.getMessage(),
					FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
			// move file to success or failure folder
			fileService.moveMasterFile(fileAuditId, sourcePath, successPath, failurePath);

			jdbcTemplate.execute(deleteQuery + fileAuditId + "'");
			log.info(tableName + " table is truncated");
		}
		return ExitStatus.COMPLETED;
	}
}
