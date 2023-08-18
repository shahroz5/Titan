/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_TXN_CODE;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.AclGroupResponse;
import com.titan.poss.user.facade.AclFacade;
import com.titan.poss.user.service.AclService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for ACL
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/acls")
@PreAuthorize(START + VIEW_TXN_CODE + END)
public class AclController {

	@Autowired
	AclFacade aclFacade;

	@Autowired
	AclService aclService;

	@ApiPageable
	@GetMapping(value = "")
	@ApiOperation(value = "View a list of 1st level ACL group", notes = "This will list all 1st level parent ACL group")
	public ListResponse<AclGroupResponse> listAclGroup(
			@RequestParam(name = "roleCode", required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String roleCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return aclFacade.listAclGroupHead(roleCode, isPageable, pageable);
	}

	@ApiPageable
	@GetMapping(value = "/{aclGroupCode}")
	@ApiOperation(value = "View a list of subesequent child ACL group of provided aclgroup", notes = "This will list all sub group of a ACL group provided")
	public ListResponse<AclGroupResponse> listSubAclGroup(
			@PathVariable("aclGroupCode") @PatternCheck(regexp = RegExConstants.ACL_REGEX, nullCheck = true) String aclGroupCode,
			@RequestParam(name = "roleCode", required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String roleCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return aclFacade.listAclGroup(aclGroupCode, roleCode, isPageable, pageable);
	}

	@ApiPageable
	@GetMapping(value = "/{aclGroupCode}/acls")
	@ApiOperation(value = "View a list of ACL under aclgroup with for a rolecode", notes = "This will list all ACL of an 'acl group'"
			+ "<br>And among those ACL list, which are assigned to the provided rolecode")
	public ListResponse<AclDto> listAclBasedOnAclGroup(
			@PathVariable("aclGroupCode") @PatternCheck(regexp = RegExConstants.ACL_REGEX, nullCheck = true) String aclGroupCode,
			@RequestParam(name = "roleCode", required = false) @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String roleCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return aclFacade.listAclBasedOnAclGroupAndRoleCode(aclGroupCode, roleCode, isPageable, pageable);
	}

}
