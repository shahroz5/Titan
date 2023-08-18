/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.TaxConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class TaxConfigIngestionProcessor implements ItemProcessor<TaxConfigDto, TaxConfigDto> {

	@Override
	public TaxConfigDto process(TaxConfigDto item) throws Exception {
		item.setId(item.getId());
		item.setTransactionType(item.getTransactionType());
		item.setSourceBtqType(item.getSourceBtqType());
		item.setDestinationBtqType(item.getDestinationBtqType());
		item.setCustomerType(item.getCustomerType());
		item.setSrcLocationApplicableTax(item.getSrcLocationApplicableTax());
		item.setDestLocationApplicableTax(item.getDestLocationApplicableTax());
		item.setCustomerApplicableTax(item.getCustomerApplicableTax());
		item.setIsSameState(item.getIsSameState());
		item.setIsSourceBtqTaxApplicable(item.getIsSourceBtqTaxApplicable());
		item.setApplicableTax(item.getApplicableTax());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setIsActive(item.getIsActive());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

}
