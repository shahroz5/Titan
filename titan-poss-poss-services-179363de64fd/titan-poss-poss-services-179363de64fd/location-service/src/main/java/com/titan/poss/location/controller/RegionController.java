/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;

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
import com.titan.poss.location.dto.RegionDto;
import com.titan.poss.location.dto.request.RegionUpdateDto;
import com.titan.poss.location.service.RegionService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/regions")
@Api(tags = { "region-controller" })
@Validated
public class RegionController {

	@Autowired
	private RegionService regionService;

	private static final String REGION_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_REGION_VIEW + "  |   "
			+ LocationACLConstants.LOCATION_HIERARCHY_SUB_REGION_VIEW + "' )";

	private static final String REGION_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_REGION_ADD_EDIT + "  |   "
			+ LocationACLConstants.LOCATION_HIERARCHY_SUB_REGION_ADD_EDIT + "' )";





	/**
	 * This method will return the list of Region details based on the isActive.
	 * 
	 * @param isActive
	 * @param parentRegionCode
	 * @param pageable
	 * @return PagedRestResponse<List<RegionDto>>
	 */
	@ApiOperation(value = "API to view the list of Region details", notes = "This API will get the list of Region details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(REGION_VIEW_PERMISSION)
	public PagedRestResponse<List<RegionDto>> listRegion(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = REGION_CODE_REGEX) String parentRegionCode, @ApiIgnore Pageable pageable) {

		return regionService.listRegion(isActive, parentRegionCode, pageable);
	}





	/**
	 * This method will return the Region details based on the regionCode and parentRegionCode.
	 * 
	 * @param regionCode
	 * @param parentRegionCode
	 * @return RegionDto
	 */
	@ApiOperation(value = "API to view the Region details based on the regionCode and parentRegionCode", notes = "This API will get the Region details based on the **regionCode** and **parentRegionCode**")
	@GetMapping(value = "/{regionCode}")
	@PreAuthorize(REGION_VIEW_PERMISSION)
	public RegionDto getRegion(@PathVariable("regionCode") @PatternCheck(regexp = REGION_CODE_REGEX) String regionCode,
			@RequestParam(required = false) @PatternCheck(regexp = REGION_CODE_REGEX) String parentRegionCode) {
		return regionService.getRegion(parentRegionCode, regionCode);
	}





	/**
	 * This method will save the Region details.
	 * 
	 * @param regionDto
	 * @param bindingResult
	 * @return RegionDto
	 */
	@ApiOperation(value = "API to save the Region details", notes = "This API will save the Region details")
	@PostMapping
	@PreAuthorize(REGION_ADD_EDIT_PERMISSION)
	public RegionDto addRegion(@RequestBody @Valid RegionDto regionDto) {
		
		return regionService.addRegion(regionDto);
	}





	/**
	 * This method will update the Region details.
	 * 
	 * @param regionCode
	 * @param regionDto
	 * @param bindingResult
	 * @return RegionUpdateDto
	 */
	@PreAuthorize(REGION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update the Region details", notes = "This API will update the Region details")
	@PatchMapping(value = "/{regionCode}")
	public RegionDto updateRegion(@PathVariable("regionCode") @PatternCheck(regexp = REGION_CODE_REGEX) String regionCode,
			@RequestBody @Valid RegionUpdateDto regionUpdateDto) {
		
		return regionService.updateRegion(regionCode, regionUpdateDto);
	}
}
