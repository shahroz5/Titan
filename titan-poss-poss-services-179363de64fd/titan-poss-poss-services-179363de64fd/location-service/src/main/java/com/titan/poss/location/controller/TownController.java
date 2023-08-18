/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

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
import com.titan.poss.location.dto.request.TownCreateDto;
import com.titan.poss.location.dto.request.TownUpdateDto;
import com.titan.poss.location.dto.response.TownDto;
import com.titan.poss.location.service.TownService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/towns")
@Api(tags = { "town-controller" })
@Validated
public class TownController {

	@Autowired
	private TownService townService;

	private static final String TOWN_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_CORPORATE_TOWN_MASTER_VIEW + "' )";

	private static final String TOWN_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_CORPORATE_TOWN_MASTER_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Town details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TownDto>>
	 */
	@ApiOperation(value = "API to get the list of Town details", notes = "This API will get the list of Town details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(TOWN_VIEW_PERMISSION)
	public PagedRestResponse<List<TownDto>> listTown(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) String stateId,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.TOWN_NAME_REGEX) String townName,
			@ApiIgnore Pageable pageable) {
		return townService.listTown(stateId, townName, isActive, pageable);
	}

	/**
	 * This method will return the Town details based on the townCode.
	 * 
	 * @param townCode
	 * @return TownDto
	 */
	@ApiOperation(value = "API to get the Town details based on the townCode", notes = "This API will get the Town details based on the **townCode**")
	@GetMapping(value = "/{townId}")
	@PreAuthorize(TOWN_VIEW_PERMISSION)
	public TownDto getTown(@PathVariable("townId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String townId) {
		return townService.getTown(townId);
	}

	/**
	 * This method will save the Town details.
	 * 
	 * @param townCreateDto
	 * @param bindingResult
	 * @return TownDto
	 */
	@ApiOperation(value = "API to save the Town details", notes = "This API will save the Town details")
	@PostMapping
	@PreAuthorize(TOWN_ADD_EDIT_PERMISSION)
	public TownDto addTown(
			@RequestBody @Valid @ApiParam(name = "body", value = "'town' object that needs to be created", required = true) TownCreateDto townCreateDto) {
		return townService.addTown(townCreateDto);
	}

	/**
	 * This method will update the Town details.
	 * 
	 * @param townCode
	 * @param townDto
	 * @param bindingResult
	 * @return TownUpdateDto
	 */
	@ApiOperation(value = "API to update the Town details", notes = "This API will update the Town details")
	@PatchMapping(value = "/{townId}")
	@PreAuthorize(TOWN_ADD_EDIT_PERMISSION)
	public TownDto updateTown(@PathVariable("townId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String townId,
			@RequestBody @Valid @ApiParam(name = "body", value = "'town' object that needs to be updated", required = true) TownUpdateDto townUpdateDto) {
		return townService.updateTown(townId, townUpdateDto);
	}
}
