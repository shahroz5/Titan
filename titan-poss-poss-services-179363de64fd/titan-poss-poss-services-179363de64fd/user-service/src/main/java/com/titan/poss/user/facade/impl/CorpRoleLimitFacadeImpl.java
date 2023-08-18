/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;
import com.titan.poss.user.facade.CorpRoleLimitFacade;
import com.titan.poss.user.service.LocationRoleConfigService;
import com.titan.poss.user.service.RoleLimitService;

/**
 * Facade implementation layer of corporate role limit controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CorpRoleLimitFacadeImpl implements CorpRoleLimitFacade {

	@Autowired
	RoleLimitService roleLimitService;

	@Autowired
	LocationRoleConfigService lrcService;

	@Override
	@Transactional
	public void setLocationRoleLimit(String reqLocationCode, String locationFormat, String ownerType) {

		lrcService.setLocationRoleLimit(reqLocationCode, locationFormat, ownerType);
	}

	@Override
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String locationCode, String status,
			Integer docNo, Pageable pageable) {

		return roleLimitService.listAllRequests(locationCode, status, docNo, pageable);
	}

	@Override
	public RequestDetailsDto getRoleRequestDetails(Integer id) {

		return roleLimitService.getRoleRequestDetails(id);
	}

	@Override
	@Transactional
	public void roleLimitChange(String locationCode, RoleChangeRequestDto roleChangeRequestDto) {

		roleLimitService.roleLimitChange(locationCode, roleChangeRequestDto);
	}

	@Override
	@Transactional
	public void roleLimitApprove(Integer id, RoleLimitApproveDto roleLimitApproveDto) {

		roleLimitService.roleLimitApprove(id, roleLimitApproveDto);

	}

}
