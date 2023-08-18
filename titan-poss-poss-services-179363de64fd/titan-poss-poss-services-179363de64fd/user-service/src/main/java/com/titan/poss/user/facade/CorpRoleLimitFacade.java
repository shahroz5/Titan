/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;

/**
 * Facade layer of corporate role limit controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CorpRoleLimitFacade {

	/**
	 * Create roles for provided location code taking value from default roles of
	 * location format
	 * 
	 * @param reqLocationCode location code
	 * @param locationFormat  LocationFormat Enum as String
	 * @param OwnerType       OwnerTyp Enum as String
	 */
	public void setLocationRoleLimit(String reqLocationCode, String locationFormat, String ownerType);

	/**
	 * Returns all role limit request with filter options
	 * 
	 * @param locationCode location code to filter if provided
	 * @param status       status to filter if provided
	 * @param docNo        search by docNo
	 * @param pageable
	 * @return PagedRestResponse<List<RoleLimitResponseDto>>
	 */
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String locationCode, String status,
			Integer docNo, Pageable pageable);

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
	public void roleLimitChange(String locationCode, RoleChangeRequestDto roleChangeRequestDto);

	/**
	 * Alter role limit of a location with approval flow
	 * 
	 * @param id                  role limit request id
	 * @param roleLimitApproveDto contains all roles, and their respective new user
	 *                            limit
	 */
	public void roleLimitApprove(Integer id, RoleLimitApproveDto roleLimitApproveDto);
}
