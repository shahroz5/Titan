/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.ExecuteJobService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.service.StuddedSplitValidationService;
import com.titan.poss.file.util.FileServiceUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class ExecuteStuddedSplitRetryJobFileServiceImpl implements ExecuteJobService {

	public ExecuteStuddedSplitRetryJobFileServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.RETRY_STUDDED_SPLIT_JOB, this);
	}

	@Autowired
	private Environment env;

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private StuddedSplitValidationService studdedSplitValidationService;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH = "studded.split.file.source.path";

	private static final String STUDDED_SPLIT_JOB_LOCAL_SUCCESS_PATH = "studded.split.file.success.path";

	private static final String STUDDED_SPLIT_JOB_LOCAL_FAILURE_PATH = "studded.split.file.failure.path";

	private static final String STUDDED_SPLIT_JOB_LOCAL_RETRY_PATH = "studded.split.file.retry.path";

	private static final String STUDDED_SPLIT_JOB_SFTP_SOURCE_FILE_PATH = "sftp.studded.split.source.path";

	private static final String STUDDED_SPLIT_JOB_SFTP_SUCCESS_FILE_PATH = "sftp.studded.split.success.path";

	private static final String STUDDED_SPLIT_JOB_SFTP_FAILURE_FILE_PATH = "sftp.studded.split.failure.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {

		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SOURCE_FILE_PATH);
		String localFailurePath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_FAILURE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_SUCCESS_PATH);
		String localRetryPath = localFileBasePath + env.getProperty(STUDDED_SPLIT_JOB_LOCAL_RETRY_PATH);

		String sftpSourcePath = env.getProperty(STUDDED_SPLIT_JOB_SFTP_SOURCE_FILE_PATH);
		String sftpSuccessPath = env.getProperty(STUDDED_SPLIT_JOB_SFTP_SUCCESS_FILE_PATH);
		String sftpFailurePath = env.getProperty(STUDDED_SPLIT_JOB_SFTP_FAILURE_FILE_PATH);

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.STUDDED_SPLIT_JOB.getValue());

		// move files from retry folder to source folder
		fileService.moveFilesFromSrcToDest(localRetryPath, localSourcePath);

		final File folder = new File(localSourcePath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			List<String> studdedSplitFileList = new ArrayList<>();
			Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
			if (manualJob == null) {
				manualJob = "false";
			}

			addFilesToList(files, studdedSplitFileList, manualJob.toString(),
					launchJobRequest.getJobParams().get("createdBy"), localSourcePath, localFailurePath);
			sortFileNames(studdedSplitFileList);

			runStuddedSplitJob(studdedSplitFileList, manualJob.toString());

			checkRetryFiles(localRetryPath, localFailurePath, fileMaster.getRetryLimit());
			// upload success and failure files to sftp server
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpSuccessPath, localSuccessPath);
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpFailurePath, localFailurePath);

			// after uploading to the sftp server, removing from eposs
			fileService.removeFile(localSuccessPath);
			fileService.removeFile(localFailurePath);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.FILE_RETRY_STUDDED_SPLIT_JOB.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	/**
	 * check the no of times retried and fail if it exceeds the limit
	 * 
	 * @param integer
	 * @param localRetryPath
	 */
	private void checkRetryFiles(String localRetryPath, String localFailurePath, Integer retryLimit) {
		final File folder = new File(localRetryPath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			for (final File fileEntry : files) {
				Integer retryCount = fileAuditRepository.getRetryCount(fileEntry.getName());
				if (retryCount > retryLimit) {
					boolean rename = fileEntry.renameTo(new File(localFailurePath + fileEntry.getName()));
					log.debug("file moved to failure folder: " + rename);
				}
			}
		}
	}

	private void runStuddedSplitJob(List<String> studdedSplitFileList, String manualJob) {
		for (int i = 0; i < studdedSplitFileList.size(); i++) {
			LaunchJobRequest jobRequest = new LaunchJobRequest();
			jobRequest.setJobName(FileIntegrationConstants.STUDDED_SPLIT_JOB);
			Map<String, String> jobParam = new HashMap<>();
			String fileName = studdedSplitFileList.get(i);
			jobParam.put(JobFileNameEnum.STUDDED_SPLIT_FILE_NAME.getValue(), fileName);
			jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
			jobRequest.setJobParams(jobParam);
			executeBatchJobs.executeJob(jobRequest, false);
		}
	}

	private void addFilesToList(File[] files, List<String> studdedSplitFileList, String manualJob, String createdBy,
			String localPath, String localFailurePath) {
		for (final File fileEntry : files) {
			if (!fileEntry.isDirectory()) {
				List<FileAuditDao> fileAudits = fileAuditRepository.findByFileNameAndStatus(fileEntry.getName(),
						JobProcessStatusEnum.COMPLETED.toString());
				if (fileAudits.isEmpty()) {
					String srcPath = localPath + fileEntry.getName();
					File file = new File(srcPath);
					Map<String, String> fileStatus = FileServiceUtil.validateReqFile(file,
							FileGroupEnum.STUDDED_SPLIT.toString(), FileExtensionEnum.TXT.toString(),
							ContentTypesEnum.TXT.getValue(), null);
					if (fileStatus.get(FileIntegrationConstants.FAILED) != null) {
						fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
								"File Validations failed: " + fileStatus.get(FileIntegrationConstants.FAILED),
								localPath, localFailurePath, FileMasterJobNameEnum.STUDDED_SPLIT_JOB.getValue(),
								FileGroupEnum.ORACLE.toString());
					} else if (!studdedSplitValidationService.validateFileColumnLength(file)) {
						fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
								"File column length does not match", localPath, localFailurePath,
								FileMasterJobNameEnum.STUDDED_SPLIT_JOB.getValue(), FileGroupEnum.ORACLE.toString());
					} else {
						studdedSplitFileList.add(fileEntry.getName());
					}
				} else {
					fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
							"File has been already processed", localPath, localFailurePath,
							FileMasterJobNameEnum.STUDDED_SPLIT_JOB.getValue(), FileGroupEnum.ORACLE.toString());
				}
			}
		}
	}

	private void sortFileNames(List<String> stnFileList) {
		// sorting based on serial number
		Collections.sort(stnFileList,
				(String s1, String s2) -> Integer.compare(Integer.parseInt(s1.replaceAll("[^\\d]", "").substring(8)),
						Integer.parseInt(s2.replaceAll("[^\\d]", "").substring(8))));
	}
}
