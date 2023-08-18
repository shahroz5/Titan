/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.service.CashMemoEpossService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Cash Memo Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesCashMemoEpossController")
@RequestMapping(value = "sales/v2/cash-memos/eposs")
public class CashMemoEpossController {

	@Autowired
	private CashMemoEpossService cmEpossService;

	// append with or operation whichever API need to call this API
	private static final String CASH_MEMO_VIEW_PERMISSION = START + SalesAccessControls.GRN_VIEW + END;

	private static final String EMPLOYEE_LOAN_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.EMPLOYEE_LOAN_ADD_EDIT + "' )";

	private static final String EMPLOYEE_LOAN_VIEW_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.EMPLOYEE_LOAN_VIEW + "' )";

	@GetMapping
	@PreAuthorize("(" + IS_STORE_USER + PreAuthorizeDetails.AND + CASH_MEMO_VIEW_PERMISSION + ")"
			+ PreAuthorizeDetails.OR + "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public CashMemoEntities getEpossCashMemoDetails(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@RequestParam(name = "txnType", required = false) String txnType,
			@RequestParam(name = "isMigratedIgnored", required = false) Boolean isMigratedIgnored) {

		return cmEpossService.getCashMemoEntityDetails(txnType, locationCode, refDocNo, refFiscalYear, true,isMigratedIgnored);
	}

	@GetMapping("items")
	@PreAuthorize(IS_STORE_USER + " AND " + CASH_MEMO_VIEW_PERMISSION)
	public List<ReturnableItemsDto> listItemIdAllowedForReturn(
			@ApiParam(name = "cmId", required = true) @RequestParam(name = "cmId", required = true) String cmId,
			@RequestParam(name = "txnType", required = false) String txnType) {

		return cmEpossService.listItemIdAllowedForReturn(cmId, txnType);
	}

	@GetMapping("coupon")
	@PreAuthorize(IS_STORE_USER)
	public CustomerCouponDto getCustomerCoupon(
			@ApiParam(name = "id", required = false) @RequestParam(name = "id", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "couponCode", value = "coupon code to validate", required = false) @RequestParam(name = "couponCode", required = false) String couponCode,
			@ApiParam(name = "status", value = "flag to update the coupon status", required = false) @RequestParam(name = "status", required = false) String status,
			@ApiParam(name = "transactionId", value = "transaction Id of rivaah coupon", required = false) @RequestParam(name = "transactionId", required = false) String transactionId) {

		return cmEpossService.getCustomerCoupon(id, couponCode, status, transactionId);
	}

	@PostMapping(value = "employee-loan/config-details")
	@ApiOperation(value = "This Method will validate and return employee config details based on the employee code ", notes = "This Method will validate and return employee config details based on the employee code.")
	@PreAuthorize(IS_STORE_USER + " OR " + EMPLOYEE_LOAN_VIEW_PERMISSION)
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(
			@RequestParam(required = true, value = "employeeCode") String employeeCode,
			@RequestParam(required = true, value = "customerId") String customerId) {
		return cmEpossService.getEmployeeLoanConfigDetails(employeeCode, customerId);

	}

	@GetMapping("{transactionId}/discount")
	@ApiOperation(value = "This API will get the returend Rivaah Aashirwad discount", notes = "This API will get the returend Rivaah Aashirwad discount(GHS % discount) details.")
	@PreAuthorize(IS_STORE_USER + " AND " + CASH_MEMO_VIEW_PERMISSION)
	public ListResponse<RivaahGhsDiscountDto> getReturnedRivaahGhsDetails(
			@ApiParam(name = "transactionId", required = true) @PathVariable(name = "transactionId") String transactionId) {

		return cmEpossService.getReturnedRivaahGhsDetails(transactionId);
	}

	@GetMapping("/check-cm")
	@PreAuthorize("(" + IS_STORE_USER + PreAuthorizeDetails.AND + CASH_MEMO_VIEW_PERMISSION + ")"
			+ PreAuthorizeDetails.OR + "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public List<CashMemoDetailsResponseDto> checkCmAvailable(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "customerId", required = false) String customerId,
			@RequestParam(name = "txnType", required = false) String txnType,
			@RequestParam(name = "isMigratedIgnored", required = false) Boolean isMigratedIgnored) {

		return cmEpossService.checkCmAvailable(locationCode, itemCode, customerMobileNo, customerId,txnType,isMigratedIgnored);
	}
	@GetMapping("returnedItems/{id}")
	@PreAuthorize("(" + IS_STORE_USER + PreAuthorizeDetails.AND + CASH_MEMO_VIEW_PERMISSION + ")"
			+ PreAuthorizeDetails.OR + "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public short getTotalReturnedItems(@ApiParam(name = "id", required = true) @PathVariable(name = "id") String id) {
		return cmEpossService.getTotalReturnedItems(id);
	}
	
}
