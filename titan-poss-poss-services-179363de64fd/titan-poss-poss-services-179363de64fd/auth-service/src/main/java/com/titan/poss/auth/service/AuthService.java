/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.service;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;

import com.titan.poss.auth.dto.CredentialDto;
import com.titan.poss.core.auth.domain.OAuthToken;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface AuthService {

	OAuthToken login(String userName, CredentialDto credentials, String hostName, boolean isApiUserAllowed,
			HttpServletResponse response);

	OAuthToken reload(String authCookie, String device, String audience, String refToken) throws IOException;

	OAuthToken refreshToken(String refreshToken, String device, HttpServletResponse response) throws IOException;

	String logout(String username, String device, String refTokenIssAt, HttpServletResponse response);

	Map<String, Object> init();

	OAuthToken samlLogin(String username, String brandCode, String hostName, HttpServletResponse res);

}
