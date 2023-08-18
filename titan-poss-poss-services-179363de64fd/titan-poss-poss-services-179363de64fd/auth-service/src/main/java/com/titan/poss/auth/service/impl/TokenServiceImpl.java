/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.titan.poss.auth.dto.CredentialDto;
import com.titan.poss.auth.service.AuthService;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.dto.ClientLoginDto;
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
	private AuthService authService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	private static final String TOKEN = "token";

	public String getAuthHeaderToken(VendorDao vendor) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendor.getVendorDetails());

		String uName = credentials.get(0);
		String pswd = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {

			log.debug("new token is required.");

			OAuthToken authToken = null;
			authToken = getAuthToken(uName, pswd);
			token = authToken.getAccessToken();
			exp = authToken.getExpiresAt();

			// save the updated token, expire time
			Map<String, String> detailsMap = TokenValidatorUtil.getMapFromJsonStr(vendor.getVendorDetails());
			detailsMap.put(TOKEN, token);
			detailsMap.put("exp", exp);

			vendor.setVendorDetails(new Gson().toJson(detailsMap));

			vendorRepo.save(vendor);
		}
		return token;
	}

	private OAuthToken getAuthToken(String userName, String password) {

		ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
		CredentialDto credential = new CredentialDto(clientLogin.getClientSecret());
		return authService.login(clientLogin.getClientId(), credential, null, true, null);
	}

}
