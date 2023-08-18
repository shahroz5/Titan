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
import com.titan.poss.file.dto.TaxConfigDto;
import com.titan.poss.file.service.TaxConfigValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaxConfigStagingProcessor implements ItemProcessor<TaxConfigDto, TaxConfigDto>, StepExecutionListener {
	 
		@Autowired
		private TaxConfigValidationService taxConfigDtoValidationService;

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
		public TaxConfigDto process(TaxConfigDto item) throws Exception {
			item.setTransactionType(checkIfNull(item.getTransactionType()));
			item.setSourceBtqType(checkIfNull(item.getSourceBtqType()));
			item.setDestinationBtqType(checkIfNull(item.getDestinationBtqType()));
			item.setCustomerType(checkIfNull(item.getCustomerType()));
			item.setSrcLocationApplicableTax(checkIfNull(item.getSrcLocationApplicableTax()));
			item.setDestLocationApplicableTax(checkIfNull(item.getDestLocationApplicableTax()));
			item.setCustomerApplicableTax(checkIfNull(item.getCustomerApplicableTax()));
			item.setIsSameState(checkIfNull(item.getIsSameState()));
			item.setIsSourceBtqTaxApplicable(item.getIsSourceBtqTaxApplicable());
			item.setApplicableTax(checkIfNull(checkIfNull(item.getApplicableTax())));
			item.setIsActive(checkIfNull(item.getIsActive()));
			item.setFileAuditId(fileAuditId);
			item.setCreatedBy(user);
			item.setCreatedDate(CalendarUtils.getCurrentDate());
			item.setLastModifiedBy(user);
			item.setLastModifiedDate(CalendarUtils.getCurrentDate());

			return validateTaxConfig(item);

		}

		private Boolean checkIfNull(Boolean value) {
			return !BooleanUtils.isTrue(value) && !BooleanUtils.isFalse(value) ? null :value;
		}

		private TaxConfigDto validateTaxConfig(TaxConfigDto item) {
			if (taxConfigDtoValidationService.dataValidation(item)) {
				return item;
			} else {
				return null;
			}
		}
		

		private String checkIfNull(String value) {
			return StringUtils.isEmpty(value) ? null : value;
		}
	}
