/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;

/**
 * Facade layer of store role limit controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StoreRoleLimitFacade {

	/**
	 * Create a request by 'store manager' for updating role user limit of role(s)
	 * assigned to a store
	 * 
	 * @param roleLimitRequestDto contains roles & updated user limits for which
	 *                            request is sent
	 * @return RoleLimitResponseDto response
	 */
	public RoleLimitResponseDto createRoleLimitRequest(RoleLimitRequestDto roleLimitRequestDto);

	/**
	 * List all role limit requests of a store
	 * 
	 * @param status   status to filter if provided
	 * @param docNo    search by docNo
	 * @param pageable
	 * @return
	 */
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String status, Integer docNo,
			Pageable pageable);

	/**
	 * Returns all details of a role limit request if the request is created by the
	 * store
	 * 
	 * @param id       role limit request id
	 * @param pageable
	 * @return PagedRestResponse<List<RequestedRoleDetails>>
	 */
	public RequestDetailsDto getRoleRequestDetails(Integer id);

}
