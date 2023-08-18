/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.constants.JobFileNameEnum;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.ExecuteJobService;
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
public class ExecuteMasterJobFileServiceImpl implements ExecuteJobService {

	public ExecuteMasterJobFileServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.MASTER_INGESTION_JOB, this);
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

	private Object manualJob;

	private String localPath;

	private String localFailurePath;

	private static final String MASTER_JOB_LOCAL_SOURCE_FILE_PATH = "masterJob.source.path";

	private static final String MASTER_JOB_LOCAL_SUCCESS_PATH = "masterJob.success.path";

	private static final String MASTER_JOB_LOCAL_FAILURE_PATH = "masterJob.failure.path";

	private static final String MASTER_JOB_LOCAL_ENCRYPTED_PATH = "masterJob.encrypted.path";

	private static final String MASTER_JOB_SFTP_SOURCE_FILE_PATH = "sftp.masterjob.source.path";

	private static final String MASTER_JOB_SFTP_SUCCESS_FILE_PATH = "sftp.masterjob.success.path";

	private static final String MASTER_JOB_SFTP_FAILURE_FILE_PATH = "sftp.masterjob.failure.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {

		// download all files from sftp
		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		localPath = localFileBasePath + env.getProperty(MASTER_JOB_LOCAL_SOURCE_FILE_PATH);
		String localSuccessPath = localFileBasePath + env.getProperty(MASTER_JOB_LOCAL_SUCCESS_PATH);
		localFailurePath = localFileBasePath + env.getProperty(MASTER_JOB_LOCAL_FAILURE_PATH);
		String localEncryptedPath = localFileBasePath + env.getProperty(MASTER_JOB_LOCAL_ENCRYPTED_PATH);

		String sftpSourcePath = env.getProperty(MASTER_JOB_SFTP_SOURCE_FILE_PATH);
		String sftpSuccessPath = env.getProperty(MASTER_JOB_SFTP_SUCCESS_FILE_PATH);
		String sftpFailurePath = env.getProperty(MASTER_JOB_SFTP_FAILURE_FILE_PATH);

		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.ITEM_MASTER.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localEncryptedPath, "txt");
			fileService.encryptOrdecryptFile(localEncryptedPath, localPath, "DECRYPT");
		} else {
			fileService.downloadFilesFromSftpServer(sftpSourcePath, localPath, "txt");
		}

		final File folder = new File(localPath);
		File[] files = folder.listFiles();

		if (files != null && files.length > 0) {
			List<String> itemMasterList = new ArrayList<>();
			List<String> stoneMasterList = new ArrayList<>();
			List<String> materialMasterList = new ArrayList<>();
			List<String> priceMasterList = new ArrayList<>();
			List<String> itemStoneMappingList = new ArrayList<>();
			List<String> itemMaterialMappingList = new ArrayList<>();

			manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
			if (manualJob == null) {
				manualJob = "false";
			}

			addFilesToList(files, itemMasterList, stoneMasterList, materialMasterList, priceMasterList,
					itemStoneMappingList, itemMaterialMappingList);
			sortFileNames(itemMasterList, stoneMasterList, materialMasterList, priceMasterList, itemStoneMappingList,
					itemMaterialMappingList);

			runMasterJobs(itemMasterList, stoneMasterList, materialMasterList, manualJob.toString(), localPath,
					localSuccessPath, localFailurePath);
			runMappingJobs(priceMasterList, itemStoneMappingList, itemMaterialMappingList, manualJob.toString(),
					localPath, localSuccessPath, localFailurePath);
			// upload success and failure files to sftp server
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpSuccessPath, localSuccessPath);
			fileService.moveFilesInSftpServer(sftpSourcePath, sftpFailurePath, localFailurePath);

			// after uploading to the sftp server, removing from eposs
			fileService.removeFile(localSuccessPath);
			fileService.removeFile(localFailurePath);

		} else {
			log.debug("No files present");
		}

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_MASTER_JOB.toString());
		return response;
	}

	private void runMasterJobs(List<String> itemMasterList, List<String> stoneMasterList,
			List<String> materialMasterList, String manualJob, String localPath, String localSuccessPath,
			String localFailurePath) {
		int maxSize = Collections
				.max(Arrays.asList(itemMasterList.size(), stoneMasterList.size(), materialMasterList.size()));
		if (maxSize > 0) {
			for (int i = 0; i < maxSize; i++) {
				LaunchJobRequest jobRequest = new LaunchJobRequest();
				jobRequest.setJobName(FileIntegrationConstants.MASTER_INGESTION_JOB);
				Map<String, String> jobParam = new HashMap<>();
				if (itemMasterList.size() > i) {
					jobParam.put(JobFileNameEnum.ITEM_MASTER_FILE_NAME.getValue(), itemMasterList.get(i));
				}
				if (stoneMasterList.size() > i) {
					jobParam.put(JobFileNameEnum.STONE_MASTER_FILE_NAME.getValue(), stoneMasterList.get(i));
				}
				if (materialMasterList.size() > i) {
					jobParam.put(JobFileNameEnum.MATERIAL_MASTER_FILE_NAME.getValue(), materialMasterList.get(i));
				}
				jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
				addCommonJobParams(jobParam, localPath, localSuccessPath, localFailurePath);
				jobRequest.setJobParams(jobParam);
				try {
					executeBatchJobs.executeJob(jobRequest, false);
				} catch (Exception e) {
					throw new ServiceException("ERROR JOB", "ERROR JOB");
				}
			}
		}
	}

	private void runMappingJobs(List<String> priceMasterList, List<String> itemStoneMappingList,
			List<String> itemMaterialMappingList, String manualJob, String localPath, String localSuccessPath,
			String localFailurePath) {
		int maxSize = Collections.max(
				Arrays.asList(priceMasterList.size(), itemStoneMappingList.size(), itemMaterialMappingList.size()));
		if (maxSize > 0) {
			for (int i = 0; i < maxSize; i++) {
				LaunchJobRequest jobRequest = new LaunchJobRequest();
				jobRequest.setJobName("masterMappingIngestionJob");
				Map<String, String> jobParam = new HashMap<>();
				if (priceMasterList.size() > i) {
					jobParam.put(JobFileNameEnum.PRICE_MASTER_FILE_NAME.getValue(), priceMasterList.get(i));
				}
				if (itemStoneMappingList.size() > i) {
					jobParam.put(JobFileNameEnum.ITEM_STONE_MAPPING_FILE_NAME.getValue(), itemStoneMappingList.get(i));
				}
				if (itemMaterialMappingList.size() > i) {
					jobParam.put(JobFileNameEnum.ITEM_MATERIAL_MAPPING_FILE_NAME.getValue(),
							itemMaterialMappingList.get(i));
				}
				jobParam.put(FileIntegrationConstants.MANUAL_JOB, manualJob);
				jobRequest.setJobParams(jobParam);
				addCommonJobParams(jobParam, localPath, localSuccessPath, localFailurePath);
				executeBatchJobs.executeJob(jobRequest, false);
			}
		}
	}

	private void addFilesToList(File[] files, List<String> itemMasterList, List<String> stoneMasterList,
			List<String> materialMasterList, List<String> priceMasterList, List<String> itemStoneMappingList,
			List<String> itemMaterialMappingList) {

		Map<String, String> filePrefix = getFilePrefix();

		String itemMasterFormat = filePrefix.get(FileIntegrationConstants.ITEM_MASTER_JOB);
		String stoneMasterFormat = filePrefix.get(FileIntegrationConstants.STONE_MASTER_JOB);
		String priceMasterFormat = filePrefix.get(FileIntegrationConstants.PRICE_MASTER_JOB);
		String materailMasterFormat = filePrefix.get(FileIntegrationConstants.MATERIAL_MASTER_JOB);
		String itemStoneMappingFormat = filePrefix.get(FileIntegrationConstants.ITEM_STONE_MAPPING_JOB);
		String itemMaterialMappingFormat = filePrefix.get(FileIntegrationConstants.ITEM_MATERIAL_MAPPING_JOB);

		for (final File fileEntry : files) {
			// checking if already processed or not
			if (!fileEntry.isDirectory() && fileAuditService.checkIfAlreadyProcessed(fileEntry.getName(),
					getFileJobName(fileEntry.getName(), itemMasterFormat, stoneMasterFormat, priceMasterFormat,
							materailMasterFormat, itemStoneMappingFormat, itemMaterialMappingFormat),
					manualJob, localPath, localFailurePath, FileGroupEnum.ORACLE.toString())) {
				if (fileEntry.getName().startsWith(itemMasterFormat)) {
					itemMasterList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(stoneMasterFormat)) {
					stoneMasterList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(priceMasterFormat)) {
					priceMasterList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(materailMasterFormat)) {
					materialMasterList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(itemStoneMappingFormat)) {
					itemStoneMappingList.add(fileEntry.getName());
				} else if (fileEntry.getName().startsWith(itemMaterialMappingFormat)) {
					itemMaterialMappingList.add(fileEntry.getName());
				}
			}
		}
	}

	/**
	 * @param name
	 * @return
	 */
	private String getFileJobName(String fileName, String itemMasterFormat, String stoneMasterFormat,
			String priceMasterFormat, String materailMasterFormat, String itemStoneMappingFormat,
			String itemMaterialMappingFormat) {
		if (fileName.startsWith(itemMasterFormat)) {
			return FileMasterJobNameEnum.ITEM_MASTER.getValue();
		} else if (fileName.startsWith(stoneMasterFormat)) {
			return FileMasterJobNameEnum.STONE_MASTER.getValue();
		} else if (fileName.startsWith(priceMasterFormat)) {
			return FileMasterJobNameEnum.PRICE_MASTER.getValue();
		} else if (fileName.startsWith(materailMasterFormat)) {
			return FileMasterJobNameEnum.MATERIAL_MASTER.getValue();
		} else if (fileName.startsWith(itemStoneMappingFormat)) {
			return FileMasterJobNameEnum.ITEM_STONE_MAPPING.getValue();
		} else if (fileName.startsWith(itemMaterialMappingFormat)) {
			return FileMasterJobNameEnum.ITEM_MATERIAL_MAPPING.getValue();
		}
		return null;
	}

	private Map<String, String> getFilePrefix() {
		List<String> jobNames = Arrays.asList(FileMasterJobNameEnum.ITEM_MASTER.getValue(),
				FileMasterJobNameEnum.STONE_MASTER.getValue(), FileMasterJobNameEnum.MATERIAL_MASTER.getValue(),
				FileMasterJobNameEnum.PRICE_MASTER.getValue(), FileMasterJobNameEnum.ITEM_MATERIAL_MAPPING.getValue(),
				FileMasterJobNameEnum.ITEM_STONE_MAPPING.getValue());
		List<FileMasterDao> fileMasters = fileMasterRepository.findByFileNameIn(jobNames);

		Map<String, String> filePrefixMap = new HashMap<>();

		for (FileMasterDao fileMaster : fileMasters) {
			if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.ITEM_MASTER.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.ITEM_MASTER_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.STONE_MASTER.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.STONE_MASTER_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.PRICE_MASTER.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.PRICE_MASTER_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.MATERIAL_MASTER.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.MATERIAL_MASTER_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName().equalsIgnoreCase(FileMasterJobNameEnum.ITEM_STONE_MAPPING.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.ITEM_STONE_MAPPING_JOB, fileMaster.getFilePrefix());
			} else if (fileMaster.getFileName()
					.equalsIgnoreCase(FileMasterJobNameEnum.ITEM_MATERIAL_MAPPING.getValue())) {
				filePrefixMap.put(FileIntegrationConstants.ITEM_MATERIAL_MAPPING_JOB, fileMaster.getFilePrefix());
			}
		}
		return filePrefixMap;
	}

	private void sortFileNames(List<String> itemMasterList, List<String> stoneMasterList,
			List<String> materialMasterList, List<String> priceMasterList, List<String> itemStoneMappingList,
			List<String> itemMaterialMappingList) {
		CollectionUtil.sortList(itemMasterList);
		CollectionUtil.sortList(stoneMasterList);
		CollectionUtil.sortList(priceMasterList);
		CollectionUtil.sortList(itemStoneMappingList);
		CollectionUtil.sortList(materialMasterList);
		CollectionUtil.sortList(itemMaterialMappingList);
	}

	private void addCommonJobParams(Map<String, String> jobParam, String localPath, String localSuccessPath,
			String localFailurePath) {
		jobParam.put("sourcePath", localPath);
		jobParam.put("successPath", localSuccessPath);
		jobParam.put("faiurePath", localFailurePath);
	}
}
