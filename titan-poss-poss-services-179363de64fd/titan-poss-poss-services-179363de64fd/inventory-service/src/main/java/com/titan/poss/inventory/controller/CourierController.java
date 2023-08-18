/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.AddRemoveLocationDto;
import com.titan.poss.inventory.dto.request.CourierUpdateDto;
import com.titan.poss.inventory.dto.response.CourierDto;
import com.titan.poss.inventory.service.CourierService;
import com.titan.poss.location.acl.LocationACLConstants;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("inventory/v2/couriers")
@Api(tags = { "courier-controller" })
public class CourierController {

	@Autowired
	private CourierService courierService;

	private static final String COURIER_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_COURIER_DETAILS_VIEW + "' )";

	private static final String COURIER_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_COURIER_DETAILS_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Courier details.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "Fetch the list of Courier details", notes = "This API will fetch the list of Courier details")
	@GetMapping
	@PreAuthorize(COURIER_VIEW_PERMISSION)
	public PagedRestResponse<List<CourierDto>> listCourier(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		if (BooleanUtils.isFalse(isPageable))
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		PagedRestResponse<List<CourierDto>> courierList = null;
		if (!StringUtils.isEmpty(locationCode)) {
			courierList = courierService.listCouriersByLocationByPage(isActive, locationCode, pageable);
		} else {
			courierList = courierService.listCourier(isActive, pageable);
		}

		return courierList;
	}

	/**
	 * This method will return the Courier details based on the courierName.
	 * 
	 * @param courierName
	 * @return CourierDto
	 */
	@GetMapping(value = "/{courierName}")
	@ApiOperation(value = "Fetch the Courier details based on the courierName", notes = "This API will fetch the Courier details based on the courierName")
	@PreAuthorize(COURIER_VIEW_PERMISSION)
	public CourierDto getCourier(
			@PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX) @PathVariable("courierName") String courierName) {
		return courierService.getCourier(courierName);
	}

	/**
	 * This method will save the Courier details.
	 * 
	 * @param courierDto
	 * @param bindingResult
	 * @return CourierDto
	 */
	@PostMapping
	@ApiOperation(value = "Save the Courier details", notes = "This API will save the Courier details")
	@PreAuthorize(COURIER_ADD_EDIT_PERMISSION)
	public CourierDto addCourier(@RequestBody @Valid CourierDto courierDto) {

		return courierService.addCourier(courierDto);
	}

	/**
	 * This method will update the Courier details.
	 * 
	 * @param id
	 * @param courierDto
	 * @param bindingResult
	 * @return CourierDto
	 */
	@PatchMapping(value = "/{courierName}")
	@ApiOperation(value = "Update the Courier details", notes = "This API will update the Courier details")
	@PreAuthorize(COURIER_ADD_EDIT_PERMISSION)
	public CourierDto updateCourier(
			@PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX) @PathVariable("courierName") String courierName,
			@RequestBody @Valid CourierUpdateDto courierUpdateDto) {

		return courierService.updateCourier(courierName, courierUpdateDto);
	}

	/**
	 * This method will add the CourierLocation Mapping details.
	 * 
	 * @param courierName
	 * @param addRemoveLocationDto
	 * @param bindingResult
	 * @return ResponseEntity<AddRemoveLocationDto>
	 */
	@ApiOperation(value = "Adds the Courier and Location Mapping details", notes = "This API will Add the Courier and Location Mapping details")
	@PostMapping("/{courierName}/locations")
	@PreAuthorize(COURIER_ADD_EDIT_PERMISSION)
	public ResponseEntity<AddRemoveLocationDto> addConfigLocationMapping(
			@PathVariable("courierName") @PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX) String courierName,
			@RequestBody @Valid AddRemoveLocationDto addRemoveLocationDto) {

		courierService.addRemoveLocationMapping(courierName, addRemoveLocationDto);
		return new ResponseEntity<>(addRemoveLocationDto, HttpStatus.OK);
	}

	/**
	 * This method will return the list of location codes based on courierName and
	 * isActive.
	 * 
	 * @param courierNames
	 * @param isActive
	 * @return List<String>
	 */
	@GetMapping(value = "/{courierName}/locations")
	@ApiOperation(value = "View the list of location codes", notes = "This API returns the list of location codes based on **courierName** and **isActive**")
	public ListResponse<String> getLocationCodes(
			@PatternCheck(regexp = RegExConstants.COURIER_NAME_REGEX) @PathVariable("courierName") String courierName,
			@RequestParam(required = false) Boolean isActive) {

		return courierService.getLocationCodes(courierName, isActive);

	}
}
