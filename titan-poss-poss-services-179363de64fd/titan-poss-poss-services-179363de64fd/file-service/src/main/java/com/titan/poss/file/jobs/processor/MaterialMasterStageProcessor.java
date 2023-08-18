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
import com.titan.poss.file.dto.MaterialMasterFileStageDto;
import com.titan.poss.file.dto.MaterialMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class MaterialMasterStageProcessor
		implements ItemProcessor<MaterialMasterFileStageDto, MaterialMasterStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yy";
	private String fileAuditId;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public MaterialMasterStageDto process(MaterialMasterFileStageDto materialMasterDto) throws Exception {
		try {
			MaterialMasterStageDto materialMasterStageDto = new MaterialMasterStageDto();
			materialMasterStageDto.setColor(checkIfNull(materialMasterDto.getColor().replace("'", "")));
			materialMasterStageDto.setMaterialCode(checkIfNull(materialMasterDto.getMaterialCode().replace("'", "")));
			materialMasterStageDto.setWeight(new BigDecimal(materialMasterDto.getWeight().replace("'", "")));
			materialMasterStageDto.setIsActive(getBooleanValue(materialMasterDto.getIsActive().replace("'", "")));
			materialMasterStageDto.setPrice(new BigDecimal(materialMasterDto.getPrice().replace("'", "")));
			materialMasterStageDto.setMaterialType(checkIfNull(materialMasterDto.getMaterialType().replace("'", "")));
			materialMasterStageDto.setLoginId(checkIfNull(materialMasterDto.getLoginId().replace("'", "")));
			materialMasterStageDto.setCreatedDate(CalendarUtils
					.convertStringToDate(materialMasterDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			materialMasterStageDto
					.setLastModifiedId(checkIfNull(materialMasterDto.getLastModifiedId().replace("'", "")));
			materialMasterStageDto.setLastModifiedDate(CalendarUtils
					.convertStringToDate(materialMasterDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			materialMasterStageDto.setStoneQuality(checkIfNull(materialMasterDto.getStoneQuality().replace("'", "")));
			materialMasterStageDto.setStoneShape(checkIfNull(materialMasterDto.getStoneShape().replace("'", "")));
			materialMasterStageDto
					.setStoneTepDiscount(new BigDecimal(materialMasterDto.getStoneTepDiscount().replace("'", "")));
			materialMasterStageDto.setRatePerGram(new BigDecimal(materialMasterDto.getRatePerGram().replace("'", "")));
			materialMasterStageDto.setFileAuditId(fileAuditId);
			materialMasterStageDto.setConfigDetails(getConfigDetails(materialMasterStageDto));

			return materialMasterStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(materialMasterDto.getMaterialCode(),
					MapperUtil.getJsonString(materialMasterDto), e.getMessage(), fileAuditId,
					ErrorTypeEnum.ERROR.toString());
			return null;
		}

	}

	private String getConfigDetails(MaterialMasterStageDto materialMasterDto) {

		Map<String, String> materialDetails = new HashMap<>();
		materialDetails.put("MaterialTEPDiscount", materialMasterDto.getStoneTepDiscount().toString());

		Map<String, Object> materialMasterObject = new LinkedHashMap<>();
		materialMasterObject.put("type", "CONFIG_DETAILS");
		materialMasterObject.put("data", materialDetails);
		return MapperUtil.getStringFromJson(materialMasterObject);
	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}

	private Boolean getBooleanValue(String input) {
		return input.equalsIgnoreCase("1");
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("materialMasterFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}
