/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.PaymentHostnameMappingDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PaymentHostnameMappingIngestionProcessor implements ItemProcessor<PaymentHostnameMappingDto, PaymentHostnameMappingDto> {

	@Override
	public PaymentHostnameMappingDto process(PaymentHostnameMappingDto item) throws Exception {
		item.setId(item.getId());
		item.setLocationCode(item.getLocationCode());
		item.setHostName(item.getHostName());
		item.setDeviceId(item.getDeviceId());
		item.setPaymentCode(item.getPaymentCode());
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
