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
import com.titan.poss.core.domain.constant.OwnerTypeEnum;
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
import com.titan.poss.file.service.InvoiceValidationService;
import com.titan.poss.file.util.FileServiceUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class ExecuteInvoiceJobServiceImpl implements ExecuteJobService {

	public ExecuteInvoiceJobServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.INVOICE_JOB, this);
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
	private InvoiceValidationService invoiceValidationService;

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private FileService fileService;
	
	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String INV_JOB_LOCAL_SOURCE_FILE_PATH = "invoice.file.source.path";

	private static final String INV_JOB_LOCAL_SUCCESS_PATH = "invoice.file.success.path";

	private static final String INV_JOB_LOCAL_FAILURE_PATH = "invoice.file.failure.path";

	private static final String INV_JOB_LOCAL_ENCRYPTED_PATH = "invoice.file.encrypted.path";

	private static final String INV_JOB_SFTP_SOURCE_FILE_PATH = "sftp.invoice.source.path";

	private static final String INV_JOB_SFTP_SUCCESS_FILE_PATH = "sftp.invoice.success.path";

	private static final String INV_JOB_SFTP_FAILURE_FILE_PATH = "sftp.invoice.failure.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {

		// download all files from sftp
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localSourcePath = localFileBasePath + env.getProperty(INV_JOB_LOCAL_SOURCE_FILE_PATH);
		String localFailurePath = localFileBasePath + env.getProperty(INV_JOB_LOCAL_FAILURE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(INV_JOB_LOCAL_SUCCESS_PATH);
		String localEncryptedPath = localFileBasePath + env.getProperty(INV_JOB_LOCAL_ENCRYPTED_PATH);

		String sftpSourcePath = env.getProperty(INV_JOB_SFTP_SOURCE_FILE_PATH);
		String sftpSuccessPath = env.getProperty(INV_JOB_SFTP_SUCCESS_FILE_PATH);
		String sftpFailurePath = env.getProperty(INV_JOB_SFTP_FAILURE_FILE_PATH);

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.INVOICE.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localEncryptedPath, "txt");
			fileService.encryptOrdecryptFile(localEncryptedPath, localSourcePath, "DECRYPT");
		} else {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localSourcePath, "txt");
		}

		final File checkFolder = new File(localSourcePath);
		File[] checkFilesExt = checkFolder.listFiles();
		if (checkFilesExt != null && checkFilesExt.length > 0) {
			addExtToFilesIfNotPresent(checkFilesExt);
		}

		final File folder = new File(localSourcePath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			List<String> invoiceFileList = new ArrayList<>();
			Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
			if (manualJob == null) {
				manualJob = "false";
			}
			addFilesToList(files, invoiceFileList, manualJob.toString(),
					launchJobRequest.getJobParams().get("createdBy"), localSourcePath, localFailurePath);
			sortFileNames(invoiceFileList);

			runInvoiceJob(invoiceFileList, manualJob.toString());
		}

		final File successFolder = new File(localSuccessPath);
		File[] successFiles = successFolder.listFiles();
		if (successFiles != null && successFiles.length > 0) {
			removeExtToFilesIfPresent(successFiles);
		}

		final File failureFolder = new File(localFailurePath);
		File[] failureFiles = failureFolder.listFiles();
		if (failureFiles != null && failureFiles.length > 0) {
			removeExtToFilesIfPresent(failureFiles);
		}

		// upload success and failure files to sftp server
		fileService.moveFilesInSftpServer(sftpSourcePath, sftpSuccessPath, localSuccessPath);
		fileService.moveFilesInSftpServer(sftpSourcePath, sftpFailurePath, localFailurePath);

		// after uploading to the sftp server, removing from eposs
		fileService.removeFile(localSuccessPath);
		fileService.removeFile(localFailurePath);

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.FILE_INVOICE_JOB.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	/**
	 * Invoice files doesn't have any ext and without ext file validations will
	 * fail, so adding .txt if not present
	 * 
	 * @param files
	 */
	private void addExtToFilesIfNotPresent(File[] files) {
		for (final File fileEntry : files) {
			if (!fileEntry.getName().contains("." + FileExtensionEnum.TXT.getValue())) {
				boolean renameTo = fileEntry.renameTo(new File(fileEntry + "." + FileExtensionEnum.TXT.getValue()));
				if (renameTo) {
					log.debug(".txt extension has been added to the file");
				}
			}
		}
	}

	/**
	 * Removing ext to move files in sftp server
	 * 
	 * @param files
	 */
	private void removeExtToFilesIfPresent(File[] files) {
		for (final File fileEntry : files) {
			if (fileEntry.getName().contains("." + FileExtensionEnum.TXT.getValue())) {
				String newFileNameString = fileEntry.toString().replace(".txt", "").replace(".TXT", "");
				boolean renameTo = fileEntry.renameTo(new File(newFileNameString));
				if (renameTo) {
					log.debug(".txt extension has been removed from the file");
				}
			}
		}
	}

	private void runInvoiceJob(List<String> invoiceFileList, String manualJob) {
		for (int i = 0; i < invoiceFileList.size(); i++) {
			LaunchJobRequest jobRequest = new LaunchJobRequest();
			jobRequest.setJobName(FileIntegrationConstants.INVOICE_JOB);
			Map<String, String> jobParam = new HashMap<>();
			jobParam.put(JobFileNameEnum.INVOICE_FILE_NAME.getValue(), invoiceFileList.get(i));
			jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
			jobRequest.setJobParams(jobParam);
			executeBatchJobs.executeJob(jobRequest, false);
		}
	}

	private void addFilesToList(File[] files, List<String> invoiceFileList, String manualJob, String createdBy,
			String localPath, String localFailurePath) {
		for (final File fileEntry : files) {
			if (!fileEntry.getName().contains("." + FileExtensionEnum.TXT.getValue())) {
				boolean renameTo = fileEntry.renameTo(new File(fileEntry + "." + FileExtensionEnum.TXT.getValue()));
				if (renameTo) {
					log.debug(".txt extension has been added to the file");
				}
			}
			List<FileAuditDao> fileAudits = fileAuditRepository.findByFileNameAndStatus(fileEntry.getName(),
					JobProcessStatusEnum.COMPLETED.toString());
			String fileNameWithoutExt = fileEntry.getName().replace(".txt", "");
			int initialIndex = fileNameWithoutExt.indexOf('_');
			int finalIndex = fileNameWithoutExt.indexOf('.');
			String destLocationCode = fileNameWithoutExt.substring(initialIndex + 1, finalIndex);
			if (fileAudits.isEmpty()) {
				String srcFPath = localPath + fileEntry.getName();
				File file = new File(srcFPath);
				Map<String, String> fileStatus = FileServiceUtil.validateReqFile(file, FileGroupEnum.INVOICE.toString(),
						FileExtensionEnum.TXT.toString(), ContentTypesEnum.TXT.getValue(), null);
				if (fileStatus.get(FileIntegrationConstants.FAILED) != null) {
					fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
							"File Validations failed: " + fileStatus.get(FileIntegrationConstants.FAILED), localPath,
							localFailurePath, FileMasterJobNameEnum.INVOICE.getValue(),
							FileGroupEnum.ORACLE.toString());
				} else if (!invoiceValidationService.validateFileColumnLength(file)) {
					fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
							"This Purchase Invoice file does not have the right number of values as expected, hence the file has been discarded",
							localPath, localFailurePath, FileMasterJobNameEnum.INVOICE.getValue(),
							FileGroupEnum.ORACLE.toString());
				} else if (validateLocationCode(destLocationCode)) {
					fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
							"Destination location code is not present/active or has invalid location type/owner type, hence the file has been discarded",
							localPath, localFailurePath, FileMasterJobNameEnum.INVOICE.getValue(),
							FileGroupEnum.ORACLE.toString());
				} else {
					invoiceFileList.add(fileEntry.getName());
				}
			} else {
				fileAuditService.updateFileAuditToFailedStatus(fileEntry.getName(), manualJob, createdBy,
						"File has been already processed", localPath, localFailurePath,
						FileMasterJobNameEnum.INVOICE.getValue(), FileGroupEnum.ORACLE.toString());
			}
		}
	}

	private boolean validateLocationCode(String destLocationCode) {
		List<LocationDao> locationDao = locationRepository
				.findByLocationCodeInAndIsActive(Arrays.asList(destLocationCode), true);
		// dest location code should be L3 and BTQ
		return locationDao.isEmpty()
				|| !locationDao.get(0).getLocationTypeCode()
						.equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_BTQ)
				|| !locationDao.get(0).getOwnerTypeCode().equalsIgnoreCase(OwnerTypeEnum.L3.toString());
	}

	private void sortFileNames(List<String> invoiceFileList) {
		CollectionUtil.sortList(invoiceFileList);
	}
}
