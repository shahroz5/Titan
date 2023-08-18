/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.QcgcConfigDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.location.dao.LocationDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class QcgcConfigStagingProcessor implements ItemProcessor<QcgcConfigDto, QcgcConfigDto>, StepExecutionListener {

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	private String fileId;

	private String user;

	@Override
	public QcgcConfigDto process(QcgcConfigDto item) throws Exception {
		String locationCode = validateLocationCode(item.getLocationCode(), item, fileId);
		if (StringUtils.isEmpty(locationCode)) {
			return null;
		}
		String termimalId = validateTerminalId(item.getTerminalId(), item, fileId);
		if (StringUtils.isEmpty(termimalId)) {
			return null;
		}
		item.setFileId(fileId);
		item.setCreatedBy(user);
		item.setCreatedDate(CalendarUtils.getCurrentDate());
		item.setLastModifiedBy(user);
		item.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return item;
	}

	private String validateLocationCode(String locationCode, QcgcConfigDto item, String fileId) {
		if (StringUtils.isEmpty(locationCode)) {
			return null;
		} else if (!locationCode.matches(RegExConstants.LOCATION_CODE_REGEX)) {
			dataAuditService.saveDataAuditData(locationCode, MapperUtil.getJsonString(item),
					"Invalid location code: " + locationCode, fileId, ErrorTypeEnum.ERROR.toString());
			return null;
		} else {
			List<LocationDao> location = commonValidationService.getActiveLocations(Arrays.asList(locationCode), true);
			if (location == null || location.isEmpty()) {
				dataAuditService.saveDataAuditData(locationCode, MapperUtil.getJsonString(item),
						"location code: " + locationCode + " not present/active", fileId,
						ErrorTypeEnum.ERROR.toString());
				return null;
			}
		}
		return locationCode;
	}

	private String validateTerminalId(String terminalId, QcgcConfigDto item, String fileId) {
		if (!terminalId.matches(RegExConstants.QCGC_TERMINAL_ID_REGEX)) {
			dataAuditService.saveDataAuditData(item.getLocationCode(), MapperUtil.getJsonString(item),
					"Invalid terminal id: " + terminalId, fileId, ErrorTypeEnum.ERROR.toString());
			return null;
		}
		return terminalId;
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileId = stepExecution.getJobExecution().getJobParameters().getString("fileAuditId");
		user = stepExecution.getJobExecution().getJobParameters().getString("user");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
