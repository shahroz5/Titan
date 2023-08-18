/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.response.ExchangeRateDto;
import com.titan.poss.location.service.ExchangeRateService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/exchange-rates")
@Validated
public class ExchangeRateController {

	@Autowired
	private ExchangeRateService exchangeRateService;

	private static final String EXCHANGE_RATE_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_EXCHANGE_RATE_VIEW + " ' )";

	/**
	 * This method will return the list of exchange rate based on the isActive.
	 * 
	 * @param isActive
	 * @param fromCurrency
	 * @param toCurrency
	 * @param pageable
	 * @return PagedRestResponse<List<ExchangeRateDto>>
	 */
	@ApiOperation(value = "View the list of exchange rate", notes = "This API returns the list of exchange rate based on **isActive**,**fromCurrency**,**toCurrency**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(EXCHANGE_RATE_VIEW_PERMISSION)
	public PagedRestResponse<List<ExchangeRateDto>> listExchangeRate(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = CURRENCY_CODE_REGEX) String fromCurrency,
			@RequestParam(required = false) @PatternCheck(regexp = CURRENCY_CODE_REGEX) String toCurrency,
			@ApiIgnore Pageable pageable) {
		return exchangeRateService.listExchangeRate(isActive, fromCurrency, toCurrency, pageable);
	}

}
