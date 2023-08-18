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
import com.titan.poss.file.dto.PaymentHostnameMappingDto;
import com.titan.poss.file.service.PaymentHostnameMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PaymentHostnameMappingStagingProcessor implements ItemProcessor<PaymentHostnameMappingDto, PaymentHostnameMappingDto>, StepExecutionListener {

	@Autowired
	private PaymentHostnameMappingValidationService paymentHostnameMappingValidationService;

	private String fileAuditId;
	
	private String paymentCode;
	
	private String user;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");
		paymentCode = stepExecution.getJobExecution().getJobParameters().getString("paymentCode");

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public PaymentHostnameMappingDto process(PaymentHostnameMappingDto item) throws Exception {
		item.setLocationCode(checkIfNull(item.getLocationCode()));
		item.setHostName(checkIfNull(item.getHostName()));
		item.setDeviceId(checkIfNull(item.getDeviceId()));
		item.setPaymentCode(checkIfNull(item.getPaymentCode()));
		item.setIsActive(checkIfNull(item.getIsActive()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validatePaymentHostnameMapping(item);

	}

	
	private Boolean checkIfNull(Boolean isActive) {
		return !BooleanUtils.isTrue(isActive) && !BooleanUtils.isFalse(isActive) ? null :isActive; 
	}

	private PaymentHostnameMappingDto validatePaymentHostnameMapping(PaymentHostnameMappingDto item) {
		if (paymentHostnameMappingValidationService.dataValidation(item, paymentCode)) {
			return item;
		} else {
			return null;
		}
	}
	

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}
}
