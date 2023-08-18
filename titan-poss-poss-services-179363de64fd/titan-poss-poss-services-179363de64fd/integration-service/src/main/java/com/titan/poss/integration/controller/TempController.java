/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.integration.scheduler.SchedulerMaster;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "integration/v2/temp")
public class TempController {

	@Autowired
	private SchedulerMaster sm;

	@ApiOperation(value = "This API simulates same trigger of automatic schuedler. But, here we don't need to wait for 5 min or shedlock lock availablity")
	@PostMapping(value = "/run-automatic-scheduler")
	public void runAutomaticScheduler() {
		sm.masterSchedulerApi();
	}
}
