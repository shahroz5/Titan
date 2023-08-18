/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_API_USER;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.inventory.dao.BinDaoExt;
import com.titan.poss.inventory.dto.request.BinCreateDto;
import com.titan.poss.inventory.dto.request.BinUpdateDto;
import com.titan.poss.inventory.dto.response.BinDto;
import com.titan.poss.inventory.service.BinService;
import com.titan.poss.location.acl.LocationACLConstants;

import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "inventory/v2/bins")
@Validated
public class BinController {

	@Autowired
	private BinService binService;

	private static final String BIN_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_BIN_CODE_VIEW + "' )";

	private static final String BIN_VIEW_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.INVENTORY_CONFIGURATIONS_BIN_CODE_ADD_EDIT + "' )";

	/**
	 * This method will return the Bin details based on the binCode and isActive.
	 * 
	 * @param binCode
	 * @param isActive
	 * @return BinDto
	 */
	@GetMapping(value = "/{binCode}")
	@ApiOperation(value = "View the Bin details", notes = "This API returns the Bin details based on the **binCode** and **isActive** <br/> if **isActive** is null, then it will return total list of BinGroup details based on **binCode**")
	@PreAuthorize(BIN_VIEW_PERMISSION)
	public BinDto getBin(@PathVariable("binCode") @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) Boolean isActive) {

		return binService.getBin(binCode, binGroupCode, isActive);

	}

	/**
	 * This method will save the Bin details.
	 * 
	 * @param binCreateDto
	 * @param bindingResult
	 * @return BinDto
	 */
	@PostMapping
	@ApiOperation(value = "Save the Bin details", notes = "This API saves the Bin details")
	@PreAuthorize(BIN_VIEW_ADD_EDIT_PERMISSION)
	public BinDto addBin(@RequestBody @Valid BinCreateDto binCreateDto) {

		return binService.addBin(binCreateDto);

	}

	/**
	 * This method will update the Bin details based on the binCode.
	 * 
	 * @param binCode
	 * @param binUpdateDto
	 * @param bindingResult
	 * @return BinUpdateDto
	 */
	@PatchMapping(value = "/{binCode}")
	@ApiOperation(value = "Update the Bin details", notes = "This API updates the Bin details based on the **binCode**")
	@PreAuthorize(BIN_VIEW_ADD_EDIT_PERMISSION)
	public BinUpdateDto updateBin(
			@PathVariable("binCode") @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode,
			@RequestBody @Valid BinUpdateDto binUpdateDto) {

		return binService.updateBin(binCode, binUpdateDto);

	}

	/**
	 * This method will return the Bin details based on the binCode and isActive.
	 * 
	 * @param binCode
	 * @param isActive
	 * @return BinDto
	 */
	@GetMapping(value = "/datasync/{binCode}")
	@ApiOperation(value = "View the Bin details", notes = "This API returns the Bin details based on the **binCode** and **isActive** <br/> if **isActive** is null, then it will return total list of BinGroup details based on **binCode**")
	@PreAuthorize(IS_API_USER)
	public BinDaoExt getBinDao(@PathVariable("binCode") @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode,
			@RequestParam @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binGroup) {

		return binService.getBinDao(binCode, binGroup);

	}

}
