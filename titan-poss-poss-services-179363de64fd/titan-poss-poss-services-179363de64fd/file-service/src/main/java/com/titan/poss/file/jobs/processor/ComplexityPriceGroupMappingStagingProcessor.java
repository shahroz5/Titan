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
import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.service.ComplexityPriceGroupMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ComplexityPriceGroupMappingStagingProcessor implements ItemProcessor<ComplexityPriceGroupConfigReaderDto, ComplexityPriceGroupConfigReaderDto>, StepExecutionListener {
    
	@Autowired
	private ComplexityPriceGroupMappingValidationService complexityPriceGroupMappingValidationService;

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
	public ComplexityPriceGroupConfigReaderDto process(ComplexityPriceGroupConfigReaderDto item) throws Exception {
       	item.setFileAuditId(fileAuditId);
       	item.setId(item.getId());
		item.setComplexitycode(checkIfNull(item.getComplexitycode()));
		item.setPricegroup(checkIfNull(item.getPricegroup()));
		//item.setIsActive(checkIfNull(item.getIsActive()));
		item.setMakingChargesPerUnit(item.getMakingChargesPerUnit());
		item.setMakingchargespergram(item.getMakingchargespergram());
		item.setWastagepercentage(item.getWastagepercentage());
		item.setMakingChargePercentage(item.getMakingChargePercentage());
		//item.setIsActive(item.getIsActive());
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return validateComplexityPriceGroupMapping(item);

	}

	private ComplexityPriceGroupConfigReaderDto validateComplexityPriceGroupMapping(ComplexityPriceGroupConfigReaderDto item) {
		if (complexityPriceGroupMappingValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}
	

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}
}