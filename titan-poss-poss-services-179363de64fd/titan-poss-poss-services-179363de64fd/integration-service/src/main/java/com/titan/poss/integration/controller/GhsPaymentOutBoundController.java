/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;
import com.titan.poss.integration.service.GhsService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationGhsPaymentOutboundController")
@RequestMapping("integration/v2/ghs/cash-payments/outbound")
public class GhsPaymentOutBoundController {

	@Autowired
	private GhsService ghsService;

	@ApiOperation(value = "API to get cash paid for the busines date at current location.", notes = "API to get cash paid for the busines date at current location.<br>"
			+ "<b>NOTE: </b>This API will be used by EGHS to get cash payment details.<br>")
	@GetMapping(value = "")
	public PossCashPaidDetailsDto getCashCollectedAtPOSS(
			@ApiParam(name = "searchType", value = "Provide 'searchType'", required = true, allowableValues = "MOBILE_NO, ULP_ID") @RequestParam(name = "searchType", required = true) @ValueOfEnum(enumClass = SearchTypeEnum.class) String searchType,
			@ApiParam(name = "searchValue", value = "Provide 'searchValue'", required = true) @RequestParam(name = "searchValue", required = true) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true) String searchValue,
			@ApiParam(name = "businessDate", value = "Provide 'businessDate'", required = true) @RequestParam(name = "businessDate", required = true) @PatternCheck(regexp = "^\\d{4}-\\d{2}-\\d{2}$", nullCheck = true) String businessDate,
			@ApiParam(name = "locationCode", value = "Provide 'locationCode'", required = true) @RequestParam(name = "locationCode", required = true) String locationCode) {

		return ghsService.getCashCollectedAtPOSS(searchType, searchValue, businessDate, locationCode);

	}
}
