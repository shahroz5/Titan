/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.PayerBankDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PayerBankIngestionProcessor implements ItemProcessor<PayerBankDto, PayerBankDto> {

	@Override
	public PayerBankDto process(PayerBankDto item) throws Exception {
		item.setBankName(item.getBankName());
		item.setIsActive(item.getIsActive());
		item.setCreatedBy(item.getCreatedBy());
		item.setCreatedDate(item.getCreatedDate());
		item.setLastModifiedBy(item.getLastModifiedBy());
		item.setLastModifiedDate(item.getLastModifiedDate());
		item.setSrcSyncId(0);
		item.setDestSyncId(0);
		return item;
	}

}
