/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.ReqLocationRoleDto;
import com.titan.poss.core.service.clients.UserServiceClient;
import com.titan.poss.location.service.UserService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LocationUserService")
public class UserServiceImpl implements UserService {

	@Autowired
	UserServiceClient userClient;

	@Override
	public void assignRolesToBoutique(String locationCode, String locationFormat, String ownerType) {

		ReqLocationRoleDto reqLocationDto = new ReqLocationRoleDto();
		reqLocationDto.setLocationFormat(locationFormat);
		reqLocationDto.setOwnerType(ownerType);
		userClient.setLocationRoleLimit(locationCode, reqLocationDto);

	}

}
