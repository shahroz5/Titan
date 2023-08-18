/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.request.CustomerVisitDto;
import com.titan.poss.sales.dto.response.CustomerVisitCountDto;
import com.titan.poss.sales.dto.response.CustomerVisitResponseDto;
import com.titan.poss.sales.service.CustomerVisitService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("customerVisitController")
@RequestMapping("sales/v2/customer-visits")
public class CustomerVisitController {

	@Autowired
	private CustomerVisitService customerVisitService;

	private static final String WALK_IN_DETAILS_ADD_EDIT_PERMISSION = START
			+ SalesAccessControls.WALK_INS_DETAILS_ADD_EDIT + END;

	private static final String WALK_IN_DETAILS_VIEW_PERMISSION = START + SalesAccessControls.WALK_INS_DETAILS_VIEW
			+ END;

	/**
	 * This method will get the count of conversion
	 * 
	 * @param businessDateDto
	 * @return CustomerVisitCountDto
	 */
	@ApiOperation(value = "This method will get the count of purchasers and bills", notes = "<h4>This method will get the count of purchasers and bills.</h4>"
			+ "If business date passed is null, API will give count details for the date for which walk-in is mandatory.<br>"
			+ "If business date is passed, API will give count details for the given business date.<br>")
	@PostMapping(value = "count")
	@PreAuthorize(WALK_IN_DETAILS_VIEW_PERMISSION)
	public CustomerVisitCountDto getCustomerVisitCount(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto) {

		return customerVisitService.getCustomerVisitCount(businessDateDto);
	}

	/**
	 * This method will save the count of customer visited in BTQ
	 * 
	 */
	@ApiOperation(value = "This method will save the count of customer visited in BTQ", notes = "This method will save the count of customer visited in BTQ")
	@PostMapping
	@PreAuthorize(WALK_IN_DETAILS_ADD_EDIT_PERMISSION)
	public CustomerVisitResponseDto saveCustomerVisitDetails(
			@RequestBody @Valid @ApiParam(name = "body", value = "customer visit", required = true) CustomerVisitDto customerVisit) {

		return customerVisitService.saveCustomerVisitDetails(customerVisit);
	}

	/**
	 * This method will save the count of customer visited in BTQ
	 * 
	 */
	@ApiOperation(value = "This method will give the customer visit details for all the dates within the configured range in BTQ", notes = "Only for the days for which walk-in is filled in BTQ")
	@GetMapping
	@PreAuthorize(WALK_IN_DETAILS_VIEW_PERMISSION)
	public ListResponse<CustomerVisitResponseDto> getCustomerVisits() {

		return customerVisitService.getCustomerVisits();
	}

	@ApiOperation(value = "This method will give the customer visited details in BTQ", notes = "This method will give the customer visited details in BTQ")
	@GetMapping(value = "details")
	@PreAuthorize(WALK_IN_DETAILS_ADD_EDIT_PERMISSION)
	public CustomerVisitResponseDto getCustomerVisitDetails() {
		return customerVisitService.getCustomerVisitDetails();
	}
}
