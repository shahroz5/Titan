/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GiftVoucherStatusUpdateDto;
import com.titan.poss.file.dto.GiftVoucherStatusUpdateIngestionDto;
import com.titan.poss.file.service.GiftVoucherStatusUpdateValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusUpdateStageProcessor
		implements ItemProcessor<GiftVoucherStatusUpdateDto, GiftVoucherStatusUpdateIngestionDto>, StepExecutionListener {

	@Autowired
	GiftVoucherStatusUpdateValidationService giftVoucherStatusUpdateValidationService;

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
	public GiftVoucherStatusUpdateIngestionDto process(GiftVoucherStatusUpdateDto item) throws Exception {
		GiftVoucherStatusUpdateIngestionDto giftVoucherStatusUpdateIngestionDto = new GiftVoucherStatusUpdateIngestionDto(); 
		giftVoucherStatusUpdateIngestionDto.setSerialNo(item.getSerialNo());
		giftVoucherStatusUpdateIngestionDto.setStatus(item.getStatus());
		giftVoucherStatusUpdateIngestionDto.setFileAuditId(fileAuditId);
		giftVoucherStatusUpdateIngestionDto.setCreatedBy(user);
		giftVoucherStatusUpdateIngestionDto.setCreatedDate(CalendarUtils.getCurrentDate());
		giftVoucherStatusUpdateIngestionDto.setLastModifiedBy(user);
		giftVoucherStatusUpdateIngestionDto.setLastModifiedDate(CalendarUtils.getCurrentDate());

		return validateGiftVoucherStatusUpdate(giftVoucherStatusUpdateIngestionDto);
	}

	private GiftVoucherStatusUpdateIngestionDto validateGiftVoucherStatusUpdate(
			GiftVoucherStatusUpdateIngestionDto giftVoucherStatusUpdateDto) {
		if (giftVoucherStatusUpdateValidationService.dataValidation(giftVoucherStatusUpdateDto)) {
			return giftVoucherStatusUpdateDto;
		} else {
			return null;
		}
	}

}
