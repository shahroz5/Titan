/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.integration.service.SchedulerService;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class SchedulerMaster {

	@Autowired
	private SchedulerService schedulerService;

	@Scheduled(cron = "${cron.expression.masterScheduler}")
	@SchedulerLock(name = "schedulerMaster", lockAtLeastFor = CommonConstants.SHEDLOCK_PT2M, lockAtMostFor = CommonConstants.SHEDLOCK_PT3M)
	public void masterScheduler() {
		schedulerService.triggerSchedulers();
	}

	public void masterSchedulerApi() {
		schedulerService.triggerSchedulers();
	}
}
