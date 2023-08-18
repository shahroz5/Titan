/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils.test;

import java.util.Base64;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class AuthUtil {

	private AuthUtil() {

	}

	public static String getAuthToken(String username, String password) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		String devServerUrl = ApplicationPropertiesUtil.getProperty("eposs.url");
		String url = devServerUrl + "/api/auth/v2/login";
		headers.add("Authorization", Base64.getEncoder().encodeToString(password.getBytes()));
		headers.add("From", username);
		HttpEntity<String> request = new HttpEntity<>(headers);
		ResponseEntity<OAuthToken> response = restTemplate.postForEntity(url, request, OAuthToken.class);
		return response.getBody().getAccessToken();
	}

}
