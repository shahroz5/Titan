/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;

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
import com.titan.poss.file.dto.PriceMasterFileStageDto;
import com.titan.poss.file.dto.PriceMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PriceMasterStageProcessor
		implements ItemProcessor<PriceMasterFileStageDto, PriceMasterStageDto>, StepExecutionListener {

	private static final String DATE_FORMAT = "dd-MMM-yyyy";
	private String fileAuditId;

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public PriceMasterStageDto process(PriceMasterFileStageDto priceMasterDto) throws Exception {
		try {
			PriceMasterStageDto priceMasterStageDto = new PriceMasterStageDto();
			priceMasterStageDto.setItemCode(checkIfNull(priceMasterDto.getItemCode().replace("'", "")));
			priceMasterStageDto.setMakingCharges(new BigDecimal(priceMasterDto.getMakingCharges().replace("'", "")));
			priceMasterStageDto.setPriceGroup(checkIfNull(priceMasterDto.getPriceGroup().replace("'", "")));
			priceMasterStageDto.setLoginId(checkIfNull(priceMasterDto.getLoginId().replace("'", "")));
			priceMasterStageDto.setCreatedDate(
					CalendarUtils.convertStringToDate(priceMasterDto.getCreatedDate().replace("'", ""), DATE_FORMAT));
			priceMasterStageDto.setLastModifiedId(checkIfNull(priceMasterDto.getLastModifiedId().replace("'", "")));
			priceMasterStageDto.setLastModifiedDate(CalendarUtils
					.convertStringToDate(priceMasterDto.getLastModifiedDate().replace("'", ""), DATE_FORMAT));
			priceMasterStageDto.setFileAuditId(fileAuditId);
			return priceMasterStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(priceMasterDto.getItemCode(), MapperUtil.getJsonString(priceMasterDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}

	}

	private String checkIfNull(String input) {
		return StringUtils.isEmpty(input.trim()) ? null : input;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("priceMasterFileAuditId");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}
}