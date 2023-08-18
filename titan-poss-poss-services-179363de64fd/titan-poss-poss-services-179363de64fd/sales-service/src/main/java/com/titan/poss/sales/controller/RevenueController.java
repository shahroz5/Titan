/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_CORP_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.GhsTodayRevenueDto;
import com.titan.poss.core.dto.ServicePossRequestDto;
import com.titan.poss.core.dto.ServicePossRevenueDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.DayWiseRevenueDto;
import com.titan.poss.sales.dto.response.TodayRevenueDto;
import com.titan.poss.sales.service.RevenueService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("RevenueController")
@RequestMapping(value = "sales/v2/revenues")
public class RevenueController {

	@Autowired
	private RevenueService revenueService;

	private static final String TODAYS_REVENUE_VIEW_PERMISSION = START + SalesAccessControls.TODAYS_REVENUE_VIEW + END;
	private static final String DAY_WISE_REVENUE_VIEW_PERMISSION = START + SalesAccessControls.DAY_WISE_REVENUE_VIEW
			+ END;

	/**
	 * This API will return the day wise revenue
	 * 
	 * @param revenueDateDto
	 * @param pageable
	 * @return PagedRestResponse<List<DayWiseRevenueDto>>
	 */
	@PreAuthorize(IS_STORE_USER + " AND " + DAY_WISE_REVENUE_VIEW_PERMISSION)
	@ApiOperation(notes = "API to get list of day wise revenue in the given date interval", value = "API will return list of day wise revenue in the given date interval")
	@PostMapping(value = "/days")
	@ApiPageable
	public PagedRestResponse<List<DayWiseRevenueDto>> getDayWiseRevenue(
			@RequestBody @Valid RevenueDateDto revenueDateDto, @ApiIgnore Pageable pageable) {

		return revenueService.getDayWiseRevenue(revenueDateDto, pageable);

	}

	/**
	 * API to get today's revenue collected in BTQ & EGHS
	 * 
	 * @param locationCode
	 * @return ListResponse<TodayRevenueDto>
	 */
	@PreAuthorize((IS_STORE_USER + OR + IS_CORP_USER) + AND + TODAYS_REVENUE_VIEW_PERMISSION)
	@ApiOperation(notes = "API to get today's revenue collected in BTQ & EGHS", value = "This API will return today's revenue based on location code for BTQ and EGHS in both POSS and EPOSS. For Poss no need to pass locationCode for eposs locationCode is mandatory.")
	@GetMapping(value = "/todays")
	public ListResponse<TodayRevenueDto> getTodayRevenues(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {

		return revenueService.getTodayRevenues(locationCode);

	}
	
	@PreAuthorize(IS_CORP_USER )
	@ApiOperation(notes = "API to get today's revenue collected at EGHS",value = "This API will return today's revenue in eposs based on locationCode")
	@GetMapping(value= "/todays/ghs")
	public ListResponse<GhsTodayRevenueDto> getGhsRevenue(@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode){
		return revenueService.getGhsRevenue(locationCode);
	}
	
	@PreAuthorize(IS_CORP_USER )
	@ApiOperation(notes = "API to get today's revenue collected at service",value = "This API will return today's revenue in eposs based on locationCode")
	@GetMapping(value= "/todays/service")
	public Map<String, List<ServicePossRevenueDto>> getServiceRevenue(@RequestParam(
			required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode){
		return revenueService.getServiceRevenue(locationCode);
	}
}
