/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.StoneMasterFileStageDto;
import com.titan.poss.file.dto.StoneMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StoneMasterStageProcessor
		implements ItemProcessor<StoneMasterFileStageDto, StoneMasterStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yy";
	private String fileAuditId;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public StoneMasterStageDto process(StoneMasterFileStageDto stoneMasterDto) throws Exception {
		try {
			StoneMasterStageDto stoneMasterStageDto = new StoneMasterStageDto();
			stoneMasterStageDto.setColor(checkIfNull(stoneMasterDto.getColor().replace("'", "")));
			stoneMasterStageDto.setStoneCode(checkIfNull(stoneMasterDto.getStoneCode().replace("'", "")));
			stoneMasterStageDto.setWeight(new BigDecimal(stoneMasterDto.getWeight().replace("'", "")));
			stoneMasterStageDto.setIsActive(getBooleanValue(stoneMasterDto.getIsActive().replace("'", "")));
			stoneMasterStageDto.setPrice(new BigDecimal(stoneMasterDto.getPrice().replace("'", "")));
			stoneMasterStageDto.setStoneTypeCode(checkIfNull(stoneMasterDto.getStoneTypeCode().replace("'", "")));
			stoneMasterStageDto.setLoginId(checkIfNull(stoneMasterDto.getLoginId().replace("'", "")));
			stoneMasterStageDto.setCreatedDate(
					CalendarUtils.convertStringToDate(stoneMasterDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			stoneMasterStageDto.setLastModifiedId(checkIfNull(stoneMasterDto.getLastModifiedId().replace("'", "")));
			stoneMasterStageDto.setLastModifiedDate(CalendarUtils
					.convertStringToDate(stoneMasterDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			stoneMasterStageDto.setStoneQuality(checkIfNull(stoneMasterDto.getStoneQuality().replace("'", "")));
			stoneMasterStageDto.setStoneShape(checkIfNull(stoneMasterDto.getStoneShape().replace("'", "")));
			stoneMasterStageDto
					.setStoneTepDiscount(new BigDecimal(stoneMasterDto.getStoneTepDiscount().replace("'", "")));
			stoneMasterStageDto.setRatePerCarat(new BigDecimal(stoneMasterDto.getRatePerCarat().replace("'", "")));
			stoneMasterStageDto.setFileAuditId(fileAuditId);
			stoneMasterStageDto.setConfigDetails(getConfigDetails(stoneMasterStageDto));
			return stoneMasterStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(stoneMasterDto.getStoneCode(), MapperUtil.getJsonString(stoneMasterDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}
	}

	private String getConfigDetails(StoneMasterStageDto item) {
		Map<String, String> stoneDetails = new HashMap<>();
		stoneDetails.put("StoneTEPDiscount", item.getStoneTepDiscount().toString());

		Map<String, Object> stoneMasterObject = new LinkedHashMap<>();
		stoneMasterObject.put("type", "CONFIG_DETAILS");
		stoneMasterObject.put("data", stoneDetails);
		return MapperUtil.getStringFromJson(stoneMasterObject);
	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("stoneMasterFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}