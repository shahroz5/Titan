/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;
import com.titan.poss.file.service.ItemGroupLevelDiscountValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemGroupLevelDiscountStagingProcessor
		implements ItemProcessor<ItemGroupLevelDiscountDto, ItemGroupLevelDiscountDto>, StepExecutionListener {

	@Autowired
	private ItemGroupLevelDiscountValidationService itemGroupLevelDiscountValidationService;

	private String fileAuditId;

	private String discount;

	private String user;

	private static final String DATE_FORMAT = "dd-MMM-yy";

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");
		discount = stepExecution.getJobExecution().getJobParameters().getString("discount");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

	@Override
	public ItemGroupLevelDiscountDto process(ItemGroupLevelDiscountDto itemStage) throws Exception {
		ItemGroupLevelDiscountDto item = new ItemGroupLevelDiscountDto();
		item.setDiscountCode(itemStage.getDiscountCode());
		item.setLocationCode(checkIfNull(itemStage.getLocationCode()));
		item.setItemCode(itemStage.getItemCode());
		item.setLotNumber(itemStage.getLotNumber());
		item.setIsPreviewApplicable(checkIfNull(itemStage.getIsPreviewApplicable()));
		item.setRegularF1IsPercent(checkIfNull(itemStage.getRegularF1IsPercent()));
		item.setRegularF2IsPercent(checkIfNull(itemStage.getRegularF2IsPercent()));
		item.setRegularIsGrossWeight(checkIfNull(itemStage.getRegularIsGrossWeight()));
		item.setRegularUcpIsPercent(checkIfNull(itemStage.getRegularUcpIsPercent()));
		item.setRegularVIsPercent(checkIfNull(itemStage.getRegularVIsPercent()));

		item.setPreviewF1IsPercent(checkIfNull(itemStage.getPreviewF1IsPercent()));
		item.setPreviewF2IsPercent(checkIfNull(itemStage.getPreviewF2IsPercent()));
		item.setPreviewIsGrossWeight(checkIfNull(itemStage.getPreviewIsGrossWeight()));
		item.setPreviewUcpIsPercent(checkIfNull(itemStage.getPreviewUcpIsPercent()));
		item.setPreviewVIsPercent(checkIfNull(itemStage.getPreviewVIsPercent()));

		item.setRegularStartDate(itemStage.getRegularStartDate());
		item.setRegularEndDate(itemStage.getRegularEndDate());
		item.setRegularF1Value(itemStage.getRegularF1Value());
		item.setRegularF2Value(itemStage.getRegularF2Value());
		item.setRegularUcpValue(itemStage.getRegularUcpValue());
		item.setRegularVValue(itemStage.getRegularVValue());
		item.setRegularWeightValue(itemStage.getRegularWeightValue());

		item.setPreviewStartDate(itemStage.getPreviewStartDate());
		item.setPreviewEndDate(itemStage.getPreviewEndDate());
		item.setPreviewF1Value(itemStage.getPreviewF1Value());
		item.setPreviewF2Value(itemStage.getPreviewF2Value());
		item.setPreviewUcpValue(itemStage.getPreviewUcpValue());
		item.setPreviewVValue(itemStage.getPreviewVValue());
		item.setPreviewWeightValue(itemStage.getPreviewWeightValue());

		item.setIsTransferredLocation(itemStage.getIsTransferredLocation());
		item.setIsActive(checkIfNull(itemStage.getIsActive()));
		item.setFileAuditId(fileAuditId);
		item.setLoginId(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedId(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return validateItemGroupLevelDiscount(item);
	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	private Boolean checkIfNull(Boolean value) {
		return !BooleanUtils.isTrue(value) && !BooleanUtils.isFalse(value) ? null : value;
	}

	private ItemGroupLevelDiscountDto validateItemGroupLevelDiscount(ItemGroupLevelDiscountDto item) {
		if (itemGroupLevelDiscountValidationService.dataValidation(item, discount)) {
			return item;
		} else {
			return null;
		}
	}

	private String checkIfNull(String value) {
		return StringUtils.isEmpty(value) ? null : value;
	}

}
