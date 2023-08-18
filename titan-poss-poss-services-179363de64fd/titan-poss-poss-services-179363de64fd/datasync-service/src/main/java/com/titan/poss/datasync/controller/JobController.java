/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.datasync.service.DataSyncJobService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/datasync/v2/jobs")
public class JobController {

	@Autowired
	private DataSyncJobService dataSyncJobService;

	@GetMapping(value = "/retry-publish")
	@ResponseBody
	@ApiOperation(value = "publish failed message to queue", notes = "This API invocation will publish the failed messages to queue")
	public SchedulerResponseDto failedToPublishToQueue() {
		return dataSyncJobService.failedToPublishToQueue();
	}

	@GetMapping(value = "/retry-fail-to-persist")
	@ResponseBody
	@ApiOperation(value = "retry fail to persist ", notes = "This API invocation will publish the failed messages to queue with status ***FAILED_DEPENDENCY***, ***FAILED_PERSIST***, ***RECEIVED***")
	public SchedulerResponseDto retryFailToPersist() {
		dataSyncJobService.retryFailToPersist();
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.DATAYSNC_RETRY_FAILED.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	@GetMapping(value = "/publish-to-datasync")
	@ResponseBody
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {
		return dataSyncJobService.publishToDataSync();

	}

	@GetMapping(value = "/heartbeat-check")
	@ResponseBody
	@ApiOperation(value = "check the active status of EPOSS services", notes = "This API invocation will update the last active time of EPOSS services")
	public SchedulerResponseDto checkHeartBeat() {
		return dataSyncJobService.checkHeartBeat();
	}

}
