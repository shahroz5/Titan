/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;
import com.titan.poss.user.dto.response.BaseRoleResponseDto;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userRoleService")
public interface RoleService {

	/**
	 * This method will list btq or locationformat specific role limit
	 * 
	 * @param roleCode     primary key of Role
	 * @param locationCode it will list location specific roles if provided
	 * @param isDefault    it will consider default value of LocationFormatEnum if
	 *                     provided if provided
	 * @param corpAccess   whether corporate can assign those roles to any employees
	 *                     or not
	 * @param isActive     to filter by active or deactivate roles if provided
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<RoleListDto>> listStoreRoles(String roleCode, String locationCode, Boolean isDefault,
			Boolean corpAccess, Boolean isActive, Pageable pageable);

	/**
	 * Returns roles of application
	 * 
	 * @param roleCode   primary key of Role
	 * @param roleType   RoleType Enum
	 * @param corpAccess whether corporate can assign those roles to any employees
	 *                   or not
	 * @param isActive   to filter by active or deactivate roles if provided
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<RoleListDto>> listCorpRoles(String roleCode, String roleType, Boolean corpAccess,
			Boolean isActive, Pageable pageable);

	/**
	 * Returns a particular role
	 * 
	 * @param roleCode primary key of Role
	 * @return
	 */
	RoleDto getRole(String roleCode);

	/**
	 * Returns a particular role if assigned to a store
	 * 
	 * @param roleCode     primary key of Role
	 * @param locationCode roles for location having locationCode
	 * @return RoleDto
	 */
	RoleDto getRoleOfStore(String locationCode, String roleCode);

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
	 * @param role                 role object for which update is needed
	 * @param updateRolesDetailDto Request DTO containing update role details
	 */
	void updateRoleDetails(RoleDao role, UpdateRolesDetailDto updateRolesDetailDto);

	/**
	 * Returns a role based on roleCode with null-safe check
	 * 
	 * @param roleCode primary key of Role
	 * @return Role
	 */
	RoleDao getRoleDetailsWithErrorCheck(String roleCode);

	/**
	 * Returns no of roles corporate can assign for store role type
	 * 
	 * @return Short
	 */
	Short countByRoleTypeAndCorpAccessTrue();

	String getAccessTypeLikeByRoleType(String roleType);

}