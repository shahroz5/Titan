/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;
import com.titan.poss.user.dto.response.BaseRoleResponseDto;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;

/**
 * Facade layer of corporate role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CorpRoleFacade {

	/**
	 * Returns all roles available in application
	 * 
	 * @param roleCode       primary key of Role
	 * @param roleType       RoleType Enum
	 * @param locationCode   it will list location specific roles if provided
	 * @param locationFormat it will list default roles and user limit of the
	 *                       location format if provided
	 * @param corpAccess     whether corporate can assign those roles to any
	 *                       employees or not
	 * @param isActive       filter by active or deactivate roles if provided
	 * @param pageable
	 * @return PagedRestResponse<List<RoleListDto>>
	 */
	public PagedRestResponse<List<RoleListDto>> listRoles(String roleCode, String roleType, String locationCode,
			String locationFormat, Boolean corpAccess, Boolean isActive, Pageable pageable);

	/**
	 * Return role details of a role by roleCode
	 * 
	 * @param roleCode primary key of Role
	 * @return RoleDto
	 */
	public RoleDto getRole(String roleCode);

	/**
	 * Add a role
	 * 
	 * @param addRoleDetailsDto Request DTO containing create role details
	 * @return BaseRoleResponseDto
	 */
	public BaseRoleResponseDto addRoleDetails(AddRoleDetailsDto addRoleDetailsDto);

	/**
	 * Update an existing role
	 * 
	 * @param roleCode             primary key of Role
	 * @param updateRolesDetailDto Request DTO containing update role details
	 */
	public void updateRoleDetails(String roleCode, UpdateRolesDetailDto updateRolesDetailDto);

}
