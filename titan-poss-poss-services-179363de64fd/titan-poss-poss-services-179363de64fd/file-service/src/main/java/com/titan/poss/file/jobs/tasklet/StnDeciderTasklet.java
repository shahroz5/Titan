/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.file.dao.DataAuditDao;
import com.titan.poss.file.dao.FileAuditDao;
import com.titan.poss.file.repository.DataAuditRepository;
import com.titan.poss.file.repository.FileAuditRepository;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.repository.StockTransferRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class StnDeciderTasklet implements Tasklet, StepExecutionListener {

	@Autowired
	private DataAuditRepository dataAuditRepository;

	@Autowired
	private FileAuditRepository fileAuditRepository;

	@Autowired
	private StockTransferRepository stockTransferRepository;

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
		String fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("stnFileAuditId");
		String fileName = stepExecution.getJobExecution().getJobParameters().getString("stnFileName");
		log.info("----------------fileName----------"+fileName);
		Integer stnNo = null;
		Short fiscalYear = null;
		String srcLocationCode = null;
		String productGroup = stepExecution.getJobExecution().getExecutionContext().getString("productGroup");
		if(Boolean.valueOf(stepExecution.getJobExecution().getJobParameters().getString("ibt"))) {
			String stn =  fileName.replaceAll("[^0-9]", "");
			stn = stn.replace(productGroup, "");
			String fiscalyear = stn.substring(stn.length()-4);
			stn = stn.replace(fiscalyear, "");
			stnNo = Integer.parseInt(stn);
			fiscalYear = Short.parseShort(fiscalyear);
			log.info("--------------fiscalyear-------------"+fiscalYear);
			log.info("------stn no---------"+stnNo);
			srcLocationCode = StringUtils.substringBefore(fileName, ".").split("[0-9]+")[1];
		}
		else {
			stnNo = Integer.parseInt(fileName.replaceAll("[^0-9]", ""));
		}
		int i = 0;
		while (i < fileName.length() && Character.isAlphabetic(fileName.charAt(i))) {
			i++;
		}
		String destLocationCode = fileName.substring(0, i);


		// checking if stn is already present in stock transfer table (it can be present
		// through api)
		List<StockTransferDao> stockTransferDao = stockTransferRepository.getStockTransfer(FileIntegrationConstants.TRANSFER_TYPE_BTQ_BTQ, destLocationCode, srcLocationCode, stnNo, productGroup, fiscalYear);
		StockTransferDao stockTransfer = stockTransferRepository.findByDestLocationCodeAndTransferTypeAndSrcDocNo(
				destLocationCode, FileIntegrationConstants.TRANSFER_TYPE_FAC_BTQ, stnNo);
		if (stockTransfer != null || (stockTransferDao!=null && !CollectionUtil.isEmpty(stockTransferDao))) {
			stepExecution.getJobExecution().getExecutionContext().put("alreadyPresent", "true");
			log.debug("Stn already present in stock transfer table. Moving file to failed folder");
			return ExitStatus.STOPPED;
		}

		// checking for error data
		List<DataAuditDao> dataAudits = dataAuditRepository.findByFileAuditFileIdAndErrorType(fileAuditId,
				ErrorTypeEnum.ERROR.toString());		
		Optional<FileAuditDao> fileAudit = fileAuditRepository.findById(fileAuditId);
		if (dataAudits.isEmpty() && fileAudit.isPresent()
				&& fileAudit.get().getStatus().equalsIgnoreCase(JobProcessStatusEnum.INPROGRESS.toString())) {
			return ExitStatus.COMPLETED;
		}
		stepExecution.getJobExecution().getExecutionContext().put("validationFailed", "true");
		log.debug("Stn validation has failed. Moving file to failed folder");
		return ExitStatus.STOPPED;
	}

}
