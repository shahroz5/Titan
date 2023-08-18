/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.FileAuditDto;
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
public class NetcarrotsFTPJobStagingListener implements StepExecutionListener {

	@Autowired
	private FileService fileService;

	@Autowired
	private FileAuditService fileAuditService;

	private String fileMasterJobName;

	private String fileAuditIdName;

	private String stepName;

	public NetcarrotsFTPJobStagingListener() {

	}

	public NetcarrotsFTPJobStagingListener(String fileMasterJobName, String fileAuditIdName, String stepName) {
		this.fileMasterJobName = fileMasterJobName;
		this.fileAuditIdName = fileAuditIdName;
		this.stepName = stepName;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		log.info("Inside Before Step........................NetcarrotsFTPJobStagingListener ");
		String manualJob = stepExecution.getJobParameters().getString("manualJob", "false");
		String transactionDate = stepExecution.getJobParameters().getString(FileIntegrationConstants.TRANSACTION_DATE);
		String fileName = fileService.getNetcarrotsFileName(transactionDate, fileMasterJobName,
				FileGroupEnum.NETCARROTS.toString(), true);
		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName, fileMasterJobName,
				FileGroupEnum.NETCARROTS.toString(), manualJob, null, FileIntegrationConstants.ERP_USER, null);
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		stepExecution.getJobExecution().getExecutionContext().put(fileAuditIdName, savedFileAuditDto.getFileId());
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		log.info("Inside After Step........................NetcarrotsFTPJobStagingListener ");
		log.debug(stepName + " tasklet step completed");
		return ExitStatus.COMPLETED;
	}

}
