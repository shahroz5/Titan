/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import javax.validation.Valid;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.titan.poss.core.dto.HeartBeatDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@FeignClient(contextId = "dataSyncContextId", name = "datasync-service", configuration = FeignClientInterceptor.class)
public interface DataSyncServiceClient {
	@PostMapping(value = "datasync/v2/publish")
	Response publish(@Valid @RequestBody MessageRequest messageRequest);

	@PostMapping(value = "datasync/v2/queue/{locationcode}")
	Response addQueueToLocation(@PathVariable("locationcode") String locationcode);

	@PostMapping(value = "datasync/v2/receive")
	Response receive(@Valid @RequestBody MessageRequest messageRequest);

	@PostMapping(value = "datasync/v2/publish")
	Response publishWithToken(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@Valid @RequestBody MessageRequest messageRequest);

	@PostMapping(value = "datasync/v2/heartbeat")
	Response heartBeat(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@Valid @RequestBody HeartBeatDto heartBeatDto);

	@GetMapping(value = "/datasync/v2/jobs/retry-publish")
	public SchedulerResponseDto failedToPublishToQueue(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/datasync/v2/jobs/retry-fail-to-persist")
	public SchedulerResponseDto retryFailToPersist(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/datasync/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/datasync/v2/jobs/heartbeat-check")
	public SchedulerResponseDto checkHeartBeat(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);
}
