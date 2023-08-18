/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.SchedulerMasterResponseDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.integration.dto.SchedulerAuditResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface SchedulerService {

	void runManualScheduler(String code, Date currentDate);

	void triggerSchedulers();

	void updateCronExpression(String code, String cronExpression, boolean isActive);

	PagedRestResponse<List<SchedulerMasterResponseDto>> getSchedulerData(Pageable pageable, Date businessDate,
			List<String> schedulerCodes);

	PagedRestResponse<List<SchedulerAuditResponseDto>> getSchedulerAuditData(Pageable pageable, String schedulerCode);

}
