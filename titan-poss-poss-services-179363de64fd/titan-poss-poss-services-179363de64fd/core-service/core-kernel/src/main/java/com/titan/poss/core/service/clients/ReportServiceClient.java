/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@FeignClient(contextId = "reportContextId", name = "report-service", configuration = FeignClientInterceptor.class)
public interface ReportServiceClient {

	@GetMapping("/report/v2/auto-reports")
	public SchedulerResponseDto automaticReportGenerator(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);
}
