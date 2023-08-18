/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

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
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.ExecuteJobService;
import com.titan.poss.file.service.FileService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ExecuteDebitNoteJobServiceImpl implements ExecuteJobService {

	public ExecuteDebitNoteJobServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.DEBIT_NOTE_JOB, this);
	}
	
	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String DEBIT_NOTE_LOCAL_FILE_PATH = "debit.note.completed.path";

	private static final String DEBIT_NOTE_LOCAL_ENCRYPTED_PATH = "debit.note.encrypted.path";

	private static final String DEBIT_NOTE_SFTP_SERVER_PATH = "sftp.debit.note.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {
		executeBatchJobs.executeJob(launchJobRequest, false);

		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localPath = localFileBasePath + env.getProperty(DEBIT_NOTE_LOCAL_FILE_PATH);
		String sftpServerPath = env.getProperty(DEBIT_NOTE_SFTP_SERVER_PATH);
		String localEncryptedPath = localFileBasePath + env.getProperty(DEBIT_NOTE_LOCAL_ENCRYPTED_PATH);

		// upload files to sftp server
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.DEBIT_NOTE_JOB.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.encryptOrdecryptFile(localPath, localEncryptedPath, "ENCRYPT");
			fileService.uploadFilesToSftpServer(sftpServerPath, localEncryptedPath);
			fileService.removeFile(localEncryptedPath);
		} else {
			fileService.uploadFilesToSftpServer(sftpServerPath, localPath);
			fileService.removeFile(localPath);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_DEBIT_NOTE_JOB.toString());
		return response;
	}

}
