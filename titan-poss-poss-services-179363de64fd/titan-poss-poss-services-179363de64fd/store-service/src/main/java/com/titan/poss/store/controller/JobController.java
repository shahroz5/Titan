/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.store.service.StoreJobService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/store/v2/jobs")
public class JobController {
	
	@Autowired
	StoreJobService storeJobService;
	
	@GetMapping(value = "/publish-to-datasync")
	@ResponseBody
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {
		return storeJobService.publishToDataSync();

	}


}
