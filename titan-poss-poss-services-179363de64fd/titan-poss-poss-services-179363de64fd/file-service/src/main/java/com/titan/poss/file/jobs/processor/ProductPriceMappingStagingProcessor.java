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
import com.titan.poss.file.dto.ProductPriceMappingDto;
import com.titan.poss.file.service.ProductPriceMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ProductPriceMappingStagingProcessor implements ItemProcessor<ProductPriceMappingDto, ProductPriceMappingDto>, StepExecutionListener {
    
	@Autowired
	private ProductPriceMappingValidationService productPriceMappingValidationService;

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
	public ProductPriceMappingDto process(ProductPriceMappingDto item) throws Exception {
		item.setProductGroupCode(checkIfNull(item.getProductGroupCode()));
		item.setFromBand(item.getFromBand());
		item.setToBand(item.getToBand());
		item.setFromPrice(item.getFromPrice());
		item.setToPrice(item.getToPrice());
		item.setMargin(item.getMargin());
		item.setFileAuditId(fileAuditId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());

		return validateProductPriceMapping(item);

	}

	private ProductPriceMappingDto validateProductPriceMapping(ProductPriceMappingDto item) {
		if (productPriceMappingValidationService.dataValidation(item)) {
			return item;
		} else {
			return null;
		}
	}
	

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}
}