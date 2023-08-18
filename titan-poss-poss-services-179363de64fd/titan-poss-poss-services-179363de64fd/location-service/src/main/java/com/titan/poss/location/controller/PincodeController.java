/*  Copyright 2019. Titan Company Limited
	*  All rights reserved.
	*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.PIN_CODE_REGEX;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.request.PincodeCreateDto;
import com.titan.poss.location.dto.response.PincodeDto;
import com.titan.poss.location.service.PincodeService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/pincodes")
@Api(tags = { "pincode-controller" })
@Validated
public class PincodeController {
	@Autowired
	private PincodeService pincodeService;

	private static final String PINCODE_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_PINCODE_VIEW + "' )";

	private static final String PINCDOE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_PINCODE_ADD_EDIT + "' )";

	/**
	 * This method will return the list of pincode.
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<PincodeDto>>
	 * 
	 */
	@ApiOperation(value = "API to view the list of pincodes", notes = "This API will get the list of pincodes")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PINCODE_VIEW_PERMISSION)
	public PagedRestResponse<List<PincodeDto>> listPincode(@RequestParam(required = true) @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode,
			@RequestParam(required = false) @PatternCheck(regexp = PIN_CODE_REGEX)  String pincode, @RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {

		return pincodeService.listPincode(countryCode, pincode, isActive, pageable);
	}
	
	/**
	 * This method will return the pincode details.
	 * 
	 * @param id
	 * @param countryCode
	 * @return PincodeDto
	 */
	@ApiOperation(value = "API to view the Pincode details", notes = "This API will get the Pincode details ")
	@GetMapping(value = "/{id}")
	@PreAuthorize(PINCODE_VIEW_PERMISSION)
	public PincodeDto getPincode(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return pincodeService.getPincode(id);
	}

	/**
	 * This method will save the Pincode details.
	 * 
	 * @param PincodeCreateDto
	 * @return PincodeDto
	 * 
	 */
	@ApiOperation(value = "API to save the pincode details", notes = "This API will save the pincode details")
	@PostMapping
	@PreAuthorize(PINCDOE_ADD_EDIT_PERMISSION)
	public PincodeDto addPincode(@RequestBody @Valid PincodeCreateDto pincodeCreateDto) {

		return pincodeService.addPincode(pincodeCreateDto);
	}

	/**
	 * This method will update the pincode details.
	 * 
	 * @param pincodeCreateDto
	 * @param id
	 * @return PincodeDto
	 * 
	 */
	@ApiOperation(value = "API to update the pincode details", notes = "This API will update the pincode details based on **id**")
	@PutMapping(value = "/{id}")
	@PreAuthorize(PINCDOE_ADD_EDIT_PERMISSION)
	public PincodeDto updatePincode(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid PincodeCreateDto pincodeCreateDto) {

		return pincodeService.updatePincode(id, pincodeCreateDto);
	}
}
