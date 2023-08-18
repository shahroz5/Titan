/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.repository.StockInvoiceRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ExecuteReturnInvoiceJobFileServiceImpl implements ExecuteJobService {

	public ExecuteReturnInvoiceJobFileServiceImpl(JobFactory jobFactory) {
		jobFactory.registerJob(FileIntegrationConstants.RETURN_INVOICE_JOB, this);
	}

	@Autowired
	private ExecuteBatchJobs executeBatchJobs;

	@Autowired
	private StockInvoiceRepository stockInvoiceRepository;

	@Autowired
	private FileAuditService fileAuditService;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	private static final String RETURN_INV_LOCAL_OUTPUT_FOLDER = "return.invoice.local.output.folder";

	private static final String RETURN_INV_LOCAL_ENCRYPTED_FOLDER = "return.invoice.local.encrypted.folder";

	private static final String RETURN_INV_SFTP_OUTPUT_FOLDER = "sftp.return.invoice.path";

	@Override
	public SchedulerResponseDto triggerJob(LaunchJobRequest launchJobRequest) {
		if (launchJobRequest.getJobParams() == null) {
			throw new ServiceException("Invoice Id is required for return invoice job", "ERR-FILE-020");
		}
		Object manualJob = launchJobRequest.getJobParams().get(FileIntegrationConstants.MANUAL_JOB);
		if (manualJob == null) {
			manualJob = "false";
		}
		Object scheduler = launchJobRequest.getJobParams().get("scheduler");
		if (scheduler != null && scheduler.toString().equalsIgnoreCase("true")) {
			// this is scheduler flow
			List<String> inoviceStatuses = Arrays.asList(FileIntegrationConstants.ISSUED,
					FileIntegrationConstants.PUBLISHED);
			List<StockInvoiceDao> stockInvoices = stockInvoiceRepository.findByInvoiceTypeAndFilePublishedAndStatusIn(
					FileIntegrationConstants.TRANSFER_TYPE_BTQ_CFA, false, inoviceStatuses);
			stockInvoices.forEach(stockInvoice -> runReturnInvoiceJob(launchJobRequest, stockInvoice));

		} else {
			// this flow is when user selects a return invoice
			Object stockInvoiceId = launchJobRequest.getJobParams().get("stockInvoiceId");
			if (stockInvoiceId == null) {
				throw new ServiceException("Stock Invoice Id is required for return invoice job", "ERR-FILE-020");
			}
			Optional<StockInvoiceDao> stockInvoice = stockInvoiceRepository
					.findById(Integer.parseInt(stockInvoiceId.toString()));
			if (!stockInvoice.isPresent()
					|| !stockInvoice.get().getInvoiceType()
							.equalsIgnoreCase(FileIntegrationConstants.TRANSFER_TYPE_BTQ_CFA)
					|| !(stockInvoice.get().getStatus().equalsIgnoreCase(FileIntegrationConstants.ISSUED)
							|| stockInvoice.get().getStatus().equalsIgnoreCase(FileIntegrationConstants.PUBLISHED))) {
				fileAuditService.updateFileAuditToFailedStatus(null, manualJob.toString(),
						FileIntegrationConstants.ERP_USER,
						"Stock invoice id is not present/transfer type is not CFA_BTQ/status is not ISSUED/PUBLISHED. ",
						null, null, FileMasterJobNameEnum.RETURN_INVOICE_JOB.getValue(),
						FileGroupEnum.ORACLE.toString());
			} else if (stockInvoice.get().getFilePublished()) {
				fileAuditService.updateFileAuditToFailedStatus(null, manualJob.toString(),
						FileIntegrationConstants.ERP_USER,
						"Return invoice file with stock invoice id: " + stockInvoiceId + "is already published. ", null,
						null, FileMasterJobNameEnum.RETURN_INVOICE_JOB.getValue(), FileGroupEnum.ORACLE.toString());
			} else {
				runReturnInvoiceJob(launchJobRequest, stockInvoice.get());
			}
		}

		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		response.setCode(SchedulerCodeEnum.FILE_RETURN_INVOICE_JOB.toString());
		return response;
	}

	private void runReturnInvoiceJob(LaunchJobRequest launchJobRequest, StockInvoiceDao stockInvoice) {

		launchJobRequest.getJobParams().put("stockInvoiceId", stockInvoice.getId().toString());
		JobExecution executeJob = executeBatchJobs.executeJob(launchJobRequest, false);

		String localFileBasePath = env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER);
		String localPath = localFileBasePath + env.getProperty(RETURN_INV_LOCAL_OUTPUT_FOLDER);
		String localEncryptedPath = localFileBasePath + env.getProperty(RETURN_INV_LOCAL_ENCRYPTED_FOLDER);
		String sftpServerPath = env.getProperty(RETURN_INV_SFTP_OUTPUT_FOLDER);

		// upload files to sftp server
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.RETURN_INVOICE_JOB.getValue());
		if (fileMaster.getIsEncrypted()) {
			fileService.encryptOrdecryptFile(localPath, localEncryptedPath, "ENCRYPT");
			fileService.uploadFilesToSftpServer(sftpServerPath, localEncryptedPath);
			fileService.removeFile(localEncryptedPath);
		} else {
			fileService.uploadFilesToSftpServer(sftpServerPath, localPath);
			fileService.removeFile(localPath);
		}

		// changing the status to published in stock invoice after placing the file in
		// sftp server
		if (executeJob.getStatus().equals(BatchStatus.COMPLETED)) {
			// stockInvoice.setFilePublished(true);
			//stockInvoiceRepository.save(stockInvoice);
			stockInvoiceRepository.updateStockInvoiceFilePublished(true, stockInvoice.getId());

		}
	}

}
