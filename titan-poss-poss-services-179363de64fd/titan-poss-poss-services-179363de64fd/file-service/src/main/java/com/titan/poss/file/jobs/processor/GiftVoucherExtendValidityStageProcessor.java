/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GiftVoucherExtendValidityDto;
import com.titan.poss.file.dto.GiftVoucherExtendValidityIngestionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherExtendValidityStageProcessor implements ItemProcessor<GiftVoucherExtendValidityDto, GiftVoucherExtendValidityIngestionDto>, StepExecutionListener {
	
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
	public GiftVoucherExtendValidityIngestionDto process(GiftVoucherExtendValidityDto item) throws Exception {
		GiftVoucherExtendValidityIngestionDto giftVoucherExtendValidityIngestionDto = new GiftVoucherExtendValidityIngestionDto(); 
		giftVoucherExtendValidityIngestionDto.setSerialNo(item.getSerialNo());
		giftVoucherExtendValidityIngestionDto.setValidTill(item.getValidTill());
		giftVoucherExtendValidityIngestionDto.setFileAuditId(fileAuditId);
		giftVoucherExtendValidityIngestionDto.setCreatedBy(user);
		giftVoucherExtendValidityIngestionDto.setCreatedDate(CalendarUtils.getCurrentDate());
		giftVoucherExtendValidityIngestionDto.setLastModifiedBy(user);
		giftVoucherExtendValidityIngestionDto.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return giftVoucherExtendValidityIngestionDto;
	}



}
