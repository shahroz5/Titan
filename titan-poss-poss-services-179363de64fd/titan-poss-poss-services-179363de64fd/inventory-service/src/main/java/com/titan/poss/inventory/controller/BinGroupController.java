/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_API_USER;

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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dto.request.BinGroupUpdateDto;
import com.titan.poss.inventory.dto.response.BinCodeDto;
import com.titan.poss.inventory.dto.response.BinGroupDto;
import com.titan.poss.inventory.dto.response.BinLocationDto;
import com.titan.poss.inventory.dto.response.LocationCodeDto;
import com.titan.poss.inventory.service.BinGroupService;
import com.titan.poss.location.acl.LocationACLConstants;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "inventory/v2/bingroups")
@Validated
public class BinGroupController {

	@Autowired
	private BinGroupService binGroupService;

	private static final String BIN_GROUP_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_BIN_GROUP_VIEW + "' )";

	private static final String BIN_GROUP_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_BIN_GROUP_ADD_EDIT + "' )";

	/**
	 * This method will return the list of BinGroup details based on isActive,
	 * locationCode and isPageable.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinGroupDto>>
	 */
	@GetMapping
	@ApiOperation(value = "View the list of BinGroup details", notes = "This API returns the list of BinGroup details based on **isActive**, **locationCode** and **isPageable** <br/> if **isActive** is null, then it will return total list of BinGroup details")
	@ApiPageable
	@PreAuthorize(BIN_GROUP_VIEW_PERMISSION)
	public PagedRestResponse<List<BinGroupDto>> listBinGroup(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return binGroupService.listBinGroup(isActive, locationCode, isPageable, pageable);

	}

	/**
	 * This method will return the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @return BinGroupDto
	 */
	@GetMapping(value = "/{binGroupCode}")
	@ApiOperation(value = "View the BinGroup details", notes = "This API returns the BinGroup details based on the **binGroupCode**")
	@PreAuthorize(BIN_GROUP_VIEW_PERMISSION)
	public BinGroupDto getBinGroup(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode) {

		return binGroupService.getBinGroup(binGroupCode);

	}

	/**
	 * This method will save the BinGroup details.
	 * 
	 * @param binGroupDto
	 * @param bindingResult
	 * @return BinGroupDto
	 */
	@PostMapping
	@ApiOperation(value = "Save the BinGroup details", notes = "This API saves the BinGroup details")
	@PreAuthorize(BIN_GROUP_ADD_EDIT_PERMISSION)
	public BinGroupDto addBinGroup(@RequestBody @Valid BinGroupDto binGroupDto) {

		return binGroupService.addBinGroup(binGroupDto);

	}

	/**
	 * This method will update the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @param binGroupDto
	 * @param bindingResult
	 * @return BinGroupDto
	 */
	@PatchMapping(value = "/{binGroupCode}")
	@ApiOperation(value = "Update the BinGroup details", notes = "This API updates the BinGroup details based on the **binGroupCode**")
	@PreAuthorize(BIN_GROUP_ADD_EDIT_PERMISSION)
	public BinGroupDto updateBinGroup(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestBody @Valid BinGroupUpdateDto binGroupUpdateDto) {

		return binGroupService.updateBinGroup(binGroupCode, binGroupUpdateDto);

	}

	/**
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode, isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	@GetMapping(value = "/{binGroupCode}/bins")
	@ApiOperation(value = "View the list of Bin details", notes = "This API returns the list of Bin details based on   **binGroupCode**, **locationCode**, **isActive** and **isPageable** <br/> if **isActive** is null, then it will return total list of Bin details based on **binGroupCode** and **locationCode**")
	@ApiPageable
	@PreAuthorize(BIN_GROUP_VIEW_PERMISSION)
	public PagedRestResponse<List<BinCodeDto>> listBin(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return binGroupService.listBin(binGroupCode, locationCode, isActive, isPageable, pageable);

	}

	/**
	 * This method will return the list of location codes based on binGroupCode,
	 * binCodes and isActive.
	 * 
	 * @param binGroupCode
	 * @param binCodes
	 * @param isActive
	 * @return List<LocationCodeDto>
	 */
	@GetMapping(value = "/{binGroupCode}/locations")
	@ApiOperation(value = "View the list of location codes", notes = "This API returns the list of location codes based on **binGroupCode**, **binCodes** and **isActive**")
	public ListResponse<LocationCodeDto> getLocationCodes(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = true) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCodes,
			@RequestParam(required = false) Boolean isActive) {

		return binGroupService.getLocationCodes(binGroupCode, binCodes, isActive);

	}

	/**
	 * This method will create/remove mapping between BinGroup details and
	 * locations.
	 * 
	 * @param binGroupCode
	 * @param binLocationDto
	 * @param bindingResult
	 * @return BinLocationDto
	 */
	@PatchMapping(value = "/{binGroupCode}/locations")
	@ApiOperation(value = "Create/Remove Mapping between BinGroup details and locations", notes = "This API creates/removes Mapping between BinGroup details and locations")
	public BinLocationDto locationsMapping(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestBody @Valid BinLocationDto binLocationDto) {

		return binGroupService.locationsMapping(binGroupCode, binLocationDto);

	}

	/**
	 * This method will return the BinGroup details based on the binGroupCode.
	 * 
	 * @param binGroupCode
	 * @return BinGroupDto
	 */
	@GetMapping(value = "/datasync/{binGroupCode}")
	@ApiOperation(value = "View the BinGroup details", notes = "This API returns the BinGroup details based on the **binGroupCode**")
	@PreAuthorize(IS_API_USER)
	public BinGroupDao getBinGroupDao(
			@PathVariable("binGroupCode") @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode) {

		return binGroupService.getBinGroupDao(binGroupCode);

	}

}
