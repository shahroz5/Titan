/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;

/**
 * Facade layer of store role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StoreRoleFacade {

	/**
	 * 
	 * @param roleCode   primary key of Role
	 * @param corpAccess whether corporate can assign those roles to any employees
	 *                   or not
	 * @param isPageable whether to list all roles of a store
	 * @param pageable
	 * @return PagedRestResponse<List<RoleListDto>>
	 */
	public PagedRestResponse<List<RoleListDto>> listRoles(String roleCode, Boolean corpAccess, Boolean isPageable,
			Pageable pageable);

	/**
	 * Returns role object based on roleCode of a store role
	 * 
	 * @param roleCode primary key of Role
	 * @return RoleDto
	 */
	public RoleDto getRole(String roleCode);
}
