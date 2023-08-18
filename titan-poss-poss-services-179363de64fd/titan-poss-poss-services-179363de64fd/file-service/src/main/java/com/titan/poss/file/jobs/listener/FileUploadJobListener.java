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

import com.titan.poss.config.repository.DiscountRepository;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class FileUploadJobListener implements JobExecutionListener {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileAuditService fileAuditService;

	private String jobName;

	private String deleteQuery;

	@Autowired
	private DiscountRepository discountRepository;
	
	public FileUploadJobListener() {

	}

	public FileUploadJobListener(String jobName, String deleteQuery) {
		this.jobName = jobName;
		this.deleteQuery = deleteQuery;
	}

	@Override
	public void beforeJob(JobExecution jobExecution) {
		log.info(jobName + " job has started at: {}", CalendarUtils.getCurrentDate());
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		String fileAuditId = jobExecution.getJobParameters().getString("fileAuditId");
		String fileGroup = jobExecution.getJobParameters().getString("fileGroup");
		String fileName = jobExecution.getJobParameters().getString("fileName");
		String emailId = jobExecution.getJobParameters().getString("emailId", "");
		if (jobExecution.getStatus().toString().equalsIgnoreCase("COMPLETED")) {
			fileAuditService.updateFileAudit(fileAuditId, jobExecution.getStatus().toString(), fileGroup,
					FileIntegrationConstants.IMPORT_SUCCESS_MSG, null, true, null, emailId);
			if (jobName.equalsIgnoreCase("Discount exclude item mapping")) {
				String discountId = jobExecution.getJobParameters().getString("discountId");
				discountRepository.updateIsPublishedFlag(discountId);
			}
		} else {
			fileAuditService.updateFileAudit(fileAuditId, jobExecution.getStatus().toString(), fileGroup,
					FileIntegrationConstants.FAILURE_MSG, null, true, null, emailId);
		}
		fileService.removeTempFile(fileGroup, fileName);
		jdbcTemplate.execute(deleteQuery + fileAuditId + "'");
		log.info(jobName + " job has ended at: {}", CalendarUtils.getCurrentDate());
	}
}
