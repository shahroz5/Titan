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

import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dto.CustomerEpossListSearchDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.constants.CashLimitTxnTypeEnum;
import com.titan.poss.sales.dto.constants.CustNonUniqSearchTypeEnum;
import com.titan.poss.sales.dto.response.CashLimitResponseDto;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.CustomerEpossService;
import com.titan.poss.sales.service.CustomerPaymentService;
import com.titan.poss.sales.service.CustomerService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Validated
@RestController("salesCustomerEpossController")
@RequestMapping("sales/v2/customers/eposs")
public class CustomerEpossController {

	@Autowired
	private CustomerEpossService custEpossService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private CustomerPaymentService customerPaymentService;

	@Autowired
	private CustomerDocumentService cdService;

	private static final String CUSTOMER_VIEW_PERMISSION = IS_STORE_USER + AND + START
			+ SalesAccessControls.CUSTOMER_VIEW + END;

	// @formatter:off
	private static final String PAYMENT_VIEW_PERMISSION = IS_STORE_USER + AND + "(" + START
			+ SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR + START
			+ SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR + START
			+ SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END + ")";
	// @formatter:off

	@GetMapping
	@PreAuthorize(IS_STORE_USER)
	// @formatter:off
	@ApiOperation(value = "get customer result for customer id & location code", notes = CommonConstants.EPOSS_API_WARNING
			+ "It will get customer from customer location data.<br><br>"
			+ "Required mainly where EPOSS data is copying to POSS but details of the customer of that invoice is required.")
	// @formatter:on
	public CustomerEpossSearchDto getCustomerByIdAndLocationCode(
			@ApiParam(value = "customerId", required = true) @RequestParam(required = true) Integer customerId,
			@ApiParam(name = "locationCode", required = true) @RequestParam(required = true) String locationCode) {
		return custEpossService.getCustomerByIdAndLocationCode(customerId, locationCode);
	}

	// @formatter:off
	@ApiOperation(value = "get customer result for unique field", notes = CommonConstants.EPOSS_API_WARNING
			+ "For regular customer, it will search in netcarrot & override existing data.<br><br>"
			+ "For other customer, it will search in database & return back the response.<br>"
			+ "Possible error is \"Record not found\" only if 'mobile no' or 'ulp id' is not available in ULP system."
			+ "<br><br>This API can add an user in database if not available there, but available in ULP system (Scenario can be titan watch)")
	// @formatter:on
	@PatchMapping
	@PreAuthorize(IS_STORE_USER)
	public CustomerEpossSearchDto serchAndUpdateCustomer(
			@ApiParam(value = "Value of search", required = true) @RequestParam(required = true) @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX, nullCheck = true) String searchField,
			@ApiParam(value = "Type of search.", allowableValues = "CUSTOMER_ID, MOBILE_NO, ULP_ID, CUSTOMER_TAX_NO, INSTITUTIONAL_TAX_NO, PASSPORT_ID", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@RequestParam(name = "isUlpUpdateRquire", required = false, defaultValue = "true") Boolean isUlpUpdateRquire) {
		log.info(
				"get netcarrot data for regular, blank for other in request dto, update for netcarrot field wise, send customer master, customer_ulp dao");

		return custEpossService.searchAndUpdateCustomer(searchField, searchType, isUlpUpdateRquire);

	}

	// @formatter:off
	@ApiOperation(value = "get customer result for non-uniquee field", notes = CommonConstants.EPOSS_API_WARNING
			+ "It will search in database & with unique fields for the customer type for results it returns.<br>"
			+ "Using this unique field combination, search API based on unique field can be called")
	// @formatter:on
	@GetMapping("list")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<CustomerEpossListSearchDto> listCustomerByNonUniqueFields(
			@ApiParam(value = "Value of search", required = true) @RequestParam(required = true) @NotNull String searchField,
			@ApiParam(value = "Type of search.", allowableValues = "NAME, EMAIL_ID", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = CustNonUniqSearchTypeEnum.class) String searchType) {

		return custEpossService.searchCustomerList(searchField, searchType);
	}

	@GetMapping(value = "/unique-checks")
	@PreAuthorize(CUSTOMER_VIEW_PERMISSION)
	public Boolean isUniqueCheck(
			@ApiParam(name = "searchType", value = "'searchType' to search ", allowableValues = "MOBILE_NO, ULP_ID, CUSTOMER_TAX_NO, INSTITUTIONAL_TAX_NO, PASSPORT_ID", required = true) @RequestParam(name = "searchType") @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(name = "value", value = "'value' to check uniqueness ", required = true) @RequestParam(name = "value") @Size(min = 1, max = 100, message = "min length is {min} and max length is {max} for the value") @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX) String value) {

		return customerService.isUniqueCheck(searchType, value);
	}

	/**
	 * This method will get the cash limit for a given customer and txn type.
	 * 
	 * @param customerType
	 * @param searchValue
	 * @param txnType
	 * @param businessDate
	 * @return CashLimitResponseDto
	 */
	@GetMapping("/cash-limit")
	@ApiOperation(value = "API to get cash limit", notes = "This API will get cash limit based on inputs.<br>"
			+ "<b>API will expect customer type, search value and transaction type as input.</b><br>")
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public CashLimitResponseDto getCashLimit(
			@ApiParam(name = "customerType", value = "Provide 'customerType'", allowableValues = "REGULAR,INTERNATIONAL,INSTITUTIONAL,ONETIME", required = true) @RequestParam(name = "customerType", required = true) @ValueOfEnum(enumClass = CustomerTypeEnum.class) String customerType,
			@ApiParam(name = "searchValue", value = "Provide 'searchValue'", required = true) @RequestParam(name = "searchValue", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String searchValue,
			@ApiParam(name = "txnType", value = "Provide 'txnType'", allowableValues = "AB,CM,GHS,CO,ADV,GRF,GIFT_CARD", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = CashLimitTxnTypeEnum.class) String txnType,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate'", required = true) @RequestParam(name = "businessDate", required = true) @DateTimeFormat(pattern = "yyyy-MM-dd") Date businessDate,
			@ApiParam(name = "instrumentDate", value = "Provide 'instrumentDate'", required = false) @RequestParam(name = "instrumentDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date instrumentDate,
			@ApiParam(name = "ulpId", value = "Provide 'ulpId'", required = false) @RequestParam(name = "ulpId", required = false) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, nullCheck = false) String ulpId) {
		return customerPaymentService.getCashLimit(customerType, searchValue, txnType, businessDate, instrumentDate,
				ulpId);
	}

	@GetMapping("/instrument-cash")
	@ApiOperation(value = "API to get cash paid for the instrument", notes = "This API will get cash paid for the gift card on purchase.<br>")
	@PreAuthorize(PAYMENT_VIEW_PERMISSION)
	public InstrumentCashAmountDto getCashPaidForTheInstrument(
			@ApiParam(name = "instrumentNo", value = "Provide 'instrumentNo'", required = true) @RequestParam(name = "instrumentNo", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String instrumentNo) {
		return customerPaymentService.getCashPaidForTheInstrument(instrumentNo);
	}

	@GetMapping("/cash-payment")
	@ApiOperation(value = "API to get cash paid for the busines date at current location.", notes = "API to get cash paid for the busines date for the given location.<br>"
			+ "<b>NOTE: </b>This API will be used by EGHS to get cash payment details.<br>")
	public CashPaidDetailsDto getTotalCashPaid(
			@ApiParam(name = "searchType", value = "Provide 'searchType'", required = true, allowableValues = "MOBILE_NO, ULP_ID") @RequestParam(name = "searchType", required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(name = "searchValue", value = "Provide 'searchValue'", required = true) @RequestParam(name = "searchValue", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String searchValue,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate'", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate,
			@ApiParam(name = "locationCode", value = "Provide 'locationCode'", required = true) @RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String locationCode) {

		return customerPaymentService.getTotalCashPaid(searchType, searchValue, businessDate, locationCode);

	}

	@GetMapping("/pmla")
	@ApiOperation(value = "API to get cash paid for the particular month and year.", notes = "API to get cash paid for the particular month and year of customer.")
	public TotalCashPaidDetailsDto getPmlaOfCustomer(
			@ApiParam(name = "ulpId", value = "Provide 'ulpId'", required = true) @RequestParam(name = "ulpId", required = true) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, nullCheck = true) String ulpId,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate'", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate) {

		return customerPaymentService.getPmlaOfCustomer(ulpId, businessDate);
	}

	@GetMapping("documents")
	@PreAuthorize(IS_STORE_USER)
	public List<CustomerDocumentsDao> listAllDocuments(@RequestParam String customerId) {
		return cdService.getActiveCustomerDocsByCustomerId(customerId);
	}

	// @formatter:off
	@ApiOperation(value = "search customer result if not found create", notes = CommonConstants.EPOSS_API_WARNING
			+ "<br><br>This API can add an customer in database if not available there")
	// @formatter:on
	@PatchMapping("search")
	@PreAuthorize(IS_STORE_USER)
	public CustomerEpossSearchDto serchAndUpdateLegacyCustomer(
			@ApiParam(name = "body", value = "Customer object that needs to be searched and created if not present", required = true) @RequestBody @Valid CustomerEpossSearchDto customerDetailsToSearch,
			@ApiParam(name = "locationCode", value = "Provide 'locationCode'", required = true) @RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String locationCode) {

		return custEpossService.searchCustomer(customerDetailsToSearch, locationCode);

	}

}
