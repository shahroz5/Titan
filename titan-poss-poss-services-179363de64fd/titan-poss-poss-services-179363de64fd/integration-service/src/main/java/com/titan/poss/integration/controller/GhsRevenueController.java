/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.integration.dto.response.GhsTodayRevenueDto;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationRevenueController")
@RequestMapping(value = "integration/v2/ghs/revenue")
public class GhsRevenueController {

	@Autowired
	private GhsService ghsService;

	@ApiOperation(value = "revenue from ghs", notes = "This API will get today's reveue details from ghs based on ***locationCode*** and ***businessDate***")
	@PostMapping(value = "")
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenue(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
		return ghsService.getGhsTodayRevenue(businessDateDto, vendorCode);
	}

	@ApiOperation(value = "revenue from ghs", notes = "This API will get reveue details from ghs based on ***locationCode*** and ***businessDate*** during EOD")
	@PostMapping(value = "eod")
	public ListResponse<GhsTodayRevenueDto> getGhsTodayRevenueForEod(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BusinessDateDto businessDateDto,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode) {
		return ghsService.getGhsTodayRevenueForEod(businessDateDto, vendorCode);
	}

}
