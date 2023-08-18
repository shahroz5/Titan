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
import com.titan.poss.user.service.EpossTokenService;

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

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Override
	public String getAuthHeaderToken(VendorDao vendorDao) {
		List<String> vendorDetails = TokenValidatorUtil.verifyDetails(vendorDao.getVendorDetails());
		String userName = vendorDetails.get(0);
		String password = vendorDetails.get(1);
		String token = vendorDetails.get(2);
		String expVal = vendorDetails.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(expVal) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			log.info("new token is required. So, calling auth-service to fetch token");
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			expVal = oauthToken.getExpiresAt();

			// save the updated token, expire time
			JsonData jsonData = TokenValidatorUtil.updateApiUserToken(vendorDao.getVendorDetails(), token, expVal);
			vendorDao.setVendorDetails(MapperUtil.getJsonString(jsonData));

			vendorRepo.save(vendorDao);
		}
		return token;
	}

}
