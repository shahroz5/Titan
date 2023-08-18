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
public class GiftMasterJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileAuditService fileAuditService;

	private String localSourceFolder;

	private String localSuccessFolder;

	private String localFailureFolder;

	private String deleteQuery;

	private String jobFileName;

	private String giftVoucherId;

	@Autowired
	private Environment env;

	public GiftMasterJobListener() {

	}

	public GiftMasterJobListener(String localSourceFolder, String localSuccessFolder, String localFailureFolder,
			String deleteQuery, String jobFileName, String giftVoucherId) {

		this.localSourceFolder = localSourceFolder;
		this.localSuccessFolder = localSuccessFolder;
		this.localFailureFolder = localFailureFolder;
		this.deleteQuery = deleteQuery;
		this.jobFileName = jobFileName;
		this.giftVoucherId = giftVoucherId;
	}

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info("GiftMasterStatusJob has started at: {}", CalendarUtils.getCurrentDate());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		log.info("GiftMasterStatusJob has ended at: {}", CalendarUtils.getCurrentDate());
		String fileAuditId = jobExecution.getExecutionContext().getString(giftVoucherId);
		String fileName = jobExecution.getJobParameters().getString(jobFileName);
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(localSourceFolder);
		String localFailurePath = localFileBasePath + env.getProperty(localFailureFolder);
		String localSuccessPath = localFileBasePath + env.getProperty(localSuccessFolder);
		Integer sequenceNo = Integer.parseInt(fileName.substring(fileName.lastIndexOf('_') + 1, fileName.indexOf('.')));

		BatchStatus status = jobExecution.getStatus();
		if (status.toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileAuditId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.IMPORT_SUCCESS_MSG,
					FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
			FileServiceUtil.moveFileFromSrcToDst(localSourcePath + fileName, localSuccessPath + fileName);
		} else {
			fileAuditService.updateFileAudit(fileAuditId, jobExecution.getStatus().toString(),
					FileGroupEnum.ORACLE.toString(), FileIntegrationConstants.FAILURE_MSG,
					FileGroupEnum.ORACLE.toString(), true, sequenceNo, null);
			FileServiceUtil.moveFileFromSrcToDst(localSourcePath + fileName, localFailurePath + fileName);
		}
		jdbcTemplate.execute(deleteQuery + fileAuditId + "'");
	}
}
