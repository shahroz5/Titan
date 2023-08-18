/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.Collection;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.titan.poss.core.dto.InvoiceResponseDto;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.StnResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "fileContextId", name = "file-service", configuration = FeignClientInterceptor.class)
public interface FileServiceClient {

	@PostMapping(value = "file/v2/jobs")
	public SchedulerResponseDto runAJob(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestBody LaunchJobRequest launchJobRequest);

	@GetMapping(value = "file/v2/jobs")
	public Collection<String> getJobs();

	@PostMapping("file/v2/jobs/stn")
	public void runStnJob(@RequestBody StnResponseDto stnResponse);

	@PostMapping("file/v2/jobs/invoice")
	public void runInvoiceJob(@RequestBody InvoiceResponseDto invoiceResponse);

	@GetMapping(value = "file/v2/jobs/clear-audit")
	public SchedulerResponseDto clearFileAuditData(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

}
