/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "inventoryContextId", name = "inventory-service", configuration = FeignClientInterceptor.class)
public interface InventoryServiceClient {

	@GetMapping(value = "/inventory/v2/jobs/close-open-ibt")
	public SchedulerResponseDto closeUnacceptedRequests(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "/inventory/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "inventory/v2/stock-receives")
	public Object listStockReceive(@RequestParam(name = "transferType", required = true) String transferType,
			@RequestParam(name = "srcDocNo", required = false) Integer srcDocNo);

	@GetMapping(value = "inventory/v2/purchase-invoices")
	public Object listPurchaseInvoices(@RequestParam(name = "srcDocNo", required = false) Integer srcDocNo,
			@RequestParam(name = "invoiceType", required = true) String invoiceType);

	@PostMapping(value = "/inventory/v2/jobs/update-invoice-documents")
	public SchedulerResponseDto updateInvoiceDocuments(
			@RequestBody(required = true) InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto);
	
	@PostMapping(value = "/inventory/v2/jobs/stn-update-status")
	public SchedulerResponseDto updateStatusStnConfirm(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);


}
