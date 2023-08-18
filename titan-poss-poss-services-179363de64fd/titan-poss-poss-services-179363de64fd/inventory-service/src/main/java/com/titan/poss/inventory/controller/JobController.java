/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.controller;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.inventory.service.InventoryJobService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for Inventory Scheduled jobs API's
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/inventory/v2/jobs")
public class JobController {

	@Autowired
	private InventoryJobService inventoryJobService;

	private static final Logger logger = LoggerFactory.getLogger(JobController.class);

	@GetMapping(value = "/close-open-ibt")
	@ResponseBody
	@ApiOperation(value = "Invoke Reserve Bin ", notes = "This API invocation will Close the OPEN IBT Requests This scheduler will run everyday at 12 AM")
	public SchedulerResponseDto closeUnacceptedRequests(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		logger.info("Started close-open-ibt at {} ", new Date());
		return inventoryJobService.closeUnacceptedRequests(locationCode);
	}

	@GetMapping(value = "/publish-to-datasync")
	@ResponseBody
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {

		return inventoryJobService.publishToDataSync();
	}

	@PostMapping(value = "update-invoice-documents")
	@ResponseBody
	@ApiOperation(value = "API to update invoice details after generating IRN", notes = "This API will update the invoice details after generating the irn details")
	public SchedulerResponseDto updateInvoiceDocuments(
			@ApiParam(name = "body", value = "invoice Documents update Dto", required = true) @RequestBody InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto) {
		return inventoryJobService.updateInvoiceDocuments(invoiceDocumentsUpdateDto);
	}
	
	@PostMapping("/stn-update-status")
	@ApiOperation(value="API to STN confirmation to com" , notes="This API will confirm STN to com")
	public SchedulerResponseDto updateStatusStnConfirm() {
		
		return inventoryJobService.updateStatusStnConfirm();
	}

}
