/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.STATE_NAME_REGEX;

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
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.request.StateCreateDto;
import com.titan.poss.location.dto.request.StateUpdateDto;
import com.titan.poss.location.dto.response.StateDto;
import com.titan.poss.location.service.StateService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/states")
@Api(tags = { "state-controller" })
@Validated
public class StateController {

	@Autowired
	private StateService stateService;

	private static final String STATE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_STATE_ADD_EDIT + " ' )";

	private static final String STATE_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_STATE_VIEW + " ' )";

	/**
	 * This method will return the list of State details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StateDto>>
	 */
	@ApiOperation(value = "API to get the list of State details", notes = "This API will get the list of State details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(STATE_VIEW_PERMISSION)
	public PagedRestResponse<List<StateDto>> listState(
			@RequestParam(required = false) @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode,
			@RequestParam(required = false) @PatternCheck(regexp = STATE_NAME_REGEX) String stateName,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {

		return stateService.listState(countryCode, stateName, isActive, isPageable, pageable);
	}

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param stateCode
	 * @return StateDto
	 */
	@ApiOperation(value = "API to view the State details based on the stateid", notes = "This API will get the State details based on the **stateCode**")
	@GetMapping(value = "/{stateId}")
	@PreAuthorize(STATE_VIEW_PERMISSION)
	public StateDto getState(
			@PathVariable("stateId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String stateId) {
		return stateService.getState(stateId);
	}

	/**
	 * This method will save the State details.
	 * 
	 * @param stateCreateDto
	 * @param bindingResult
	 * @return StateDto
	 */
	@ApiOperation(value = "API to save the State details", notes = "This API will save the State details")
	@PostMapping
	@PreAuthorize(STATE_ADD_EDIT_PERMISSION)
	public StateDto addState(@RequestBody @Valid StateCreateDto stateCreateDto) {

		return stateService.addState(stateCreateDto);
	}

	/**
	 * This method will update the State details.
	 * 
	 * @param stateCode
	 * @param stateDto
	 * @param bindingResult
	 * @return StateUpdateDto
	 */
	@ApiOperation(value = "API to update the State details", notes = "This API will update the State details")
	@PatchMapping(value = "/{stateId}")
	@PreAuthorize(STATE_ADD_EDIT_PERMISSION)
	public StateDto updateState(
			@PathVariable("stateId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String stateId,
			@RequestBody @Valid StateUpdateDto stateUpdateDto) {

		return stateService.updateState(stateId, stateUpdateDto);
	}

}
