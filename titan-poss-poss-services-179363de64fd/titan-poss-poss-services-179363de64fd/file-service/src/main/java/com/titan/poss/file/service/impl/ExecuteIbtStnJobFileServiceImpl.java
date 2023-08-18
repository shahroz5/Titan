/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
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
import com.titan.poss.file.config.ExecuteBatchJobs;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.factory.JobFactory;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.ExecuteJobService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.repository.StockTransferRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class ExecuteIbtStnJobFileServiceImpl implements ExecuteJobService {

	public ExecuteIbtStnJobFileServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.IBT_STN_JOB, this);
	}

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private StockTransferRepository stockTransferRepository;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String IBT_STN_LOCAL_OUTPUT_FOLDER = "ibt.stn.local.output.folder";

	private static final String IBT_STN_LOCAL_ENCRYPTED_FOLDER = "ibt.stn.local.encrypted.folder";

	private static final String IBT_STN_SFTP_OUTPUT_FOLDER = "sftp.ibt.stn.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {
		if (launchJobRequest.getJobParams() == null) {
			throw new ServiceException("Stock Transfer Id is required for ibt stn job", "ERR-FILE-020");
		}
		Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
		if (manualJob == null) {
			manualJob = "false";
		}
		Object scheduler = launchJobRequest.getJobParams().get("scheduler");
		if (scheduler != null && scheduler.toString().equalsIgnoreCase("true")) {
			// this is scheduler flow
			log.info("inside file ibt automatic scheduler ");
			List<String> inoviceStatuses = Arrays.asList(FileIntegrationConstants.ISSUED,
					FileIntegrationConstants.PUBLISHED);
			List<String> transferTypes = Arrays.asList(FileIntegrationConstants.TRANSFER_TYPE_BTQ_BTQ,
					FileIntegrationConstants.TRANSFER_TYPE_MER_BTQ);
			List<StockTransferDao> stockTransfers = stockTransferRepository.findByTransferTypeInAndFilePublishedAndIsDirectTransferAndStatusIn(
					transferTypes, false,true, inoviceStatuses);
			log.info("stockTransfers size {}",stockTransfers.size());
			stockTransfers.forEach(stockTransfer -> runIbtStnJob(launchJobRequest, stockTransfer));

		} else {
			log.info("inside file ibt manual scheduler ");
			// this flow is when user selects a return invoice
			Object stockTransferId = launchJobRequest.getJobParams().get("stockTransferId");
			if (stockTransferId == null) {
				throw new ServiceException("Stock Transfer Id is required for Ibt Stn job", "ERR-FILE-020");
			}
			Optional<StockTransferDao> stockTransfer = stockTransferRepository
					.findById(Integer.parseInt(stockTransferId.toString()));
			
			log.info("stockTransfer type and id  {} {} ",stockTransfer.get().getTransferType(),stockTransfer.get().getId());
			List<String> transferTypesStatus = Arrays.asList(FileIntegrationConstants.ISSUED,
					FileIntegrationConstants.PUBLISHED);
			if (!stockTransfer.isPresent()
					|| !stockTransfer.get().getTransferType()
							.equalsIgnoreCase(FileIntegrationConstants.TRANSFER_TYPE_BTQ_BTQ)
					|| !stockTransfer.get().getTransferType()
							.equalsIgnoreCase(FileIntegrationConstants.TRANSFER_TYPE_MER_BTQ) 
						  && !transferTypesStatus.contains(stockTransfer.get().getStatus())) {
				fileAuditService.updateFileAuditToFailedStatus(null, manualJob.toString(),
						FileIntegrationConstants.ERP_USER,
						"Stock transfer id is not present/transfer type is not BTQ_BTQ/MER_BTQ status is not ISSUED/PUBLISHED. ",
						null, null, FileMasterJobNameEnum.IBT_STN_JOB.getValue(),
						FileGroupEnum.ORACLE.toString());
			} else if (stockTransfer.get().getFilePublished()) {
				fileAuditService.updateFileAuditToFailedStatus(null, manualJob.toString(),
						FileIntegrationConstants.ERP_USER,
						"Ibt Stn file with stock transfer id: " + stockTransferId + "is already published. ", null,
						null, FileMasterJobNameEnum.IBT_STN_JOB.getValue(), FileGroupEnum.ORACLE.toString());
			}else if (BooleanUtils.isFalse(stockTransfer.get().getIsDirectTransfer())) {
				fileAuditService.updateFileAuditToFailedStatus(null, manualJob.toString(),
						FileIntegrationConstants.ERP_USER,
						"Stock transfer is not eligible for generate the file : " + stockTransferId , null,
						null, FileMasterJobNameEnum.IBT_STN_JOB.getValue(), FileGroupEnum.ORACLE.toString());
			} 
			else {
				runIbtStnJob(launchJobRequest, stockTransfer.get());
			}
		}

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_IBT_STN_JOB.toString());
		return response;
	}

	private void runIbtStnJob(LaunchJobRequest launchJobRequest, StockTransferDao stockTransfer) {

		launchJobRequest.getJobParams().put("stockTransferId", stockTransfer.getId().toString());
		JobExecution executeJob = executeBatchJobs.executeJob(launchJobRequest, false);

		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localPath = localFileBasePath + env.getProperty(IBT_STN_LOCAL_OUTPUT_FOLDER);
		String localEncryptedPath = localFileBasePath + env.getProperty(IBT_STN_LOCAL_ENCRYPTED_FOLDER);
		String sftpServerPath = env.getProperty(IBT_STN_SFTP_OUTPUT_FOLDER);

		// upload files to sftp server
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.IBT_STN_JOB.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.encryptOrdecryptFile(localPath, localEncryptedPath, "ENCRYPT");
			fileService.uploadFilesToSftpServer(sftpServerPath, localEncryptedPath);
			fileService.removeFile(localEncryptedPath);
		} else {
			fileService.uploadFilesToSftpServer(sftpServerPath, localPath);
			fileService.removeFile(localPath);
		}

		// changing the status to published in stock transfer after placing the file in
		// sftp server
		if (executeJob.getStatus().equals(BatchStatus.COMPLETED)) {
			stockTransfer.setFilePublished(true);
			stockTransferRepository.save(stockTransfer);

		}
	}

}
