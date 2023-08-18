/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
@Slf4j
public class TokenServiceImpl {

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	public String getAuthHeaderToken(VendorDao vendor) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendor.getVendorDetails());
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			log.debug("new token is required. calling auth-service to fetch token");
			OAuthToken oauthToken = null;
			oauthToken = getAuthToken(userName, password);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendor.getVendorDetails(), token, exp);
			vendor.setVendorDetails(MapperUtil.getJsonString(jsonData));
			vendorRepo.save(vendor);
		}
		return token;
	}

	private OAuthToken getAuthToken(String userName, String password) {

		ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
		return authServiceClient.generateToken(clientLogin);
	}

}
