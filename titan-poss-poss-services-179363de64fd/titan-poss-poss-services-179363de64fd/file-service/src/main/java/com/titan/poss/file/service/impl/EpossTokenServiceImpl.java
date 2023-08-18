/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.file.service.AuthService;
import com.titan.poss.file.service.EpossTokenService;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class EpossTokenServiceImpl implements EpossTokenService {

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private AuthService authService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Override
	public String getAuthHeaderToken(VendorDao vendor) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendor.getVendorDetails());
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			log.info("new token is required. So, calling auth-service to fetch token");
			OAuthToken oauthToken = null;
			oauthToken = authService.getAuthToken(userName, password);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendor.getVendorDetails(), token, exp);
			vendor.setVendorDetails(MapperUtil.getJsonString(jsonData));
			
			vendorRepo.save(vendor);
		}
		return token;
	}
}
