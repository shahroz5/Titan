/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userRoleLimitService")
public interface RoleLimitService {

	/**
	 * Create a request by 'store manager' for updating role user limit of role(s)
	 * assigned to a store
	 * 
	 * @param roleLimitRequestDto contains roles & updated user limits for which
	 *                            request is sent
	 * @return RoleLimitResponseDto response
	 */
	RoleLimitResponseDto createRoleLimitRequest(RoleLimitRequestDto roleLimitRequestDto);

	/**
	 * Returns all role limit request with filter options
	 * 
	 * @param locationCode location code to filter if provided
	 * @param status       status to filter if provided
	 * @param docNo        search by docNo
	 * @param pageable
	 * @return PagedRestResponse<List<RoleLimitResponseDto>>
	 */
	PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String locationCode, String status, Integer docNo,
			Pageable pageable);

	/**
	 * Returns all details of a role limit request
	 * 
	 * @param id       role limit request id
	 * @param pageable
	 * @return PagedRestResponse<List<RequestedRoleDetails>>
	 */
	public RequestDetailsDto getRoleRequestDetails(Integer id);

	/**
	 * Alter role limit of a location without approval flow
	 * 
	 * @param locationCode         location code to update
	 * @param roleChangeRequestDto contains all roles, and their respective new user
	 *                             limit
	 */
	void roleLimitChange(String locationCode, RoleChangeRequestDto roleChangeRequestDto);

	/**
	 * Alter role limit of a location with approval flow
	 * 
	 * @param id                  role limit request id
	 * @param roleLimitApproveDto contains all roles, and their respective new user
	 *                            limit
	 */
	public void roleLimitApprove(Integer id, RoleLimitApproveDto roleLimitApproveDto);

	/**
	 * checking if id is of same store requesting to list
	 * 
	 * @param id
	 * @return
	 */
	Boolean isRequestOfSameStore(int id);
}
