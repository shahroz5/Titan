/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.location.dto.request.MetalPriceConfigRequest;
import com.titan.poss.location.dto.request.MetalPriceStagingRequestDto;
import com.titan.poss.location.dto.response.LocationPriceResponse;
import com.titan.poss.location.service.PriceService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("locationPriceController")
@RequestMapping("location/v2/price")
@Api(tags = { "price-controller" })
@Validated
public class PriceController {

	public static final String USER = "workflowUser";

	@Autowired
	private PriceService priceService;

	// @formatter:off
		@ApiOperation(value = "API sequence no.1, to set a new BasePrice", notes = " </br> **Request for updating basePrice for a applicableDay:"
				+ "</br><b>sampleRequest: **"
				+ "<pre></br>\t{"
				+ "</br>\t\t \"applicableDate\": \"2020-09-12\","
				+ "</br>\t\t \"basePrice\": 4700,"
				+ "</br>\t\t \"priceType\": \"F\","
				+ "</br>\t\t \"metalTypeCode\": \"J\""
				+ "</br>\t}</pre>"
				+ "</br><b>available metalTypeCode-- ['J'-Gold, 'L'-Platinum, 'P'-Silver]"
				+ "</br><b>available priceType-- ['F'-Forced]"
				+ "</br>")
		@PostMapping() // metals or metal-rates or metals-rate
		// @formatter:on

	public LocationPriceResponse updateMetalConfig(@RequestBody @Valid MetalPriceConfigRequest metalPriceRequest) {
		isWorkflowUser();
		return priceService.updateMetalConfig(metalPriceRequest);
	}

	// Following API's are reflecting for MetalPriceLocationMapping Table
	/**
	 * This method will save the data in metal price staging table by calculating
	 * Computing Price details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkuupMappingDto
	 */
	// @formatter:off
	@ApiOperation(value = "API sequence no.2, to trigger new marketPrice for any metal", notes = "</br> **Request for updating metal price for gold(J) metal type, for marketCode AA**"
			+ "</br> <b>**sample Request:** "
			+ "</br><pre>\t{"
			+ "</br> \t \"applicableDate\": \"2020-07-24\","
			+ "</br> \t \"approvalId\": \"ApprvalS1\","
			+ "</br> \t \"marketRates\": ["
			+ "</br>\t    {"
			+ "</br> \t\t \"addAmount\": 10,"
			+ "</br> \t\t \"deductAmount\": 20,"
			+ "</br> \t\t \"marketCode\": \"AA\" "
			+ "</br>\t 	  }"
			+ "</br>\t],\"metalTypeCode\": \"J\" "
			+ "</br>}</pre>"

			
			+ "</br> </b> **API is also used for multiple markets price update. "
			+ "</br> <pre> </b>sample Request:** "
			+ "</br>\t {"
			+ "</br>\t \"applicableDate\": \"2020-07-24\","
			+ "</br>\t \"approvalId\": \"ApprovalM1\","
			+ "</br>\t \"marketRates\": ["
			+ "</br>\t\t{"
			+ "</br> \t\t   \"addAmount\": 10,"
			+ "</br> \t\t   \"deductAmount\": 20,"
			+ "</br> \t\t   \"marketCode\": \"AA\" "
			+ "</br>\t\t},"
			+ "</br>\t\t{"
			+ "</br> \t\t   \"addAmount\": 10,"
			+ "</br> \t\t   \"deductAmount\": 20,"
			+ "</br> \t\t   \"marketCode\": \"KA\""
			+ "</br>\t\t},"
			+ "</br>\t\t{"
			+ "</br> \t\t   \"addAmount\": 10,"
			+ "</br> \t\t   \"deductAmount\": 20,"
			+ "</br> \t\t   \"marketCode\": \"AB\""
			+ "</br>\t\t}"
			+ "</br>\t], \"metalTypeCode\": \"J\""
			+ "</br>\t } </pre>"
			
			+ "</br></br></br> **available metalTypeCode-- ['J'-Gold, 'L'-Platinum, 'P'-Silver]"
			+ "</br>available priceType-- ['F'-Forced]**")
	@PostMapping(value = "/markets")
	// @formatter:on
	/**
	 * API to trigger marketPricing to staging table, internally updates
	 * market_metal_mappping, updates metal_price_location_mapping updates
	 * metal_price_location_mapping_history for all the locations.
	 */
	public LocationPriceResponse updateMetalPriceMapping(
			@RequestBody @Valid MetalPriceStagingRequestDto marketMateriaDto) {
		isWorkflowUser();
		return priceService.updateMetalPriceMapping(marketMateriaDto);

	}

	private boolean isWorkflowUser() {
		return CommonUtil.getAuthUser().getEmployeeCode().equals(USER);
	}
}
