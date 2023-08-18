/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.listener;

import org.springframework.batch.core.SkipListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.service.DataAuditService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class ComplexityPriceGroupMappingFailureListener implements SkipListener<ComplexityPriceGroupConfigReaderDto, ComplexityPriceGroupConfigReaderDto> {
	
	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public void onSkipInRead(Throwable t) {
		log.error("Encountered error on read", t);
	}

	@Override
	public void onSkipInWrite(ComplexityPriceGroupConfigReaderDto item, Throwable t) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(item.getComplexitycode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(t.getCause().toString());
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

	@Override
	public void onSkipInProcess(ComplexityPriceGroupConfigReaderDto item, Throwable t) {
		log.error("Encountered error on process", t);
	}

}
