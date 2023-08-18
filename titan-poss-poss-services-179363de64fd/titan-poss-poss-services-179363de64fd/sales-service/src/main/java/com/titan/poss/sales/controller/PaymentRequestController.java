/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.PaymentRequestSearchDto;
import com.titan.poss.sales.dto.request.CreatePaymentRequestDto;
import com.titan.poss.sales.dto.response.PendingPaymentDto;
import com.titan.poss.sales.service.PaymentRequestService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesPendingPaymentController")
@RequestMapping(value = "sales/v2/payment-requests")
public class PaymentRequestController {

	@Autowired
	private PaymentRequestService paymentRequestService;

	// @formatter:off
	private static final String PAYMENT_VIEW_PERMISSION =  IS_STORE_USER + AND 
		+ "(" + START+ SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR 
		+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR
		+ START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END + ")";
	// @formatter:off
		
	// @formatter:off
	private static final String PAYMENT_ADD_EDIT_PERMISSION = IS_STORE_USER + AND 
		+ "(" + START+ SalesAccessControls.CASH_MEMO_PAYMENT_ADD_EDIT + END + OR 
		+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_ADD_EDIT + END + OR
		+ START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END + ")";
	// @formatter:off
	
	/**
	 * This method will list all payment requests based on filter.
	 * 
	 * @param customerId
	 * @param paymentCode
	 * @param referenceId
	 * @param status
	 * @param isWorkFlowApproval
	 * @param fiscalYear
	 * @param pageable
	 * @return PagedRestResponse<ListPendingPaymentDto>>
	 */
	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "API to get pending payments", notes = "This API will list pending payments based on filters added.<br>"
			+ "To check if payment is approved or not, use "
			+ "<a span href=\"https://dev-poss.titanposs.in/swagger-ui.html?urls.primaryName=sales-service#/payment-request-controller/getApprovalStatusbyIdUsingGET\" title=\"Go to Get by id\">GET by id API.</a><br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Allowed status:</span>" 
			+ "<ul>"
			+ "	<li>APPROVED</li>"
			+ "	<li>CLOSED</li>"
			+ "	<li>COMPLETED</li>"
			+ "	<li>EXPIRED</li>"
			+ "	<li>FAILED</li>"
			+ "	<li>IN_PROGRESS</li>"
			+ "	<li>OPEN</li>"
			+ "	<li>PENDING</li>"
			+ "	<li>REJECTED</li>"
			+ "</ul><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Date filter details:</span><br>" 
			+ " &nbsp; Valid values for 'dateRangeType' are:"
			+ "		<ul>"
			+ "			<li>TODAY</li>"
			+ "			<li>LAST_WEEK</li>"
			+ "			<li>LAST_MONTH</li>"
			+ "			<li>LAST_YEAR</li>"
			+ "			<li>CUSTOM</li>"
			+ "		</ul>"
			+ " &nbsp; By default data will be available for **TODAY** if the value for **dateRangeType** is not provided (except RO PAYMENT).<br>"
			+ " &nbsp; In case of RO PAYMENT, by default data will be available for all requests till current business date, if the value for **dateRangeType** is not provided.<br>"
			+ " &nbsp; For **CUSTOM** search, **startDate & endDate** are mandatory.<br>"
			+ " &nbsp; For **TODAY, LAST_WEEK, LAST_MONTH, LAST_YEAR** search, **startDate & endDate** are NOT Mandatory.<br>"
			+ " &nbsp; **NOTE:** For Filtering Results for a given Date Range, please set the **date** field value to **CUSTOM** and the set the Date Range.<br>")
	@PostMapping("list")
	// @formatter:on
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public PagedRestResponse<List<PendingPaymentDto>> listPendingPayments(
			@ApiParam(name = "paymentCode", value = "Provide to search by payment code", required = true) @RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX, nullCheck = true) String paymentCode,
			@ApiParam(name = "paymentRequestSearchDto", value = "Provide filters  for search in 'paymentRequestSearchDto' ", required = false) @RequestBody @Valid PaymentRequestSearchDto paymentRequestSearchDto,
			@ApiIgnore Pageable pageable) {

		return paymentRequestService.listPendingPayments(paymentCode, paymentRequestSearchDto, pageable);
	}

	/**
	 * This method will create a payment request.
	 * 
	 * @param pendingPaymentRequestDto
	 * @return PendingPaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to create payment request", notes = "This API will create a request for pending payments.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Mandatory fields for AIRPAY:</span>" 
			+ "<ul>"
			+ "	<li>customerId</li>"
			+ "	<li>paymentCode</li>"
			+ "	<li>amount</li>"
			+ "	<li>reference1 - (reference1 from Airpay offline payment)</li>"
			+ "	<li>reference2 - (reference2 from Airpay offline payment)</li>"
			+ "	<li>reference2 - (reference3 from Airpay offline payment)</li>"
			+ "</ul><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Mandatory fields for RAZOR PAY:</span>" 
			+ "<ul>"
			+ "	<li>customerId</li>"
			+ "	<li>paymentCode</li>"
			+ "	<li>amount</li>"
			+ "	<li>reference1 - (reference1 from Razor Pay offline payment)</li>"
			+ "	<li>reference1 - (reference2 from Razor Pay offline payment)</li>"
			+ "	<li>reference1 - (reference3 from Razor Pay offline payment)</li>"
			+ "</ul><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Mandatory fields for ROPAYMENT(Corporate approval):</span>" 
			+ "<ul>"
			+ "	<li>customerId</li>"
			+ "	<li>paymentCode</li>"
			+ "	<li>amount</li>"
			+ "	<li>requestedReason</li>"
			+ "</ul><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Mandatory fields for ROPAYMENT(Store approval):</span>" 
			+ "<ul>"
			+ "	<li>customerId</li>"
			+ "	<li>paymentCode</li>"
			+ "	<li>amount</li>"
			+ "	<li>requestedReason</li>"
			+ "	<li>approvedBy</li>"
			+ "</ul><br>")
	@PostMapping
	// @formatter:on
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public PendingPaymentDto createPendingPayemtRequest(
			@ApiParam(name = "body", value = "Payment request object that needs to be created", required = false) @RequestBody @Valid CreatePaymentRequestDto pendingPaymentRequestDto) {

		return paymentRequestService.createPendingPayemtRequest(pendingPaymentRequestDto, null);
	}

	/**
	 * This method will close the payment based on id.
	 * 
	 * @param id
	 * @param untilizedAmount
	 * @return PendingPaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to close pending payments", notes = "This API will close pending payments and generate Credit Note.<br>")
	@PatchMapping("/{id}")
	// @formatter:on
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public PendingPaymentDto closePendingPayment(
			@ApiParam(name = "id", value = "Provide to search by id", required = true) @PathVariable(name = "id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "untilizedAmount", value = "Provide to supdate untilized amount", required = false) @RequestParam(name = "untilizedAmount", required = false) @Positive @Digits(integer = 15, fraction = DomainConstants.PRICE_SCALE, message = "Amount valid till {integer} digits and {fraction} decimal places only") BigDecimal untilizedAmount) {

		return paymentRequestService.closePendingPayment(id, untilizedAmount, true, null);
	}

	/**
	 * This method will get status from WorkFlow & update locally.
	 * 
	 * @param id
	 * @return PendingPaymentDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to get pending payments", notes = "<h4>This API will get pending payments based on id.</h4>"
			+ "In case of ROPAYMENT, it will validate if payment is APPROVED/REJECTED.<br>"
			+ "In case of AIRPAY, it will valied if payment is IN_PROGRESS/COMPLETED/FAILED.<br>"
			+ "In case of RAZOR PAY, it will valied if payment is IN_PROGRESS/COMPLETED/FAILED.<br>")
	@GetMapping("/{id}")
	// @formatter:on
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public PendingPaymentDto getApprovalStatusbyId(
			@ApiParam(name = "id", value = "Provide to search by id", required = true) @PathVariable(name = "id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {

		return paymentRequestService.getApprovalStatusbyId(id);
	}

	/**
	 * This method will resend pending payments link to customers.
	 * 
	 * @param id
	 * @return
	 */
	// @formatter:off
	@ApiOperation(value = "API to resend payments", notes = "This API will resend pending payments link to customers (Applicable for AIRPAY & RAZORPAY only)<br>")
	@PutMapping("/{id}")
	// @formatter:on
	@PreAuthorize(PAYMENT_ADD_EDIT_PERMISSION)
	public void resendPaymentLink(
			@ApiParam(name = "id", value = "Provide to search by id", required = true) @PathVariable(name = "id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {

		paymentRequestService.resendPaymentLink(id);
	}
}
