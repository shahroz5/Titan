/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.CURRENCY_CODE_REGEX;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dto.CurrencyDto;
import com.titan.poss.location.dto.request.CurrencyCreateDto;
import com.titan.poss.location.dto.request.CurrencyUpdateDto;
import com.titan.poss.location.service.CurrencyService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/currencies")
@Api(tags = { "currency-controller" })
@Validated
public class CurrencyController {

	@Autowired
	private CurrencyService currencyService;

	private static final String CURRENCY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_CURRENCY_CODE_ADD_EDIT + " ' )";

	private static final String CURRENCY_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_CURRENCY_CODE_VIEW + " ' )";

	/**
	 * This method will return the list of Currencies based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CurrencyDto>>
	 */
	@PreAuthorize(CURRENCY_VIEW_PERMISSION)
	@ApiOperation(value = "API to view the list of Currency details", notes = "This API will get the list of Currency details based on **isActive** <br/> if **isActive** is null, then it will provide all the results")
	@GetMapping
	@ApiPageable
	public PagedRestResponse<List<CurrencyDto>> listCurrency(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {

		return currencyService.listCurrency(isActive, pageable);
	}

	/**
	 * This method will return the Currency details based on the currencyCode.
	 * 
	 * @param currencyCode
	 * @return CurrencyDto
	 */
	@PreAuthorize(CURRENCY_VIEW_PERMISSION)
	@ApiOperation(value = "API to view the Currency details based on the currencyCode", notes = "This API will get the Currency details based on the **currencyCode**")
	@GetMapping(value = "/{currencyCode}")
	public CurrencyDto getCurrency(
			@PathVariable("currencyCode") @PatternCheck(regexp = CURRENCY_CODE_REGEX) String currencyCode) {
		return currencyService.getCurrency(currencyCode);
	}

	/**
	 * This method will save the Currency details.
	 * 
	 * @param currencyDto
	 * @param bindingResult
	 * @return CurrencyDto
	 */
	@PreAuthorize(CURRENCY_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to save the Currency details", notes = "This API will save the Currency details")
	@PostMapping
	public CurrencyDto addCurrency(@RequestBody @Valid CurrencyCreateDto currencyDto) {
		return currencyService.addCurrency(currencyDto);
	}

	/**
	 * This method will update the Currency details.
	 * 
	 * @param currencyCode
	 * @param currencyDto
	 * @param bindingResult
	 * @return CurrencyUpdateDto
	 */
	@PreAuthorize(CURRENCY_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to Update the Currency details", notes = "This API will update the Currency details")
	@PatchMapping(value = "/{currencyCode}")
	public CurrencyDto updateCurrency(
			@PathVariable("currencyCode") @PatternCheck(regexp = CURRENCY_CODE_REGEX) String currencyCode,
			@RequestBody @Valid CurrencyUpdateDto currencyUpdateDto) {
		return currencyService.updateCurrency(currencyCode, currencyUpdateDto);
	}

	@PreAuthorize(CURRENCY_VIEW_PERMISSION)
	@GetMapping(value = "/datasync/{currencyCode}")
	@ApiOperation(value = "API to view the Currency object based on the currencyCode")
	public CurrencyDao getCurrencyDao(
			@PathVariable("currencyCode") @PatternCheck(regexp = CURRENCY_CODE_REGEX) String currencyCode) {
		return currencyService.getCurrencyDao(currencyCode);
	}
}
