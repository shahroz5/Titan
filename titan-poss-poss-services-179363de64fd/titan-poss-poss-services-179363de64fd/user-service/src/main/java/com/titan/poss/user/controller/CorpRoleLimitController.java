/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.CORP_APPROVE_ROLE_LIMIT_REQ;
import static com.titan.poss.core.domain.acl.UserAccessControls.CORP_VIEW_ROLE_LIMIT_REQ;
import static com.titan.poss.core.domain.acl.UserAccessControls.UPDATE_ROLE_LIMIT;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_CORP_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_LOCATION_ADD_EDIT;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;

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
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.ReqLocationRoleDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;
import com.titan.poss.user.facade.CorpRoleLimitFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for corporate user role limit management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/corp/role-limits")
public class CorpRoleLimitController {

	@Autowired
	CorpRoleLimitFacade corpRoleLimitFacade;

	private static final String LOCATION_ADD_EDIT_PERMISSION = START + LOCATION_HIERARCHY_LOCATION_ADD_EDIT + END;
	private static final String VIEW_ROLE_LIMIT_REQ_PERMISSION = START + CORP_VIEW_ROLE_LIMIT_REQ + END;
	private static final String UPDATE_ROLE_LIMIT_PERMISSION = START + UPDATE_ROLE_LIMIT + END;
	private static final String APPROVE_ROLE_LIMIT_REQ_PERMISSION = START + CORP_APPROVE_ROLE_LIMIT_REQ + END;

	// @formatter:off
	@ApiOperation(value = "Required for assigning roles to a newly created BTQ,  will be used By location-controller in inter-service", notes = "This API will be called by Location Controller while creating store to assign role limit<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Location Format:</span><br>"
			+ "<ul><li>LF</li>"
			+ "<li>MF</li>"
			+ "<li>SF</li>"
			+ "<li>MICF</li></ul>")
	// @formatter:on
	@PostMapping(value = "/locations/{locationCode}")
	@PreAuthorize(IS_CORP_USER + AND + LOCATION_ADD_EDIT_PERMISSION)
	public void setLocationRoleLimit(
			@ApiParam(name = "locationCode", value = "'locationCode' to set role limit", required = true) @PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true) String locationCode,
			@ApiParam(name = "body", value = "Location role object to set role limit", required = true) @RequestBody @Valid ReqLocationRoleDto reqLocationRoleDto) {
		corpRoleLimitFacade.setLocationRoleLimit(locationCode, reqLocationRoleDto.getLocationFormat(),
				reqLocationRoleDto.getOwnerType());
	}

	@ApiPageable
	@GetMapping(value = "")
	// @formatter:off
	@ApiOperation(value = "View a list of requests", notes = "This API will list all the role limit requests in pageable format<br>"+
			"You can filter by **'request status'** or **'location code'**<br><br>"+
			"<span style=\"font-weight: bold;font-size:14px;\">Request Status:</span><br>"
			+ "<ul>"
			+ "	<li>PENDING - Request is created but action has not been taked by Admin.</li>"
			+ "	<li>REJECTED - Request is rejected by Admin.</li>" 
			+ "	<li>APPROVED - All roles are approved by Admin.</li>" 
			+ "	<li>PARTIAL_APPROVED - Some roles are approved by Admin.</li>"
			+ " <li>CANCELLED - Request is cancelled automatically because of new request made.</li>"
			+ "</ul>")
	// @formatter:on
	@PreAuthorize(IS_CORP_USER + AND + VIEW_ROLE_LIMIT_REQ_PERMISSION)
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(
			@ApiParam(value = "Provide if you want to search by 'status' of role limit request", allowableValues = "PENDING, CANCELLED, REJECTED, APPROVED, PARTIAL_APPROVED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = RoleLimitRequestStatus.class) String status,
			@ApiParam(value = "Provide if you want to search by 'locationCode'", required = false) @RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String locationCode,
			@ApiParam(value = "Provide if you want to search by 'Doc No'", required = false) @RequestParam(name = "docNo", required = false) @Min(1) Integer docNo,
			@ApiIgnore Pageable pageable) {
		return corpRoleLimitFacade.listAllRequests(locationCode, (status != null) ? status : null, docNo, pageable);
	}

	@GetMapping(value = "/{id}/requests")
	@PreAuthorize(IS_CORP_USER + AND + VIEW_ROLE_LIMIT_REQ_PERMISSION)
	@ApiOperation(value = "View role limit request details of a particular request id", notes = "This API will list the role limit request details of a particular id in pageable format<br>")
	public RequestDetailsDto getRoleRequestDetails(
			@ApiParam(name = "id", value = "'id' to get role limit request details", required = true) @PathVariable("id") @Min(1) Integer id) {
		return corpRoleLimitFacade.getRoleRequestDetails(id);
	}

	@PatchMapping(value = "/locations/{locationCode}")
	@PreAuthorize(IS_CORP_USER + AND + UPDATE_ROLE_LIMIT_PERMISSION)
	@ApiOperation(value = "Update role limits in store", notes = "This api will update role limits in store based on **'location code'**<br>")
	public void roleLimitChange(
			@ApiParam(name = "locationCode", value = "'locationCode' to edit role limits", required = true) @PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = true) String locationCode,
			@ApiParam(name = "body", value = "Role limit change object to edit role limits", required = true) @RequestBody @Valid RoleChangeRequestDto roleChangeRequestDto) {
		corpRoleLimitFacade.roleLimitChange(locationCode, roleChangeRequestDto);
	}

	@PatchMapping(value = "/requests/{id}")
	@PreAuthorize(IS_CORP_USER + AND + APPROVE_ROLE_LIMIT_REQ_PERMISSION)
	// @formatter:off
	@ApiOperation(value = "Update role limits in store on request", notes = "This api will update role limits in store on request by a particular store<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Request Status:</span><br>" 
			+ "<ul>"
			+ "	<li>PENDING</li>"
			+ "	<li>REJECTED</li>" 
			+ "	<li>APPROVED</li>" 
			+ "	<li>PARTIAL_APPROVED</li>"
			+ "</ul>")
	// @formatter:on
	public void roleLimitApprove(
			@ApiParam(name = "id", value = "'id' to edit role limits", required = true) @PathVariable("id") @Min(1) Integer id,
			@ApiParam(name = "body", value = "Role limit approve object to edit role limits", required = true) @RequestBody @Valid RoleLimitApproveDto roleLimitApproveDto) {
		corpRoleLimitFacade.roleLimitApprove(id, roleLimitApproveDto);
	}
}
