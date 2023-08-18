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
import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.file.service.CardDetailsValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class CardDetailsStagingProcessor
		implements ItemProcessor<CardDetailsDto, CardDetailsDto>, StepExecutionListener{

	@Autowired
	private CardDetailsValidationService cardDetailsValidationService;

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
	public CardDetailsDto process(CardDetailsDto item) throws Exception {
		item.setCardNo(checkIfNull(item.getCardNo()));
		item.setIsActive(checkIfNull(item.getIsActive()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validateCardDetails(item);
	}

	private Boolean checkIfNull(Boolean isActive) {
		return !BooleanUtils.isTrue(isActive) && !BooleanUtils.isFalse(isActive) ? null :isActive; 
	}

	private CardDetailsDto validateCardDetails(CardDetailsDto item) {
		if (cardDetailsValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}

}