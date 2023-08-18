/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.ExecuteJobService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ExecuteGiftMasterJobServiceImpl implements ExecuteJobService {

	public ExecuteGiftMasterJobServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.GV_INDENT_JOB, this);
	}

	@Autowired
	private Environment env;

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String GV_LOCAL_SOURCE_FILE_PATH = "gv.source.path";

	private static final String GV_LOCAL_SUCCESS_PATH = "gv.success.path";

	private static final String GV_LOCAL_FAILURE_PATH = "gv.failure.path";

	private static final String GV_LOCAL_ENCRYPTED_PATH = "gv.encrypted.path";

	private static final String GV_SFTP_SOURCE_FILE_PATH = "sftp.gv.source.path";

	private static final String GV_SFTP_SUCCESS_FILE_PATH = "sftp.gv.success.path";

	private static final String GV_SFTP_FAILURE_FILE_PATH = "sftp.gv.failure.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {

		// download all files from sftp
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(GV_LOCAL_SOURCE_FILE_PATH);
		String localFailurePath = localFileBasePath + env.getProperty(GV_LOCAL_FAILURE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(GV_LOCAL_SUCCESS_PATH);
		String localEncryptedPath = localFileBasePath + env.getProperty(GV_LOCAL_ENCRYPTED_PATH);

		String sftpSourcePath = env.getProperty(GV_SFTP_SOURCE_FILE_PATH);
		String sftpSuccessPath = env.getProperty(GV_SFTP_SUCCESS_FILE_PATH);
		String sftpFailurePath = env.getProperty(GV_SFTP_FAILURE_FILE_PATH);

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.GIFT_VOUCHER_INDENT.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localEncryptedPath, "txt");
			fileService.encryptOrdecryptFile(localEncryptedPath, localSourcePath, "DECRYPT");
		} else {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localSourcePath, "txt");
		}

		final File folder = new File(localSourcePath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			List<String> giftIndentList = new ArrayList<>();
			List<String> giftStatusList = new ArrayList<>();
			Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
			if (manualJob == null) {
				manualJob = "false";
			}
			addFilesToList(files, giftIndentList, giftStatusList, manualJob.toString(), localSourcePath,
					localFailurePath);
			sortFileNames(giftIndentList, giftStatusList);

			runIndentJob(giftIndentList, manualJob.toString());
			runStatusJob(giftStatusList, manualJob.toString());

			// upload success and failure files to sftp server
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpSuccessPath, localSuccessPath);
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpFailurePath, localFailurePath);

			// after uploading to the sftp server, removing from eposs
			fileService.removeFile(localSuccessPath);
			fileService.removeFile(localFailurePath);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_GIFT_MASTER_JOB.toString());
		return response;
	}

	private void runIndentJob(List<String> giftIndentList, String manualJob) {
		for (int i = 0; i < giftIndentList.size(); i++) {
			LaunchJobRequest jobRequest = new LaunchJobRequest();
			jobRequest.setJobName(FileIntegrationConstants.GV_INDENT_JOB);
			Map<String, String> jobParam = new HashMap<>();
			jobParam.put(JobFileNameEnum.GIFT_MASTER_INDENT_FILE_NAME.getValue(), giftIndentList.get(i));
			jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
			jobRequest.setJobParams(jobParam);
			executeBatchJobs.executeJob(jobRequest, false);
		}
	}

	private void runStatusJob(List<String> giftStatusList, String manualJob) {
		for (int i = 0; i < giftStatusList.size(); i++) {
			LaunchJobRequest jobRequest = new LaunchJobRequest();
			jobRequest.setJobName(FileIntegrationConstants.GV_STATUS_JOB);
			Map<String, String> jobParam = new HashMap<>();
			jobParam.put(JobFileNameEnum.GIFT_MASTER_STATUS_FILE_NAME.getValue(), giftStatusList.get(i));
			jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
			jobRequest.setJobParams(jobParam);
			executeBatchJobs.executeJob(jobRequest, false);
		}
	}

	private void addFilesToList(File[] files, List<String> giftIndentList, List<String> giftStatusList,
			String manualJob, String localPath, String localFailurePath) {

		Map<String, String> filePrefix = getFilePrefix();
		String gvIndentFormat = filePrefix.get(FileIntegrationConstants.GV_INDENT_JOB);
		String gvStatusFormat = filePrefix.get(FileIntegrationConstants.GV_STATUS_JOB);

		for (final File fileEntry : files) {
			if (!fileEntry.isDirectory() && fileAuditService.checkIfAlreadyProcessed(fileEntry.getName(),
					getFileJobName(fileEntry.getName(), gvIndentFormat, gvStatusFormat), manualJob, localPath,
					localFailurePath, FileGroupEnum.ORACLE.toString())) {
				if (fileEntry.getName().startsWith(FileIntegrationConstants.GIFT_VOUCHER_INDENT_FORMAT)) {
					giftIndentList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(FileIntegrationConstants.GIFT_VOUCHER_STATUS_FORMAT)) {
					giftStatusList.add(fileEntry.getName());
				}
			}
		}
	}

	private Map<String, String> getFilePrefix() {
		List<String> jobNames = Arrays.asList(FileMasterJobNameEnum.GIFT_VOUCHER_INDENT.getValue(),
				FileMasterJobNameEnum.GIFT_VOUCHER_STATUS.getValue());
		List<FileMasterDao> fileMasters = fileMasterRepository.findByFileNameIn(jobNames);

		Map<String, String> filePrefixMap = new HashMap<>();

		for (FileMasterDao fileMaster : fileMasters) {
			if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.GIFT_VOUCHER_INDENT.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.GV_INDENT_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName()
					.equalsIgnoreCase(FileMasterJobNameEnum.GIFT_VOUCHER_STATUS.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.GV_STATUS_JOB, fileMaster.getFilePrefix());
			}
		}
		return filePrefixMap;
	}

	/**
	 * @param name
	 * @return
	 */
	private String getFileJobName(String fileName, String gvIndentFormat, String gvStatusFormat) {
		if (fileName.startsWith(gvIndentFormat)) {
			return FileMasterJobNameEnum.GIFT_VOUCHER_INDENT.getValue();
		} else if (fileName.startsWith(gvStatusFormat)) {
			return FileMasterJobNameEnum.GIFT_VOUCHER_STATUS.getValue();
		}
		return null;
	}

	private void sortFileNames(List<String> giftIndentList, List<String> giftStatusList) {
		CollectionUtil.sortList(giftIndentList);
		CollectionUtil.sortList(giftStatusList);
	}
}
