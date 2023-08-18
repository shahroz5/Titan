/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.sales.inventory.facade.StockManagementFacade;
import com.titan.poss.sales.service.SalesJobService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "/sales/v2/jobs")
public class JobController {

	@Autowired
	private StockManagementFacade stockManagementFacade;

	@Autowired
	private SalesJobService salesJobService;

	@GetMapping(value = "/remove-from-reservebin")
	@ResponseBody
	@ApiOperation(value = "Invoke Reserve Bin ", notes = "This API invocation will move Items older than 30 days, from RESERVEBIN to UNASSIGNED Bin ")
	public SchedulerResponseDto moveItemsFromReserveBin(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		//return stockManagementFacade.updateFromReserveBin(locationCode);
		return stockManagementFacade.moveItemsFromReserveBin(locationCode);
	}

	@GetMapping(value = "/publish-to-datasync")
	@ResponseBody
	@ApiOperation(value = "publish To DataSync Service", notes = "This API invocation will publish the persisted messages from sync-staging table to data-sync Service")
	public SchedulerResponseDto publishToDataSync() {
		return salesJobService.publishToDataSync();

	}

	@GetMapping(value = "/suspend-booking")
	@ResponseBody
	@ApiOperation(value = "suspend booking after advance booking", notes = "This API invocation will suspend bookings if customer doesn't comeback for final billing")
	public SchedulerResponseDto suspendBooking(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		return salesJobService.suspendBooking(locationCode);

	}

	@GetMapping(value = "/clear-status")
	@ResponseBody
	@ApiOperation(value = "delete RO,AIRPAY and RAZORPAY payments", notes = "This API invocation will delete the RO,AIRPAY and RAZORPAY payments")
	public SchedulerResponseDto clearStatus(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		return salesJobService.clearStatus(locationCode);
	}

	@GetMapping("open-tasks")
	@ResponseBody
	@ApiOperation(value = "delete CM details with OPEN status", notes = "This API invocation will delete the CM details which are in open status")
	public SchedulerResponseDto deleteOpenTasks() {
		return salesJobService.deleteOpenTasks();
	}

	/**
	 * This method will delete all the transactions in 'OPEN' and 'HOLD' status at
	 * EOD. It will also reverse or generate Credit notes for payments(if present).
	 * 
	 * @return SchedulerResponseDto
	 */
	@DeleteMapping(value = "/eod/clear-txns")
	@ResponseBody
	@ApiOperation(value = "API to delete all 'OPEN' and 'HOLD' transactions at EOD", notes = "This API will delete all OPEN and HOLD transactions at EOD.<br>")
	public SchedulerResponseDto deleteTasksAtEOD() {
		return salesJobService.deleteOpenAndHoldTasksAtEOD();
	}

	@DeleteMapping(value = "/advance-booking-approval")
	@ResponseBody
	@ApiOperation(value = "API to delete advance booking with pending status", notes = "This API will soft delete all the advance booking details with pending status")
	public SchedulerResponseDto advanceBookingApproval() {
		return salesJobService.advanceBookingApproval();
	}

	@DeleteMapping(value = "/suspend-credit-note")
	@ResponseBody
	@ApiOperation(value = "API to suspend credit note", notes = "This API is used to suspend the credit note details by comparing created date and current date")
	public SchedulerResponseDto suspendCreditNote(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {

		return salesJobService.suspendCreditNote(locationCode);
	}

	/**
	 * This method will cancel pending bill cancellation requests at EOD.
	 * 
	 * @return SchedulerResponseDto
	 */
	@DeleteMapping(value = "/eod/clear-refund-requests")
	@ResponseBody
	@ApiOperation(value = "API to clear refund(Bill Cancellation) requests", notes = "This API is used to clear refund(Bill Cancellation) requests for current business date.")
	public SchedulerResponseDto cancelPendingBillCancelRequests() {
		return salesJobService.cancelPendingBillCancelRequests();
	}

	@PostMapping("sync-file")
	@ResponseBody
	@ApiOperation(value = "API to upload file to online storage", notes = "This API will upload file to online storage which are active & not synced.")
	public SchedulerResponseDto syncFileToOnlineStorage() {
		return salesJobService.syncFileToOnlineStorage();
	}

	@DeleteMapping(value = "eod/delete-customer-digital-signature")
	@ResponseBody
	@ApiOperation(value = "API to delete advance booking with pending status", notes = "This API will soft delete all the advance booking details with pending status")
	public SchedulerResponseDto deleteDigitalSignatureAtEod(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		return salesJobService.deleteDigitalSignatures(locationCode);
	}

	@PostMapping(value = "update-invoice-documents")
	@ApiOperation(value = "API to update invoice details after generating IRN", notes = "This API will update the invoice details after generating the irn details")
	public EinvoiceJobResponseDto updateInvoiceDocuments(
			@ApiParam(name = "body", value = "invoice Documents update Dto", required = false) @RequestBody InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto) {
		return salesJobService.updateInvoiceDocuments(invoiceDocumentsUpdateDto);
	}

	/**
	 * This method is used to clear the payments made after AB/CO confirmation but
	 * no CNs generated for it.
	 * 
	 * @return SchedulerResponseDto
	 */
	@DeleteMapping(value = "/eod/clear-payments")
	@ResponseBody
	@ApiOperation(value = "API to clear payments with no CN generated.", notes = "This API will clear the payments made after AB/CO confirmation but no CNs generated for it at EOD.<br>")
	public SchedulerResponseDto clearAbCoPayments() {
		return salesJobService.clearAbCoPayments();
	}
	
	@DeleteMapping(value = "/eod/clear-frozen-details")
	@ResponseBody
	@ApiOperation(value ="API to clear frozen details after the configured number of days.", notes = "This API will clear the frozen details after the configured number of days at EOD .<br>")
	public SchedulerResponseDto  clearFrozenDetails(@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode) {
		return salesJobService.clearFrozenDetails(locationCode);
	}
}
