/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemMaterialFileStageDto;
import com.titan.poss.file.dto.ItemMaterialStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ItemMaterialMappingStageProcessor
		implements ItemProcessor<ItemMaterialFileStageDto, ItemMaterialStageDto>, StepExecutionListener {

	private String fileAuditId;

	private static final String DATE_FORMAT = "dd-MMM-yyyy";

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public ItemMaterialStageDto process(ItemMaterialFileStageDto itemMaterialDto) throws Exception {

		try {
			ItemMaterialStageDto itemMaterialStageDto = new ItemMaterialStageDto();
			itemMaterialStageDto.setItemCode(itemMaterialDto.getItemCode().replace("'", ""));
			itemMaterialStageDto
					.setNoOfOtherItem(new BigDecimal((itemMaterialDto.getNoOfOtherItem().replace("'", ""))));
			itemMaterialStageDto.setMaterialCode(itemMaterialDto.getMaterialCode().replace("'", ""));
			itemMaterialStageDto.setIsActive(getBooleanValue(itemMaterialDto.getIsActive().replace("'", "")));
			itemMaterialStageDto.setLoginId(itemMaterialDto.getLoginId().replace("'", ""));
			itemMaterialStageDto.setCreatedDate(
					CalendarUtils.convertStringToDate(itemMaterialDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			itemMaterialStageDto.setLastModifiedId(itemMaterialDto.getLastModifiedId().replace("'", ""));
			itemMaterialStageDto.setLastModifiedDate(CalendarUtils
					.convertStringToDate(itemMaterialDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			itemMaterialStageDto.setFileAuditId(fileAuditId);
			return itemMaterialStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(itemMaterialDto.getItemCode(), MapperUtil.getJsonString(itemMaterialDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}

	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("itemMaterialMappingFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}
