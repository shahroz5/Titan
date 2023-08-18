/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.service.clients.AuthServiceClient;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private AuthServiceClient authServiceClient;

	@Override
	public OAuthToken getAuthToken(String userName, String password) {

		ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
		return authServiceClient.generateToken(clientLogin);

	}

}
