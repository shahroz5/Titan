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
import com.titan.poss.location.dto.OrgDto;
import com.titan.poss.location.dto.request.OrgUpdateDto;
import com.titan.poss.location.service.OrganizationService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("location/v2/organizations")
@Api(tags = { "orgainization-controller" })
public class OrganizationController {

	@Autowired
	private OrganizationService orgService;

	private static final String LOCATION_ORGANIZATION_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_ORGANIZATION_ADD_EDIT + "' )";

	private static final String LOCATION_ORGANIZATION_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_ORGANIZATION_VIEW + "' )";

	/**
	 * This method will return the list of Organization details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<OrgDto>>
	 */
	@ApiOperation(value = "View the list of Organization details", notes = "This API returns the list of Organization details based on **isActive**")
	@GetMapping
	@PreAuthorize(LOCATION_ORGANIZATION_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<OrgDto>> listOrganization(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return orgService.listOrganization(isActive, pageable);
	}

	/**
	 * This method will return the Organization details based on the orgCode.
	 * 
	 * @param orgCode
	 * @return OrgDto
	 */
	@ApiOperation(value = "View the Organization details based on the orgCode", notes = "This API returns the Organization details based on the **orgCode**")
	@GetMapping(value = "/{orgCode}")
	@PreAuthorize(LOCATION_ORGANIZATION_VIEW_PERMISSION)
	public OrgDto getOrganization(
			@PathVariable("orgCode") @PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX) String orgCode) {
		return orgService.getOrganization(orgCode);
	}

	/**
	 * This method will save the Organization details.
	 * 
	 * @param orgDto
	 * @return OrgDto
	 */
	@ApiOperation(value = "Save the Organization details", notes = "This API saves the Organization details")
	@PostMapping
	@PreAuthorize(LOCATION_ORGANIZATION_ADD_EDIT_PERMISSION)
	public OrgDto addOrganization(@RequestBody @Valid OrgDto orgDto) {
		return orgService.addOrganization(orgDto);
	}

	/**
	 * This method will update the Organization details.
	 * 
	 * @param orgCode
	 * @param orgUpdateDto
	 * @return OrgDto
	 */
	@ApiOperation(value = "Update the Organization details", notes = "This API updates the Organization details <br/> if **isActive** is false, then it will be soft deleted based on the **orgCode**")
	@PatchMapping(value = "/{orgCode}")
	@PreAuthorize(LOCATION_ORGANIZATION_ADD_EDIT_PERMISSION)
	public OrgDto updateOrganization(
			@PathVariable("orgCode") @PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX) String orgCode,
			@RequestBody @Valid OrgUpdateDto orgUpdateDto) {

		return orgService.updateOrganization(orgCode, orgUpdateDto);
	}

}
