/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.getLocationCode;
import static com.titan.poss.core.utils.CommonUtil.updatePageable;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;
import com.titan.poss.user.facade.StoreRoleFacade;
import com.titan.poss.user.service.RoleService;

/**
 * Facade implementation layer of store role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StoreRoleFacadeImpl implements StoreRoleFacade {

	@Autowired
	RoleService roleService;

	@Override
	public RoleDto getRole(String roleCode) {
		return roleService.getRoleOfStore(getLocationCode(), roleCode);
	}

	@Override
	public PagedRestResponse<List<RoleListDto>> listRoles(String roleCode, Boolean corpAccess, Boolean isPageable,
			Pageable pageable) {
		pageable = updatePageable(isPageable, pageable);
		return roleService.listStoreRoles(roleCode, getLocationCode(), false, corpAccess, true, pageable);
	}

}
