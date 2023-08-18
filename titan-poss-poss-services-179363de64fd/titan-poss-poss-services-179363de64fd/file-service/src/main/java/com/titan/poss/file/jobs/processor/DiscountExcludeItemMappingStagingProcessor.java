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
import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;
import com.titan.poss.file.service.DiscountExcludeItemMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class DiscountExcludeItemMappingStagingProcessor
		implements ItemProcessor<DiscountExcludeItemMappingDto, DiscountExcludeItemMappingDto>, StepExecutionListener {

	@Autowired
	private DiscountExcludeItemMappingValidationService discountExcludeItemMappingValidationService;

	private String fileAuditId;

	private String user;

	private String discountId;

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");
		discountId = stepExecution.getJobParameters().getString("discountId");

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public DiscountExcludeItemMappingDto process(DiscountExcludeItemMappingDto item) throws Exception {
		item.setItemCode(checkIfNull(item.getItemCode()));
		item.setDiscountId(discountId);
		item.setIsExcluded(item.getIsExcluded());
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validateDiscountExcludeItemMapping(item);
	}

	private DiscountExcludeItemMappingDto validateDiscountExcludeItemMapping(DiscountExcludeItemMappingDto item) {
		if (discountExcludeItemMappingValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}

}
