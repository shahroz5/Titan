/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherExtendValidityIngestionProcessor implements ItemProcessor<GiftVoucherExtendValidityIngestionDto, GiftVoucherExtendValidityIngestionDto>  {
   
	@Override
	public GiftVoucherExtendValidityIngestionDto process(GiftVoucherExtendValidityIngestionDto item) throws Exception {
		GiftVoucherExtendValidityIngestionDto giftVoucherExtendValidityDto = new GiftVoucherExtendValidityIngestionDto();
		giftVoucherExtendValidityDto.setSerialNo(item.getSerialNo());
		giftVoucherExtendValidityDto.setValidTill(item.getValidTill());
		giftVoucherExtendValidityDto.setFileAuditId(item.getFileAuditId());
		giftVoucherExtendValidityDto.setCreatedBy(item.getCreatedBy());
		giftVoucherExtendValidityDto.setCreatedDate(item.getCreatedDate());
		giftVoucherExtendValidityDto.setLastModifiedBy(item.getLastModifiedBy());
		giftVoucherExtendValidityDto.setLastModifiedDate(item.getLastModifiedDate());
		return giftVoucherExtendValidityDto;

	}

}

