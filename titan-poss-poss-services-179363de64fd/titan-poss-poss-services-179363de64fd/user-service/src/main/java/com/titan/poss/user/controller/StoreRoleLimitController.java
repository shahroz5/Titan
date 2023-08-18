/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.CREATE_ROLE_LIMIT_REQ;
import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_ROLE_LIMIT_REQ;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;
import com.titan.poss.user.facade.StoreRoleLimitFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for store user role limit management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/location/role-limits")
public class StoreRoleLimitController {

	@Autowired
	StoreRoleLimitFacade storeRoleLimitFacade;

	private static final String CREATE_ROLE_LIMIT_REQ_PERMISSION = START + CREATE_ROLE_LIMIT_REQ + END;
	private static final String VIEW_ROLE_LIMIT_REQ_PERMISSION = START + VIEW_ROLE_LIMIT_REQ + END;

	@PostMapping(value = "/requests")
	@ApiOperation(value = "Request for role limit change", notes = "This API lets the SM request for change in role limit<br>")
	@PreAuthorize(IS_STORE_USER + AND + CREATE_ROLE_LIMIT_REQ_PERMISSION)
	public RoleLimitResponseDto createRoleLimitRequest(
			@ApiParam(name = "body", value = "Role limit request object for raising the request", required = true) @RequestBody @Valid RoleLimitRequestDto roleLimitRequestDto) {
		return storeRoleLimitFacade.createRoleLimitRequest(roleLimitRequestDto);
	}

	@ApiPageable
	@GetMapping(value = "")
	@PreAuthorize(IS_STORE_USER + AND + VIEW_ROLE_LIMIT_REQ_PERMISSION)
	// @formatter:off
	@ApiOperation(value = "View a list of requests", notes = "This API will list all the requests made by a store in pageable format<br>"
			+ "You can filter by **'request status'**<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Request Status:</span><br>" 
			+ "<ul>"
			+ "	<li>PENDING - Request is created but action has not been taked by Admin.</li>"
			+ "	<li>REJECTED - Request is rejected by Admin.</li>" 
			+ "	<li>APPROVED - All roles are approved by Admin.</li>" 
			+ "	<li>PARTIAL_APPROVED - Some roles are approved by Admin.</li>"
			+ " <li>CANCELLED - Request is cancelled automatically because of new request made.</li>"
			+ "</ul>")
	// @formatter:on
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(
			@ApiParam(value = "Provide if you want to search by 'status' of role limit request", allowableValues = "PENDING, CANCELLED, REJECTED, APPROVED, PARTIAL_APPROVED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = RoleLimitRequestStatus.class) String status,
			@ApiParam(value = "Provide if you want to search by 'Doc No'", required = false) @RequestParam(name = "docNo", required = false) @Min(1) Integer docNo,
			@ApiIgnore Pageable pageable) {

		return storeRoleLimitFacade.listAllRequests((status != null) ? status : null, docNo, pageable);
	}

	@GetMapping(value = "/{id}/requests")
	@PreAuthorize(IS_STORE_USER + AND + VIEW_ROLE_LIMIT_REQ_PERMISSION)
	@ApiOperation(value = "View details of a request", notes = "This API will list the role limit request details of a particular id in pageable format<br>")
	public RequestDetailsDto getRoleRequestDetails(
			@ApiParam(name = "id", value = "'id' to get the details of the request", required = true) @PathVariable @Min(1) Integer id) {
		return storeRoleLimitFacade.getRoleRequestDetails(id);
	}
}
