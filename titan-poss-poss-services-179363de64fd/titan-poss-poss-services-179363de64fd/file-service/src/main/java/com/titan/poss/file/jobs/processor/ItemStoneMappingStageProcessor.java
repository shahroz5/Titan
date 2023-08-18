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

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemStoneFileStageDto;
import com.titan.poss.file.dto.ItemStoneStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ItemStoneMappingStageProcessor
		implements ItemProcessor<ItemStoneFileStageDto, ItemStoneStageDto>, StepExecutionListener {

	@Autowired
	private DataAuditService dataAuditService;

	private static final String DATE_FORMAT = "dd-MMM-yyyy";
	private String fileAuditId;

	@Override
	public ItemStoneStageDto process(ItemStoneFileStageDto itemStonDto) throws Exception {
		try {
			ItemStoneStageDto itemStoneStageDto = new ItemStoneStageDto();
			itemStoneStageDto.setItemCode(itemStonDto.getItemCode().replace("'", ""));
			itemStoneStageDto.setNoOfStones(Integer.parseInt(itemStonDto.getNoOfStones().replace("'", "")));
			itemStoneStageDto.setStoneCode(itemStonDto.getStoneCode().replace("'", ""));
			itemStoneStageDto.setIsActive(getBooleanValue(itemStonDto.getIsActive().replace("'", "")));
			itemStoneStageDto.setLoginId(itemStonDto.getLoginId().replace("'", ""));
			itemStoneStageDto.setCreatedDate(
					CalendarUtils.convertStringToDate(itemStonDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			itemStoneStageDto.setLastModifiedId(itemStonDto.getLastModifiedId().replace("'", ""));
			itemStoneStageDto.setLastModifiedDate(
					CalendarUtils.convertStringToDate(itemStonDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			itemStoneStageDto.setFileAuditId(fileAuditId);
			return itemStoneStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(itemStonDto.getItemCode(), MapperUtil.getJsonString(itemStonDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}

	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("itemStoneMappingFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}
