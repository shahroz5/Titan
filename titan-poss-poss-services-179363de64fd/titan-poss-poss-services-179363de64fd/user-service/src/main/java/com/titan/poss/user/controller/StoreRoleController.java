/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_ROLES;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.response.BaseRoleResponseDto;
import com.titan.poss.user.dto.response.RoleListDto;
import com.titan.poss.user.facade.StoreRoleFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for store role management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/location/roles")
public class StoreRoleController {

	@Autowired
	StoreRoleFacade storeRoleFacade;

	private static final String ROLE_VIEW_PERMISSION = START + VIEW_ROLES + END;

	// @formatter:off
	@ApiOperation(value = "View a list of roles", notes = 
			"This API will list roles of a particular store<br><br>" + 
			"You can filter based on **'role code'** or **'corp access'**<br><br>") 
	// @formatter:on
	@ApiPageable
	@GetMapping(value = "")
	@PreAuthorize(IS_STORE_USER + AND + ROLE_VIEW_PERMISSION)
	public PagedRestResponse<List<RoleListDto>> listRoles(
			@ApiParam(value = "Provide if you want to search by 'roleCode'", required = false) @RequestParam(name = "roleCode", required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String roleCode,
			@ApiParam(value = "Provide if you want to search by 'corpAccess'", required = false) @RequestParam(name = "corpAccess", required = false) Boolean corpAccess,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return storeRoleFacade.listRoles(roleCode, corpAccess, isPageable, pageable);
	}

	@ApiOperation(value = "Get a role", notes = "This API will list role details & ACL assigned based on **'role code'**<br>")
	@GetMapping(value = "/{roleCode}")
	@PreAuthorize(IS_STORE_USER + AND + ROLE_VIEW_PERMISSION)
	public BaseRoleResponseDto getRoleDetails(
			@ApiParam(name = "roleCode", value = "'roleCode' to get role details", required = true) @PathVariable @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = true) String roleCode) {
		return storeRoleFacade.getRole(roleCode);
	}

}
