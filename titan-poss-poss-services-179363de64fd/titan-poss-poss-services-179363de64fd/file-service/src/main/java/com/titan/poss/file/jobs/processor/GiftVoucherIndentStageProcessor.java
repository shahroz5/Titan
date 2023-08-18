/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.GiftDetailsDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.GiftVoucherIndentFileStageDto;
import com.titan.poss.file.dto.GiftVoucherIndentStageDto;
import com.titan.poss.payment.util.GiftStatusUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class GiftVoucherIndentStageProcessor
		implements ItemProcessor<GiftVoucherIndentFileStageDto, GiftVoucherIndentStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yy";

	private String fileAuditId;

	private int indentNo;

	@Override
	public GiftVoucherIndentStageDto process(GiftVoucherIndentFileStageDto giftVoucherIndentFileStageDto)
			throws Exception {
		GiftVoucherIndentStageDto giftVoucherIndentStageDto = new GiftVoucherIndentStageDto();
		giftVoucherIndentStageDto
				.setItemCode(checkIfNull(giftVoucherIndentFileStageDto.getItemCode().replace(",", "")));
		giftVoucherIndentStageDto
				.setGvSerialNo(new BigInteger(checkIfNullSetZero(giftVoucherIndentFileStageDto.getGvSerialNumber().replace(",", ""))));
		giftVoucherIndentStageDto
				.setIssuedTo(checkIfNull(giftVoucherIndentFileStageDto.getIssuedTo().replace(",", "")));
		giftVoucherIndentStageDto.setRegion(checkIfNull(giftVoucherIndentFileStageDto.getRegion().replace(",", "")));
		giftVoucherIndentStageDto
				.setCustomerName(checkIfNull(giftVoucherIndentFileStageDto.getCustomerName().replace(",", "")));
		giftVoucherIndentStageDto
				.setCustomerType(checkIfNull(giftVoucherIndentFileStageDto.getCustomerType().replace(",", "")));
		giftVoucherIndentStageDto
				.setDenomination(new BigDecimal(checkIfNullSetZero(giftVoucherIndentFileStageDto.getDenomination().replace(",", ""))));
		giftVoucherIndentStageDto
				.setQuantity(Integer.parseInt(giftVoucherIndentFileStageDto.getQuantity().replace(",", "")));
		giftVoucherIndentStageDto
				.setTotalValue(new BigDecimal(checkIfNullSetZero(giftVoucherIndentFileStageDto.getTotalValue().replace(",", ""))));
		giftVoucherIndentStageDto
				.setStatus(Integer.parseInt(giftVoucherIndentFileStageDto.getStatus().replace(",", "")));
		giftVoucherIndentStageDto.setIndentNo(indentNo);
		giftVoucherIndentStageDto.setGvCreationDate(CalendarUtils
				.convertStringToDate(giftVoucherIndentFileStageDto.getGvCreationDate().replace(",", ""), DATE_FORMAT));
		giftVoucherIndentStageDto
				.setLocationCode(checkIfNull(giftVoucherIndentFileStageDto.getLocationCode().replace(",", "")));
		giftVoucherIndentStageDto
				.setDiscount(new BigDecimal(checkIfNullSetZero(giftVoucherIndentFileStageDto.getDiscount().replace(",", ""))));
		giftVoucherIndentStageDto.setRemarks(checkIfNull(giftVoucherIndentFileStageDto.getRemarks().replace(",", "")));
		giftVoucherIndentStageDto
				.setExcludes(checkIfNull(giftVoucherIndentFileStageDto.getExcludes().replace(",", "")));
		giftVoucherIndentStageDto.setDiscountPercentage(
				checkIfEmptySetZeros(giftVoucherIndentFileStageDto.getDiscountPercentage().replace(",", "")));
		giftVoucherIndentStageDto
				.setValidityDays(Integer.parseInt(giftVoucherIndentFileStageDto.getValidityDays().replace(",", "")));
		giftVoucherIndentStageDto.setTransitionStatus(
				(GiftStatusUtil.getStatusdetails().get(giftVoucherIndentStageDto.getStatus()).toString()));
		GiftDetailsDto giftDetailsDto = new GiftDetailsDto();
		giftDetailsDto.setIssuedTo(giftVoucherIndentFileStageDto.getIssuedTo());
		giftDetailsDto.setCustomerName(giftVoucherIndentFileStageDto.getCustomerName());
		giftDetailsDto.setCustomerType(giftVoucherIndentFileStageDto.getCustomerType());
		giftDetailsDto.setDiscountPercentage(giftVoucherIndentStageDto.getDiscountPercentage());
		giftDetailsDto.setDiscount(giftVoucherIndentStageDto.getDiscount());
		giftVoucherIndentStageDto.setGiftDetails(MapperUtil.getJsonString(giftDetailsDto));
		giftVoucherIndentStageDto.setCreatedBy(FileIntegrationConstants.ERP_USER);
		giftVoucherIndentStageDto.setCreatedDate(CalendarUtils.getCurrentDate());
		giftVoucherIndentStageDto.setLastModifiedBy(FileIntegrationConstants.ERP_USER);
		giftVoucherIndentStageDto.setLastModifiedDate(CalendarUtils.getCurrentDate());
		giftVoucherIndentStageDto.setFileAuditId(fileAuditId);
		return giftVoucherIndentStageDto;
	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}
	
	private String checkIfNullSetZero(String input) {
		return StringUtils.isEmpty(input.trim()) ? "0" : input;
	}
	
	private BigDecimal checkIfEmptySetZeros(String input) {
		if(input == null || input.trim().isEmpty() || input.isEmpty()) {
			return BigDecimal.ZERO;			
		}
			return new BigDecimal(input);		
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("giftVoucherIndentSavedId");
		String fileName = stepExecution.getJobParameters()
				.getString(FileIntegrationConstants.GIFT_VOUCHER_INDENT_FILE_NAME);
		List<String> indentNoFromFileList = Arrays.stream(fileName.trim().split("_")).collect(Collectors.toList());
		indentNo = Integer.parseInt(indentNoFromFileList.get(1));
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
