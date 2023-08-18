/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.location.service.LocationJobService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/location/v2/jobs")
public class JobController {

	@Autowired
	LocationJobService locationJobService;

	@GetMapping(value = "/publish-to-datasync")
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {
		return locationJobService.publishToDataSync();

	}

	@GetMapping(value = "/metal-rate-update")
	@ApiOperation(value = "metal rate update", notes = "This API invocation will insert the new metal rate")
	public SchedulerResponseDto triggerUpdateMaterialRate() {
		return locationJobService.triggerUpdateMaterialRate();

	}
	
	@GetMapping(value = "/fiscal-year-update")
	@ApiOperation(value = "fiscal year update", notes = "This API invocation will update the fiscal year")
	public SchedulerResponseDto updateFiscalYear() {
		return locationJobService.updateFiscalYear();

	}


}
