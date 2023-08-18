/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.controller;

import static com.titan.poss.inventory.acl.InventoryAccessControls.RECEIVE_FROM_FACTORY;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.batch.core.launch.JobOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.titan.poss.core.dto.InvoiceResponseDto;
import com.titan.poss.core.dto.LaunchJobRequest;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.StnResponseDto;
import com.titan.poss.file.service.ExecuteJobService;
import com.titan.poss.file.service.FileAuditService;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.inventory.acl.InventoryAccessControls;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("JobsController")
@RequestMapping(value = "file/v2/jobs")
public class JobController {

	@Autowired
	private JobOperator jobOperator;

	@Autowired
	private ExecuteJobService executeJobService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	@Autowired
	private FileAuditService fileAuditService;

	private static final String PURCHASE_INVOICE_PERMISSION = "hasPermission(true,'"
			+ InventoryAccessControls.RECEIVE_INVOICE_FROM_CFA + "' )";

	private static final String STOCK_RECEIVE_PERMISSION = " hasPermission(true,'" + RECEIVE_FROM_FACTORY + "' ) ";

	/**
	 * This endpoint deals with launching of jobs that are registered.
	 *
	 * @param launchJobRequest launch job request
	 * @throws Exception               exception.
	 * @throws JsonProcessingException json processing exception.
	 */
	@ApiOperation(value = "To trigger the job based on the jobName", notes = "This API can be used to trigger the job based on the jobName."
			+ "<br>"
			+ " JobNames can be found using the below getJobs() api. For example to trigger STN job, jobname is stnJob. Only return invoice job expects a job parameter of invoice id along with jobname.")
	@PostMapping()
	public SchedulerResponseDto runAJob(@RequestBody LaunchJobRequest launchJobRequest) {
		Map<String, String> jobParam = launchJobRequest.getJobParams() == null ? new HashMap<>()
				: launchJobRequest.getJobParams();
		jobParam.put("manualJob", "true");
		launchJobRequest.setJobParams(jobParam);
		return executeJobService.triggerJob(launchJobRequest);
	}

	@PostMapping("/stn")
	@PreAuthorize(STOCK_RECEIVE_PERMISSION)
	public void runStnJob(@RequestBody StnResponseDto stnResponse) {
		stnAndInvoiceService.runStnJob(stnResponse);
	}

	@PostMapping("/invoice")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public void runInvoiceJob(@RequestBody InvoiceResponseDto invoiceResponse) {
		stnAndInvoiceService.runInvoiceJob(invoiceResponse);
	}

	@GetMapping("/clear-audit")
	public SchedulerResponseDto runClearFileAuditJob() {
		return fileAuditService.deleteOldFileAuditData();
	}

	/**
	 * This endpoint deals with return all job names that are registered within this
	 * component.
	 *
	 * @return jobs
	 */
	@GetMapping()
	public Collection<String> getJobs() {
		return jobOperator.getJobNames();
	}
}
