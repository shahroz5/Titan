/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.facade.impl;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;
import com.titan.poss.user.dto.response.BaseRoleResponseDto;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;
import com.titan.poss.user.facade.CorpRoleFacade;
import com.titan.poss.user.service.RoleService;
import com.titan.poss.user.util.RoleUtil;

/**
 * Facade implementation layer of corporate role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CorpRoleFacadeImpl implements CorpRoleFacade {

	@Autowired
	RoleService roleService;

	@Value("${poss.user.role.storeCorpAccessMax:1}")
	private Short storeCorpAccessMax;

	@Override
	public PagedRestResponse<List<RoleListDto>> listRoles(String roleCode, String roleType, String locationCode,
			String locationFormat, Boolean corpAccess, Boolean isActive, Pageable pageable) {
		if (roleType != null)
			return roleService.listCorpRoles(roleCode, roleType, corpAccess, isActive, pageable);
		else {
			Boolean isLocationFormatProvided = (locationFormat != null);
			Boolean isLocationProvided = (StringUtils.isNotBlank(locationCode));
			if (isLocationFormatProvided && isLocationProvided)
				return new PagedRestResponse<>(Collections.emptyList(), new PageImpl<>(Collections.emptyList()));
			else if (!isLocationFormatProvided && !isLocationProvided)
				return roleService.listCorpRoles(roleCode, roleType, corpAccess, isActive, pageable);
			else if (isLocationFormatProvided)
				return roleService.listStoreRoles(roleCode, locationFormat, true, corpAccess, isActive, pageable);
			else
				return roleService.listStoreRoles(roleCode, locationCode, false, corpAccess, isActive, pageable);
		}
	}

	@Override
	public RoleDto getRole(String roleCode) {
		return roleService.getRole(roleCode);
	}

	@Override
	@Transactional
	public BaseRoleResponseDto addRoleDetails(AddRoleDetailsDto addRoleDetailsDto) {

		if (RoleUtil.isRoleBelongToBtq(addRoleDetailsDto.getAccessType())
				&& BooleanUtils.isTrue(addRoleDetailsDto.getCorpAccess())) {
			short existingStoreCorpAccess = roleService.countByRoleTypeAndCorpAccessTrue();
			if ((existingStoreCorpAccess + 1) > storeCorpAccessMax)
				throw new ServiceException("Store roles corporate access limit exceeding", "ERR-UAM-050",
						storeCorpAccessMax);
		}

		return roleService.addRoleDetails(addRoleDetailsDto);
	}

	@Override
	@Transactional
	public void updateRoleDetails(String roleCode, UpdateRolesDetailDto updateRolesDetailDto) {
		RoleDao role = getRoleDetails(roleCode);
		roleService.updateRoleDetails(role, updateRolesDetailDto);
	}

	private RoleDao getRoleDetails(String roleCode) {
		return roleService.getRoleDetailsWithErrorCheck(roleCode);
	}

}
