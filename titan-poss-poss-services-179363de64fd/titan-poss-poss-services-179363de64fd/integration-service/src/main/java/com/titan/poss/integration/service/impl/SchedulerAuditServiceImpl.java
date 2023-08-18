/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.integration.intg.repository.SchedulerAuditRepository;
import com.titan.poss.integration.service.SchedulerAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class SchedulerAuditServiceImpl implements SchedulerAuditService {

	@Autowired
	private SchedulerAuditRepository schedulerAuditReepository;

	@Value("${clear.scheduler.audit.days:7}")
	private Integer clearSchedulerAuditDays;

	@Override
	@Transactional
	public SchedulerResponseDto deleteOldSchedulerAuditData() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(CalendarUtils.getCurrentDate());
		// Decrementing days by configured days
		cal.add(Calendar.DATE, -clearSchedulerAuditDays);
		schedulerAuditReepository.deleteSchedulerAudit(cal.getTime());

		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.INTEGRATION_CLEAR_SCHEDULER_AUDIT.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

}
