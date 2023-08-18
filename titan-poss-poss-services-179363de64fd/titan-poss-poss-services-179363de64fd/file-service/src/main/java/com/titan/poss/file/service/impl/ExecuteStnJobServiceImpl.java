/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.jcraft.jsch.Logger;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.utils.CollectionUtil;
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
import com.titan.poss.file.service.StnValidationService;
import com.titan.poss.file.util.FileServiceUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class ExecuteStnJobServiceImpl implements ExecuteJobService {

	public ExecuteStnJobServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.STN_JOB, this);
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
	private StnValidationService stnValidationService;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String STN_JOB_LOCAL_SOURCE_FILE_PATH = "stn.file.source.path";

	private static final String STN_JOB_LOCAL_ENCRYPTED_FILE_PATH = "stn.file.encrypted.path";

	private static final String STN_JOB_LOCAL_SUCCESS_PATH = "stn.file.success.path";

	private static final String STN_JOB_LOCAL_FAILURE_PATH = "stn.file.failure.path";

	private static final String STN_JOB_SFTP_SOURCE_FILE_PATH = "sftp.stn.source.path";

	private static final String STN_JOB_SFTP_SUCCESS_FILE_PATH = "sftp.stn.success.path";

	private static final String STN_JOB_SFTP_FAILURE_FILE_PATH = "sftp.stn.failure.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {

		// download all files from sftp
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(STN_JOB_LOCAL_SOURCE_FILE_PATH);
		String localFailurePath = localFileBasePath + env.getProperty(STN_JOB_LOCAL_FAILURE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(STN_JOB_LOCAL_SUCCESS_PATH);
		String localEncryptedPath = localFileBasePath + env.getProperty(STN_JOB_LOCAL_ENCRYPTED_FILE_PATH);

		String sftpSourcePath = env.getProperty(STN_JOB_SFTP_SOURCE_FILE_PATH);
		String sftpSuccessPath = env.getProperty(STN_JOB_SFTP_SUCCESS_FILE_PATH);
		String sftpFailurePath = env.getProperty(STN_JOB_SFTP_FAILURE_FILE_PATH);

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.STN.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localEncryptedPath, "txt");
			fileService.encryptOrdecryptFile(localEncryptedPath, localSourcePath, "DECRYPT");
		} else {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localSourcePath, "txt");
		}

		final File folder = new File(localSourcePath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			List<String> stnFileList = new ArrayList<>();
			Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
			if (manualJob == null) {
				manualJob = "false";
			}

			addFilesToList(files, stnFileList, manualJob.toString(), launchJobRequest.getJobParams().get("createdBy"),
					localSourcePath, localFailurePath);
			sortFileNames(stnFileList);

			runStnJob(stnFileList, manualJob.toString());

			// upload success and failure files to sftp server
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpSuccessPath, localSuccessPath);
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpFailurePath, localFailurePath);

			// after uploading to the sftp server, removing from eposs
			fileService.removeFile(localSuccessPath);
			fileService.removeFile(localFailurePath);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.FILE_STN_JOB.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	private void runStnJob(List<String> stnFileList, String manualJob) {
		for (int i = 0; i < stnFileList.size(); i++) {
			LaunchJobRequest jobRequest = new LaunchJobRequest();
			jobRequest.setJobName(FileIntegrationConstants.STN_JOB);
			Map<String, String> jobParam = new HashMap<>();
			String fileName = stnFileList.get(i);
			jobParam.put(JobFileNameEnum.STN_FILE_NAME.getValue(), fileName);
			jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
			// checking if the file is stn ibt
			String fileNameSubString = fileName.substring(0, fileName.indexOf('.')).replaceAll("[0-9]", "");
			String stnIbt = "false";
			if (fileNameSubString.length() > 5) {
				stnIbt = "true";
			}
			jobParam.put("ibt", stnIbt);
			jobRequest.setJobParams(jobParam);
			executeBatchJobs.executeJob(jobRequest, false);
		}
	}

	private void addFilesToList(File[] files, List<String> stnFileList, String manualJob, String createdBy,
			String localPath, String localFailurePath) {
		for (final File fileEntry : files) {
			if (!fileEntry.isDirectory()) {
				List<FileAuditDao> fileAudits = fileAuditRepository.findByFileNameAndStatus(fileEntry.getName(),
						JobProcessStatusEnum.COMPLETED.toString());
				if (fileAudits.isEmpty()) {
					String srcPath = localPath + fileEntry.getName();
					File file = new File(srcPath);
					Map<String, String> fileStatus = FileServiceUtil.validateReqFile(file, FileGroupEnum.STN.toString(),
							FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(), null);
					if (fileStatus.get(FileIntegrationConstants.FAILED) != null) {
						fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
								"File Validations failed: " + fileStatus.get(FileIntegrationConstants.FAILED),
								localPath, localFailurePath, FileMasterJobNameEnum.STN.getValue(),
								FileGroupEnum.ORACLE.toString());
					} else if (!stnValidationService.validateFileColumnLength(file)) {
						fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
								"Stn file column length does not match", localPath, localFailurePath,
								FileMasterJobNameEnum.STN.toString(), FileGroupEnum.ORACLE.toString());
					} else {
						stnFileList.add(fileEntry.getName());
					}
				} else {
					fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
							"File has been already processed", localPath, localFailurePath,
							FileMasterJobNameEnum.STN.toString(), FileGroupEnum.ORACLE.toString());
				}
			}
		}
	}

	private void sortFileNames(List<String> stnFileList) {
		CollectionUtil.sortList(stnFileList);
	}
}
