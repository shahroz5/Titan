/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.BooleanResponse;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@FeignClient(contextId = "salesContextId", name = "sales-service", configuration = FeignClientInterceptor.class)
public interface SalesServiceClient {

	@GetMapping(value = "sales/v2/customers/{customerId}")
	Response getCustomer(@PathVariable(value = "customerId") Integer customerId);

	@PostMapping(value = "sales/v2/credit-note/ghs")
	public Response downloadCNfromEGHS(@RequestBody List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateList);

	@DeleteMapping(value = "/sales/v2/jobs/eod/clear-txns")
	public SchedulerResponseDto deleteTasksAtEOD(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/sales/v2/jobs/suspend-booking")
	public SchedulerResponseDto suspendBooking(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "/sales/v2/jobs/clear-status")
	public SchedulerResponseDto clearStatus(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "/sales/v2/jobs/open-tasks")
	public SchedulerResponseDto deleteOpenTasks(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/sales/v2/jobs/remove-from-reservebin")
	public SchedulerResponseDto moveItemsFromReserveBin(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@DeleteMapping(value = "/sales/v2/jobs/suspend-credit-note")
	public SchedulerResponseDto suspendCreditNote(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@DeleteMapping(value = "/sales/v2/jobs/advance-booking-approval")
	public SchedulerResponseDto advanceBookingApproval(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "/sales/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "sales/v2/cash-memos/eposs")
	public Object getEpossCashMemoDetails(@RequestParam(name = "locationCode", required = true) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear);

	@GetMapping(value = "sales/v2/credit-note/legacy/ibt")
	public Object getCreditNoteDetailsForLegacy(@RequestParam(name = "id", required = true) String id);

	@DeleteMapping(value = "/sales/v2/jobs/eod/clear-refund-requests")
	SchedulerResponseDto cancelPendingBillCancelRequests(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@PostMapping(value = "/sales/v2/jobs/update-invoice-documents")
	public EinvoiceJobResponseDto updateInvoiceDocuments(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestBody(required = false) InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto);

	@PostMapping(value = "sales/v2/credit-note/eposs/ibt")
	public CreditNoteTransferDto transferCNToEPOSS(@RequestBody CreditNoteRequestDto cnRequestDto);

	@PutMapping(value = "sales/v2/credit-note/legacy/ibt")
	public BooleanResponse updateCreditNoteLegacy(@RequestParam(name = "id", required = true) String id,
			@RequestParam(name = "srcBtqCode", required = true) String srcBtqCode, 
			@RequestParam(name = "destLocationCode", required = true) String destLocationCode);

	@GetMapping(value = "sales/v2/customers/eposs/cash-payment")
	public CashPaidDetailsDto getTotalCashPaid(@RequestParam(name = "searchType", required = true) String searchType,
			@RequestParam(name = "searchValue", required = true) String searchValue,
			@RequestParam(name = "businessDate", required = true) String businessDate,
			@RequestParam(name = "locationCode", required = true) String locationCode);
	
	@GetMapping(value = "sales/v2/customers/eposs/pmla")
	public TotalCashPaidDetailsDto getPmlaOfCustomer(
			@RequestParam(name = "ulpId", required = true) String ulpId,
			@RequestParam(name = "businessDate", required = true) String businessDate);

	@PostMapping("/sales/v2/jobs/sync-file")
	public SchedulerResponseDto syncFileToOnlineStorage(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@DeleteMapping(value = "/sales/v2/jobs/eod/delete-customer-digital-signature")
	public SchedulerResponseDto deleteDigitalSignatureAtEod(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@DeleteMapping(value = "/sales/v2/jobs/eod/clear-payments")
	public SchedulerResponseDto clearAbCoPayments(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);
	
	
	@PutMapping(value = "/sales/v2/goods-return/update-grn-from-legacy")
	public void updateLegacyGrnDetails(@RequestBody GrnLegacyUpdateDto grnLegacyUpdateDto);
	
	@PutMapping(value = "sales/v2/goods-exchange/update-tep-from-legacy")
	public void updateLegacyTepDetails(@RequestBody TepLegacyUpdateDto grnLegacyUpdateDto);
	
	@GetMapping(value = "sales/v2/cash-memos/eposs/returnedItems/{id}")
	public short getTotalReturnedItems(@PathVariable(name = "id") String id);
	
	@DeleteMapping(value = "/sales/v2/jobs/eod/clear-frozen-details")
	public SchedulerResponseDto clearFrozenDetails(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);
	
	@GetMapping("sales/v2/cash-memos/tcs")
	public CustomerTcsData retrieveTcsData(
			@RequestParam(name = "customerMobileNo", required = true) @PatternCheck(regexp = RegExConstants.NUMERIC_REGEX) String customerMobileNo,
			@RequestParam(name = "fiscalYear", required = true) Short fiscalYear,
			@RequestParam(name = "btqPanCard", required = true) String btqPanCard) ;
	
	
	
}