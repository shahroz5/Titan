/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;

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
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.request.CountryCreateDto;
import com.titan.poss.location.dto.request.CountryUpdateDto;
import com.titan.poss.location.service.CountryService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/countries")
@Api(tags = { "country-controller" })
@Validated
public class CountryController {

	@Autowired
	private CountryService countryService;

	private static final String COUNTRY_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_COUNTRY_ADD_EDIT + " ' )";

	private static final String COUNTRY_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_COUNTRY_VIEW + " ' )";

	/**
	 * This method will return the list of Country details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CountryDto>>
	 */
	@ApiOperation(value = "API to view the list of Country details", notes = "This API will get the list of Country details based on **isActive** <br/> "
			+ "if **isActive** is null, then it will provide all the results.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(COUNTRY_VIEW_PERMISSION)
	public PagedRestResponse<List<CountryDto>> listCountry(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String description,
			@ApiIgnore Pageable pageable) {
		return countryService.listCountry(isActive, description, pageable);
	}

	/**
	 * This method will return the Country details based on the countryCode.
	 * 
	 * @param countryCode
	 * @return CountryDto
	 */
	@ApiOperation(value = "API to view the Country details based on the countryCode", notes = "This API will get the Country details based on the **countryCode**")
	@GetMapping(value = "/{countryCode}")
	@PreAuthorize(COUNTRY_VIEW_PERMISSION)
	public CountryDto getCountry(
			@PathVariable("countryCode") @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode) {
		return countryService.getCountry(countryCode);
	}

	/**
	 * This method will save the Country details.
	 * 
	 * @param countryDto
	 * @param bindingResult
	 * @return CountryDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to save the Country details", notes = "This API will save the Country details.<br>"
			+ "**fiscalYearStart** & **fiscalYearEnd** should be in **MMM** format." 
			+ "<ul>"
			+ "<li>JAN	 	---- valid</li>" 
			+ "<li>DEC   	---- valid</li>" 
			+ "<li>jan   	---- invalid</li>"
			+ "<li>Jan   	-----invalid</li>" 
			+ "<li>January  -----invalid</li>" 
			+ "</ul>")
	// @formatter:on
	@PostMapping
	@PreAuthorize(COUNTRY_ADD_EDIT_PERMISSION)
	public CountryDto addCountry(
			@RequestBody @Valid @ApiParam(name = "body", value = "country object that needs to be added", required = true) CountryCreateDto countryDto) {
		return countryService.addCountry(countryDto);
	}

	/**
	 * This method will update the Country details.
	 * 
	 * @param countryCode
	 * @param countryDto
	 * @param bindingResult
	 * @return CountryUpdateDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to Update the Country details", notes = "This API will update the Country details.<br>"
			+ "**fiscalYearStart** & **fiscalYearEnd** should be in **MMM** format. " 
			+ "<ul>"
			+ "<li>JAN	 	---- valid</li>" 
			+ "<li>DEC   	---- valid</li>" 
			+ "<li>jan   	---- invalid</li>"
			+ "<li>Jan   	-----invalid</li>" 
			+ "<li>January  -----invalid</li>" 
			+ "</ul>")
	// @formatter:on
	@PatchMapping(value = "/{countryCode}")
	@PreAuthorize(COUNTRY_ADD_EDIT_PERMISSION)
	public CountryDto updateCountry(
			@PathVariable("countryCode") @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode,
			@RequestBody @Valid @ApiParam(name = "body", value = "country object that needs to be updated", required = true) CountryUpdateDto countryUpdateDto) {
		return countryService.updateCountry(countryCode, countryUpdateDto);
	}

}
