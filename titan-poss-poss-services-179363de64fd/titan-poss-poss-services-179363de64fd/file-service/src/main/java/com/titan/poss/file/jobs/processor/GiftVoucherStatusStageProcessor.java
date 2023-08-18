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
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GiftVoucherStatusFileStageDto;
import com.titan.poss.file.dto.GiftVoucherStatusStageDto;
import com.titan.poss.payment.util.GiftStatusUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherStatusStageProcessor
		implements ItemProcessor<GiftVoucherStatusFileStageDto, GiftVoucherStatusStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yy";

	private String fileAuditId;

	@Override
	public GiftVoucherStatusStageDto process(GiftVoucherStatusFileStageDto giftVoucherStatusFileStageDto)
			throws Exception {
		GiftVoucherStatusStageDto giftVoucherStatusStageDto = new GiftVoucherStatusStageDto();
		giftVoucherStatusStageDto
				.setGvSerialNo(Integer.parseInt(giftVoucherStatusFileStageDto.getGvSerialNumber().replace(",", "")));
		giftVoucherStatusStageDto
				.setGvStatus(Integer.parseInt(giftVoucherStatusFileStageDto.getGvStatus().replace(",", "")));
		giftVoucherStatusStageDto.setValidFrom(CalendarUtils.convertStringToDate(
				checkIfNull(giftVoucherStatusFileStageDto.getValidFrom().replace(",", "")), DATE_FORMAT));
		giftVoucherStatusStageDto.setValidTill(CalendarUtils.convertStringToDate(
				checkIfNull(giftVoucherStatusFileStageDto.getValidTill().replace(",", "")), DATE_FORMAT));
		giftVoucherStatusStageDto
				.setValidityDays(Integer.parseInt(giftVoucherStatusFileStageDto.getValidityDays().replace(",", "")));
		giftVoucherStatusStageDto.setActBlockedDate(CalendarUtils.convertStringToDate(
				checkIfNull(giftVoucherStatusFileStageDto.getActBlockedDateActivatedOn().replace("", "")),
				DATE_FORMAT));
		giftVoucherStatusStageDto.setTransitionStatus((GiftStatusUtil.getStatusdetails().get(giftVoucherStatusStageDto.getGvStatus()).toString()));
		giftVoucherStatusStageDto.setCreatedBy(FileIntegrationConstants.ERP_USER);
		giftVoucherStatusStageDto.setCreatedDate(CalendarUtils.getCurrentDate());
		giftVoucherStatusStageDto.setLastModifiedBy(FileIntegrationConstants.ERP_USER);
		giftVoucherStatusStageDto.setLastModifiedDate(CalendarUtils.getCurrentDate());
		giftVoucherStatusStageDto.setFileAuditId(fileAuditId);
		
		return giftVoucherStatusStageDto;
	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("giftVoucherStatusSavedId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
