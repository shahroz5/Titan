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
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.util.FileServiceUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class StuddedSplitJobListener implements JobExecutionListener {

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Environment env;

	private static final String STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH = "studded.split.file.source.path";
	private static final String STUDDED_SPLIT_JOB_LOCAL_SUCCESS_FILE_PATH = "studded.split.file.success.path";
	private static final String STUDDED_SPLIT_JOB_LOCAL_FAILURE_FILE_PATH = "studded.split.file.failure.path";
	private static final String STUDDED_SPLIT_JOB_LOCAL_RETRY_FILE_PATH = "studded.split.file.retry.path";

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("Studded split job has started at: {}", CalendarUtils.getCurrentDate());
		String fileName = jobExecution.getJobParameters().getString(JobFileNameEnum.STUDDED_SPLIT_FILE_NAME.getValue());
		String locationCode = fileName.replaceAll("[\\d]", "").replace(".txt", "");
		String srcFolder = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH) + fileName;
		String manualJob = jobExecution.getJobParameters().getString("manualJob", "FALSE");
		int totalCount = FileServiceUtil.getTotalCount(srcFolder);
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName, "STUDDED_SPLIT",
				FileGroupEnum.ORACLE.toString(), manualJob, totalCount, FileIntegrationConstants.ERP_USER, srcFolder);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		jobExecution.getExecutionContext().put("studdedSplitTransactionId", savedFileAuditDto.getFileId());
		jobExecution.getExecutionContext().put("locationCode", locationCode);
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		log.info("Studded split job has ended at: {}", CalendarUtils.getCurrentDate());

		String fileId = jobExecution.getExecutionContext().getString("studdedSplitTransactionId");
		String fileName = jobExecution.getJobParameters().getString(JobFileNameEnum.STUDDED_SPLIT_FILE_NAME.getValue());
		String valid = jobExecution.getExecutionContext().getString("valid");
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH);
		String localFailurePath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_FAILURE_FILE_PATH);
		String localRetryPath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_RETRY_FILE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SUCCESS_FILE_PATH);
		Integer sequenceNo = Integer.parseInt(fileName.replaceAll("[^\\d]", "").substring(8));

		BatchStatus status = jobExecution.getStatus();
		if (status.toString().equalsIgnoreCase("COMPLETED")) {
			if (valid.equalsIgnoreCase("true")) {
				fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
						FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.IMPORT_SUCCESS_MSG,
						FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
				FileServiceUtil.moveFileFromSrcToDst(localSourcePath + fileName, localSuccessPath + fileName);
			} else {
				fileAuditService.updateFileAudit(fileId, "RETRY", FileGroupEnum.ORACLE.toString(), "Validations failed",
						FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
				FileServiceUtil.moveFileFromSrcToDst(localSourcePath + fileName, localRetryPath + fileName);
			}
		} else {
			fileAuditService.updateFileAudit(fileId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG,
					FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
			FileServiceUtil.moveFileFromSrcToDst(localSourcePath + fileName, localFailurePath + fileName);
		}
		moveData("studded_split_hdr_stage", "studded_split_hdr_aud", fileId);
		moveData("studded_split_dtl_stage", "studded_split_dtl_aud", fileId);
		moveData("studded_split_ldtl_stage", "studded_split_ldtl_aud", fileId);

	}

	private void moveData(String sourceTable, String destTable, String fileId) {
		String moveHdrDataSql = "INSERT into " + destTable + " select * from " + sourceTable + " where file_id = '"
				+ fileId + "'";
		jdbcTemplate.execute(moveHdrDataSql);
		String removeDataSql = "DELETE from " + sourceTable + " where file_id = '" + fileId + "'";
		jdbcTemplate.execute(removeDataSql);
	}

}
