/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.BusinessDayWithPreviousDateDto;
import com.titan.poss.engine.service.SalesService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Revenue Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("revenueEngineController")
@RequestMapping(value = "engine/v2/revenues")
public class RevenueController {

	@Autowired
	private SalesService salesService;

	/**
	 * This method will be called to get the business day.
	 */
	@GetMapping("business-day")
	@ApiParam(name = "This method will be called to get the business day", value = "This method will be called to get the business day")
	public BusinessDayDto getBusinessDay(
			@RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {

		return salesService.getBusinessDay(locationCode);
	}

	/**
	 * This method will be called to get the business day for OPEN, BOD_IN_PROGRESS
	 * and EOD_IN_PROGRESS and CLOSED.
	 */
	@GetMapping("business-day/in-progress")
	@ApiOperation(value = "This API will be called to get the business day", notes = "This API gives business date in the following priority: current business date if status is 'OPEN' or 'EOD_IN_PROGRESS', else the last closed business date.<br>")
	public BusinessDayDto getBusinessDayInProgress(
			@RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {

		return salesService.getBusinessDayInProgress(locationCode);
	}

	/**
	 * This method will be called to get the latest business day.
	 */
	@GetMapping("business-day/latest")
	@PreAuthorize(IS_STORE_USER)
	@ApiOperation(value = "This API will be called to get the latest business day", notes = "This API gives the latest business date along with status and previous business date.<br>"
			+ "<b>Note: </b>This API can be accessed by store users only.<br>"
			+ "<b>Throws: </b> Error code 'ERR-SALE-143', when no business day is present.<br>")
	public BusinessDayWithPreviousDateDto getLatestBusinessDay() {

		return salesService.getLatestBusinessDay();
	}

}
