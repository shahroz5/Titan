/*  Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.ADD_EDIT_ROLES;
import static com.titan.poss.core.domain.acl.UserAccessControls.ADD_EDIT_TXN_CODE;
import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_ROLES;
import static com.titan.poss.core.utils.CommonUtil.updatePageable;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_CORP_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

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
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.constants.LocationFormatEnum;
import com.titan.poss.user.dto.constants.RoleTypeEnum;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;
import com.titan.poss.user.facade.CorpRoleFacade;
import com.titan.poss.user.service.RoleService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for corporate user role management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/corp/roles")
public class CorpRoleController {

	@Autowired
	RoleService roleService;

	@Autowired
	CorpRoleFacade corpRoleFacade;

	private static final String ROLE_VIEW_PERMISSION = START + VIEW_ROLES + END;
	private static final String ROLE_ADD_EDIT_PERMISSION = START + ADD_EDIT_ROLES + END + OR + START + ADD_EDIT_TXN_CODE
			+ END;

	@ApiPageable
	@GetMapping(value = "")
	@PreAuthorize(IS_CORP_USER + AND + ROLE_VIEW_PERMISSION)
	// @formatter:off
	@ApiOperation(value = "View a list of roles", notes = "This API will list all the roles"
			+ "<br>You can find all roles present in application"
			+ "<br>You can find all roles assigned to a location with "
			+ "<br>You can find all default roles assigned to a location-format"
			+ "<span style=\"font-size:14px;\">"
			+ "You can filter by **'corp access'** or **'is active'** or **'location code'** or **'location format'** or **'role code'** or **'role type'**"
			+ "</span><br>"
			+ "RoleType is not required if you filter by 'location format' or 'location code'<br><br>"
			+ "<span style=\"font-weight: bold;\">RoleType:</span>"
			+ "<ul>"
			+ "	<li>CORP</li>"
			+ "	<li>REG</li>"
			+ "	<li>L1</li>"
			+ "	<li>L2</li>"
			+ "	<li>L3</li>"
			+ "</ul>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Location Format:</span><br>"
			+ "<ul>"
			+ "	<li>LF</li>"
			+ "	<li>MF</li>"
			+ "	<li>SF</li>"
			+ "	<li>MICF</li>"
			+ "</ul>")
	// @formatter:on
	public PagedRestResponse<List<RoleListDto>> listRoles(
			@ApiParam(value = "Provide if you want to search role by 'role code'", required = false) @RequestParam(name = "roleCode", required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String roleCode,
			@ApiParam(value = "Provide if you want to search role by 'role type'", allowableValues = "CORP, REG, L1, L2, L3", required = false) @RequestParam(name = "roleType", required = false) @ValueOfEnum(enumClass = RoleTypeEnum.class) String roleType,
			@ApiParam(value = "Provide if you want to search role by 'location code'", required = false) @RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String locationCode,
			@ApiParam(value = "Provide if you want to search role by 'location format'", allowableValues = "LF, MF, SF, MICF", required = false) @RequestParam(name = "locationFormat", required = false) @ValueOfEnum(enumClass = LocationFormatEnum.class) String locationFormat,
			@ApiParam(value = "Provide if you want to search role by 'corp access'", required = false) @RequestParam(name = "corpAccess", required = false) Boolean corpAccess,
			@ApiParam(value = "Provide if you want to search role by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		pageable = updatePageable(isPageable, pageable);
		return corpRoleFacade.listRoles(roleCode, roleType, locationCode, locationFormat, corpAccess, isActive,
				pageable);
	}

	@ApiOperation(value = "Get a role", notes = "This API will list role details & ACL assigned based on **'role code'**<br>")
	@GetMapping(value = "/{roleCode}")
	@PreAuthorize(IS_CORP_USER + AND + ROLE_VIEW_PERMISSION)
	public RoleDto getRoleDetails(
			@ApiParam(name = "roleCode", value = "'roleCode' to get details", required = true) @PathVariable("roleCode") @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String roleCode) {
		return corpRoleFacade.getRole(roleCode);
	}

	@ApiOperation(value = "Add a role", notes = "This API will create a role<br><br>")
	@PostMapping(value = "")
	@PreAuthorize(IS_CORP_USER + AND + ROLE_ADD_EDIT_PERMISSION)
	public void addRoleDetails(
			@ApiParam(name = "body", value = "Role object that needs to be created", required = true) @RequestBody @Valid AddRoleDetailsDto addRoleDetailsDto) {
		corpRoleFacade.addRoleDetails(addRoleDetailsDto);
	}

	// @formatter:off
	@ApiOperation(value = "Update a role", notes = "This API will update a role based on **'role code'**<br><br>")
	//@formatter:on
	@PatchMapping(value = "/{roleCode}")
	@PreAuthorize(IS_CORP_USER + AND + ROLE_ADD_EDIT_PERMISSION)
	public void updateRoleDetails(
			@ApiParam(name = "roleCode", value = "'roleCode' to edit a role", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true) String roleCode,
			@ApiParam(name = "body", value = "Role object that needs to be edited", required = true) @RequestBody @Valid UpdateRolesDetailDto updateRolesDetailDto) {
		corpRoleFacade.updateRoleDetails(roleCode, updateRolesDetailDto);
	}

}
