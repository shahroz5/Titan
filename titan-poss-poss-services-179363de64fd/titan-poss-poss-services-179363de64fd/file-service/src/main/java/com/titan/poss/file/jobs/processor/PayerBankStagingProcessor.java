/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.PayerBankDto;
import com.titan.poss.file.service.PayerBankValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PayerBankStagingProcessor implements ItemProcessor<PayerBankDto, PayerBankDto>, StepExecutionListener {

	@Autowired
	private PayerBankValidationService payerBankValidationService;

	private String fileAuditId;
	
	private String user;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public PayerBankDto process(PayerBankDto item) throws Exception {

		item.setBankName(checkIfNull(item.getBankName()));
		item.setIsActive(checkIfNull(item.getIsActive()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());

		return validatePayerBank(item);

	}

	private Boolean checkIfNull(Boolean isActive) {
		return !BooleanUtils.isTrue(isActive) && !BooleanUtils.isFalse(isActive) ? null :isActive;
	}

	private PayerBankDto validatePayerBank(PayerBankDto item) {
		if (payerBankValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}
	

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}
}
