/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.RazorpayConfigDto;
import com.titan.poss.file.service.RazorpayConfigValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class RazorpayConfigStagingProcessor
		implements ItemProcessor<RazorpayConfigDto, RazorpayConfigDto>, StepExecutionListener {

	@Autowired
	private RazorpayConfigValidationService razorpayConfigValidationService;

	private String fileAuditId;
	
	private String user;

	@Override
	public RazorpayConfigDto process(RazorpayConfigDto item) throws Exception {
		item.setLocationCode(checkIfNull(item.getLocationCode()));
		item.setAccountId(checkIfNull(item.getAccountId()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		
		return validateAirpayConfig(item);
	}

	private RazorpayConfigDto validateAirpayConfig(RazorpayConfigDto razorpayConfigDto) {
		if (razorpayConfigValidationService.dataValidation(razorpayConfigDto)) {
			return razorpayConfigDto;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;

	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
