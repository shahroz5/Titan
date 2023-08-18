/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.getLocationCode;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;
import com.titan.poss.user.facade.StoreRoleLimitFacade;
import com.titan.poss.user.service.RoleLimitService;

/**
 * Facade layer of store role limit controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StoreRoleLimitFacadeImpl implements StoreRoleLimitFacade {

	@Autowired
	RoleLimitService roleLimitService;

	@Override
	@Transactional
	public RoleLimitResponseDto createRoleLimitRequest(RoleLimitRequestDto roleLimitRequestDto) {

		return roleLimitService.createRoleLimitRequest(roleLimitRequestDto);
	}

	@Override
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String status, Integer docNo,
			Pageable pageable) {

		return roleLimitService.listAllRequests(getLocationCode(), status, docNo, pageable);
	}

	@Override
	@Transactional
	public RequestDetailsDto getRoleRequestDetails(Integer id) {

		if (!roleLimitService.isRequestOfSameStore(id))
			throw new ServiceException("Record(s) not found.", "ERR-UAM-002");
		return roleLimitService.getRoleRequestDetails(id);
	}

}
