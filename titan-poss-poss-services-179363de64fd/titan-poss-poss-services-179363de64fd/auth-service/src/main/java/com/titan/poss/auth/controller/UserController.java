/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.auth.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.auth.dto.request.AclElementRequestDto;
import com.titan.poss.auth.dto.request.AclUrlRequestDto;
import com.titan.poss.auth.dto.response.AclElementResponseDto;
import com.titan.poss.auth.dto.response.AclUrlResponseDto;
import com.titan.poss.auth.service.UserService;
import com.titan.poss.core.response.ListResponse;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@RestController
@RequestMapping(value = "${auth.base-url}/users")
public class UserController {

	@Autowired
	private UserService userService;

	@ApiOperation(value = "Get ACL url mapping list", notes = "This API will give ACL url mapping lists.")
	@PostMapping(value = "/urls/acls")
	public ListResponse<AclUrlResponseDto> getAclList(
			@RequestBody @Valid @ApiParam(name = "body", value = "URL details are required to get ACL lists", required = true) AclUrlRequestDto aclUrlRequestDto) {
		return userService.getAclList(aclUrlRequestDto);
	}

	@ApiOperation(value = "Get ACL element mapping list", notes = "This API will give ACL element mapping lists.")
	@PostMapping(value = "/urls/elements/acls")
	public ListResponse<AclElementResponseDto> getAclElementList(
			@RequestBody @Valid @ApiParam(name = "body", value = "URL details are required to get ACL element lists", required = true) AclElementRequestDto aclElementRequestDto) {
		return userService.getAclElementList(aclElementRequestDto);
	}
}
