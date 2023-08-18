/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.dto.ReqLocationRoleDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.ListResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "userContextId", name = "user-service", configuration = FeignClientInterceptor.class)
public interface UserServiceClient {

	@PostMapping(value = "user/v2/corp/role-limits/locations/{locationCode}")
	void setLocationRoleLimit(@PathVariable("locationCode") String locationCode,
			@RequestBody ReqLocationRoleDto reqLocationRoleDto);

	@DeleteMapping(value = "user/v2/jobs/deactivate-employee-resignation")
	public SchedulerResponseDto resetUserPassword(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@DeleteMapping(value = "user/v2/jobs/deactivate-user-password-expiry")
	public SchedulerResponseDto deactivateLoginUserBasedOnPasswordExpiryDate(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@DeleteMapping(value = "user/v2/jobs/deactivate-user-login-date")
	public SchedulerResponseDto deactivateLoginUserBasedOnlastLoginDate(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@DeleteMapping(value = "user/v2/jobs/remove-temp-role")
	public SchedulerResponseDto removeTempRoles(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@PatchMapping(value = "user/v2/jobs/assign-new-mobile")
	public SchedulerResponseDto assignNewMobile(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "user/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);
	
	@GetMapping(value = "user/v2/reg/users/employeeCode/location")
	public List<EmployeeLocationDto> listLocationMapping();
	
}
