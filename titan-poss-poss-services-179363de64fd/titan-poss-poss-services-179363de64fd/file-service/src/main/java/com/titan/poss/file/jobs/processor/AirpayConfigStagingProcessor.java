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
import com.titan.poss.file.service.AirpayConfigValidationService;
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class AirpayConfigStagingProcessor
		implements ItemProcessor<AirpayConfigDto, AirpayConfigDto>, StepExecutionListener {

	@Autowired
	private AirpayConfigValidationService airpayConfigValidationService;

	private String fileAuditId;
	
	private String user;

	@Override
	public AirpayConfigDto process(AirpayConfigDto item) throws Exception {
		item.setLocationCode(checkIfNull(item.getLocationCode()));
		item.setMerchantId(checkIfNull(item.getMerchantId()));
		item.setUsername(checkIfNull(item.getUsername()));
		item.setPassword(checkIfNull(item.getPassword()));
		item.setSecretKey(checkIfNull(item.getSecretKey()));
		item.setSecretToken(checkIfNull(item.getSecretToken()));
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		
		return validateAirpayConfig(item);
	}

	private AirpayConfigDto validateAirpayConfig(AirpayConfigDto airpayConfigDto) {
		if (airpayConfigValidationService.dataValidation(airpayConfigDto)) {
			return airpayConfigDto;
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
