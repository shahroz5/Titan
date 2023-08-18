/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.List;
import java.util.Optional;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.file.dao.DataAuditDao;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.repository.DataAuditRepository;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.repository.StockInvoiceRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class InvoiceDeciderTasklet implements Tasklet, StepExecutionListener {

	@Autowired
	private DataAuditRepository dataAuditRepository;

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private StockInvoiceRepository stockInvoiceRepository;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		// default method ignored
		return null;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		// default method ignored

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {

		String fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("invoiceFileAuditId");
		String fileName = stepExecution.getJobExecution().getJobParameters().getString("invoiceFileName");
		String sequenceNoString = fileName.replaceAll("[^0-9]", "");
		Integer invoiceNo = Integer.parseInt(sequenceNoString.substring(2, sequenceNoString.length()));
		String destLocationCode = fileName.substring(fileName.indexOf('_') + 1, fileName.indexOf('.'));

		// checking if invoice is already present in stock invoice table (it can be
		// present through api)
		StockInvoiceDao stockInvoice = stockInvoiceRepository.findByDestLocationCodeAndInvoiceTypeAndSrcDocNo(
				destLocationCode, FileIntegrationConstants.TRANSFER_TYPE_CFA_BTQ, invoiceNo);
		if (stockInvoice != null) {
			stepExecution.getJobExecution().getExecutionContext().put("alreadyPresent", "true");
			log.debug("Invoice already present in stock Invoice table. Moving file to failed folder");
			return ExitStatus.STOPPED;
		}

		List<DataAuditDao> dataAudits = dataAuditRepository.findByFileAuditFileIdAndErrorType(fileAuditId,
				ErrorTypeEnum.ERROR.toString());
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileAuditId);
		if (dataAudits.isEmpty() && fileAudit.isPresent()
				&& fileAudit.get().getStatus().equalsIgnoreCase(JobProcessStatusEnum.INPROGRESS.toString())) {
			return ExitStatus.COMPLETED;
		}
		stepExecution.getJobExecution().getExecutionContext().put("validationFailed", "true");
		log.debug("Invoice validation has failed. Moving file to failed folder");
		return ExitStatus.STOPPED;
	}

}
