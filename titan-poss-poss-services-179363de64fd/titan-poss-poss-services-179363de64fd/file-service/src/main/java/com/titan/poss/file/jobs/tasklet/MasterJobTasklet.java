/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.File;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

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

@Slf4j
@Component
public class MasterJobTasklet implements Tasklet, StepExecutionListener {

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private Environment env;

	@Value("${file.encryption.enabled:false}")
	private boolean fileEncryptionEnabled;

	private String filePath;

	private String jobFileName;

	private String jobName;

	private String fileGroup;

	private String extension;

	private String contentType;

	private Integer columnCount;

	private boolean stopJob;

	private int totalCount;

	public MasterJobTasklet() {
		// empty constructor
	}

	/**
	 * @param env
	 * @param encryptedFilePath
	 * @param filePath
	 * @param jobFileName
	 * @param jobName
	 * @param fileGroup
	 * @param extension
	 * @param contentType
	 * @param columnCount
	 * @param savedId
	 */
	public MasterJobTasklet(String filePath, String jobFileName, String jobName, String fileGroup, String extension,
			String contentType, Integer columnCount, String savedId) {
		super();
		this.filePath = filePath;
		this.jobFileName = jobFileName;
		this.jobName = jobName;
		this.fileGroup = fileGroup;
		this.extension = extension;
		this.contentType = contentType;
		this.columnCount = columnCount;
		this.savedId = savedId;
	}

	private String savedId;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileName = (String) chunkContext.getStepContext().getJobParameters().get(jobFileName);
		if (StringUtils.isEmpty(fileName)) {
			stopJob = true;
			log.debug(jobName + " file not present");
			return RepeatStatus.FINISHED;
		}
		File decryptedFile = new File(
				env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(filePath) + fileName);
		Map<String, String> fileStatus = FileServiceUtil.validateReqFile(decryptedFile, fileGroup, extension,
				contentType, columnCount);
		totalCount = FileServiceUtil.getTotalCount(
				env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(filePath) + fileName);
		if (fileStatus.get(FileIntegrationConstants.FAILED) != null) {
			stopJob = true;
			log.debug("File validations failed: " + fileStatus.get(FileIntegrationConstants.FAILED));
			return RepeatStatus.FINISHED;
		}
		log.debug(jobName + " job has started at :" + CalendarUtils.getCurrentDate());
		return RepeatStatus.FINISHED;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		stopJob = false;
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		if (stopJob) {
			return ExitStatus.STOPPED;
		}
		String fileName = stepExecution.getJobParameters().getString(jobFileName);
		String manualJob = stepExecution.getJobParameters().getString("manualJob", "false");

		FileAuditDto fileAudit = fileAuditService.getInitialFileAuditDto(fileName, jobName, fileGroup, manualJob,
				totalCount, FileIntegrationConstants.ERP_USER, env.getProperty(filePath));
		FileAuditDto savedFileAuditDto = fileAuditService.saveFileAuditData(fileAudit);
		stepExecution.getJobExecution().getExecutionContext().put(savedId, savedFileAuditDto.getFileId());
		return ExitStatus.COMPLETED;
	}
}
