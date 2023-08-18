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
import com.titan.poss.file.dto.GepConfigExcludeMappingDto;
import com.titan.poss.file.service.GepConfigExcludeMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GepConfigExcludeMappingStagingProcessor
		implements ItemProcessor<GepConfigExcludeMappingDto, GepConfigExcludeMappingDto>, StepExecutionListener {

	@Autowired
	private GepConfigExcludeMappingValidationService gepConfigExcludeMappingValidationService;

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
	public GepConfigExcludeMappingDto process(GepConfigExcludeMappingDto item) throws Exception {
		item.setItemCode(checkIfNull(item.getItemCode()));
		item.setIsExcluded(item.getIsExcluded());
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validateGepConfigExcludeMapping(item);
	}

	private GepConfigExcludeMappingDto validateGepConfigExcludeMapping(GepConfigExcludeMappingDto item) {
		if (gepConfigExcludeMappingValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}

}