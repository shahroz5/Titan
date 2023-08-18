/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;
import com.titan.poss.payment.util.GiftStatusUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusUpdateIngestionProcessor
		implements ItemProcessor<GiftVoucherStatusUpdateIngestionDto, GiftVoucherStatusUpdateIngestionDto> {

	@Override
	public GiftVoucherStatusUpdateIngestionDto process(GiftVoucherStatusUpdateIngestionDto item) throws Exception {
		GiftVoucherStatusUpdateIngestionDto giftVoucherStatusUpdateIngestionDto = new GiftVoucherStatusUpdateIngestionDto();
		giftVoucherStatusUpdateIngestionDto.setSerialNo(item.getSerialNo());
		giftVoucherStatusUpdateIngestionDto
				.setStatus(GiftStatusUtil.getStatusdetails().get(Integer.parseInt(item.getStatus())).toString());
		giftVoucherStatusUpdateIngestionDto.setFileAuditId(item.getFileAuditId());
		giftVoucherStatusUpdateIngestionDto.setCreatedBy(item.getCreatedBy());
		giftVoucherStatusUpdateIngestionDto.setCreatedDate(item.getCreatedDate());
		giftVoucherStatusUpdateIngestionDto.setLastModifiedBy(item.getLastModifiedBy());
		giftVoucherStatusUpdateIngestionDto.setLastModifiedDate(item.getLastModifiedDate());
		return giftVoucherStatusUpdateIngestionDto;

	}

}
