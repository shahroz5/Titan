/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.BIT_OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_LOCATION_ADD_EDIT;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_LOCATION_TYPE_VIEW;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_LOCATION_VIEW;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_OWNER_INFO_VIEW;

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

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.location.dto.LovCreateDto;
import com.titan.poss.location.dto.constants.LovTypeEnum;
import com.titan.poss.location.dto.request.LovUpdateDto;
import com.titan.poss.location.dto.response.LovTypesDto;
import com.titan.poss.location.service.LovService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("LocationLovController")
@RequestMapping("location/v2/lovs")
@Validated
public class LovController {

	@Autowired
	private LovService lovService;

	// lov should be corrected...
	// @formatter:off
	private static final String LOV_ADD_EDIT_PERMISSION = START	+ LOCATION_HIERARCHY_LOCATION_ADD_EDIT + END;

	private static final String LOV_TYPE_VIEW_PERMISSION = START
			+ LOCATION_HIERARCHY_LOCATION_VIEW + BIT_OR
			+ LOCATION_HIERARCHY_OWNER_INFO_VIEW + BIT_OR
			+ LOCATION_HIERARCHY_LOCATION_TYPE_VIEW + END;
	// @formatter:on

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@ApiOperation(value = "View the list of lovTypes", notes = "View the list of lovTypes")
	@GetMapping(value = "/lov-types")
	@PreAuthorize(LOV_TYPE_VIEW_PERMISSION)
	public LovTypesDto getLovTypes() {
		return lovService.getLocationLovTypes();
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "View the Lov details based on **lovType**")
	@GetMapping(value = "/{lovType}")
	public LovDto getLov(
			@ApiParam(name = "lovType", value = "'lovType' to get details", allowableValues = "LOCATIONTYPE, OWNERTYPE, LOCATIONFORMAT,  TAXSYSTEM, TAXTRANSACTIONTYPE, MATERIALPRICETYPE, DATEFORMAT, TIMEFORMAT,PRINT_DOC_TYPE, TEPPARTIALCNCANCELLATION", required = true) @PathVariable("lovType") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@ApiParam(name = "isActive", value = "'isActive' to get active or inactive") @RequestParam(required = false) Boolean isActive) {
		return lovService.getLocationLov(lovType, isActive); 
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@ApiOperation(value = "Create the Lov details", notes = "Create the Lov details based on **lovType**")
	@PostMapping
	@PreAuthorize(LOV_ADD_EDIT_PERMISSION)
	public LovCreateDto createLov(@RequestBody @Valid LovCreateDto lovCreateDto) {

		return lovService.createLov(lovCreateDto);

	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@ApiOperation(value = "Update the Lov details", notes = "Update the Lov details based on **lovType**" + ""
			+ "<span style=\"font-weight: bold;font-size:14px;\">LOV Types:</span><br>" + "<ul>"
			+ "	<li>ROLE_TYPE</li>" + "	<li>USER_TYPE</li>" + "</ul>")
	@PatchMapping(value = "/{lovType}")
	@PreAuthorize(LOV_ADD_EDIT_PERMISSION)
	public LovDto updateLov(
			@ApiParam(name = "lovType", value = "'lovType' to update details", allowableValues = "LOCATIONTYPE, OWNERTYPE, LOCATIONFORMAT, MATERIALPRICETYPE, DATEFORMAT, TIMEFORMAT,PRINT_DOC_TYPE , TEPPARTIALCNCANCELLATION", required = true) @PathVariable("lovType") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestBody @Valid LovUpdateDto lovUpdateDto) {

		return lovService.updateLov(lovType, lovUpdateDto);
	}

}
