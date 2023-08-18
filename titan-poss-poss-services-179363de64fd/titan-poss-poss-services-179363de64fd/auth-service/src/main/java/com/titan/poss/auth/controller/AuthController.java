/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.auth.dto.ADLogoutUrlDto;
import com.titan.poss.auth.dto.CredentialDto;
import com.titan.poss.auth.dto.request.RefreshTokenPayload;
import com.titan.poss.auth.dto.request.UserLoginDto;
import com.titan.poss.auth.service.AuthService;
import com.titan.poss.auth.util.AuthTokenUtil;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.auth.util.JwtUtill;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.HttpRequestUtil;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "${auth.base-url}")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	JwtUtill jwtUtill;

	@Autowired
	AuthTokenUtil tokenUtil;

	@ApiOperation(value = "API for employee login", notes = "API for employee login where from is username and Authorization is Base64 encoded password  - In future it will be chnaged to public key encrption<br><br>"
			+ "Brand code is mandatory. Host name (asymmetric encrypted value) is optional")
	@PostMapping(value = "/login")
	public ResponseEntity<OAuthToken> login(@RequestHeader(value = "From") String userName,
			@RequestHeader(value = CommonConstants.AUTH_HEADER) String password,
			@ApiParam(name = "body", value = "Additional information of user", required = true) @RequestBody @Valid UserLoginDto userLoginDto,
			HttpServletResponse response) {

		if (StringUtils.isBlank(userName)) {
			throw new ServiceException("Please enter your username", "ERR-AUTH-004");
		}
		if (StringUtils.isBlank(password)) {
			throw new ServiceException("Please enter your password", "ERR-AUTH-003");
		}
		CredentialDto credential = new CredentialDto(password, userLoginDto.getBrandCode());
		OAuthToken token = authService.login(userName, credential, userLoginDto.getHostName(), false, response);

		return new ResponseEntity<>(token, new HttpHeaders(), HttpStatus.OK);
	}

	@ApiOperation(value = "API to generate token", notes = "API for creating token when client id & client secret is provided")
	@PostMapping(value = "/token")
	public ResponseEntity<OAuthToken> generateToken(
			@ApiParam(name = "body", value = "client credentials to be passed here", required = true) @RequestBody @Valid ClientLoginDto clientCredential) {

		CredentialDto credential = new CredentialDto(clientCredential.getClientSecret());
		OAuthToken token = authService.login(clientCredential.getClientId(), credential, null, true, null);

		return new ResponseEntity<>(token, new HttpHeaders(), HttpStatus.OK);
	}

	@ApiOperation(value = "initial API", notes = "initial API, which returns the public data required for the application")
	@GetMapping(value = "/init")
	public Map<String, Object> init() {
		return authService.init();
	}

	@ApiOperation(value = "API to get previous token", notes = "API to get previous token which was loaded before closing the browser.")
	@GetMapping(value = "/reload")
	public OAuthToken reload(
			@CookieValue(value = CommonConstants.AUTH_HEADER, required = false) @ApiIgnore String authCookie,
			@CookieValue(value = "ref_tok", required = false) @ApiIgnore String refToken, HttpServletRequest request)
			throws IOException {
		String device = HttpRequestUtil.getDevice(request);
		String audience = HttpRequestUtil.getHost(request);
		return authService.reload(authCookie, device, audience, refToken);
	}

	@ApiOperation(value = "API to get new token", notes = "API to get new token from the service. Where we need **refreshToken** and **grantType**(refresh_token)")
	@PostMapping(value = "/refresh")
	public ResponseEntity<OAuthToken> refreshToken(@RequestBody @Valid RefreshTokenPayload refreshTokenPayload,
			HttpServletResponse response, HttpServletRequest request) throws IOException {
		HttpHeaders responseHeaders = new HttpHeaders();
		if (!refreshTokenPayload.getGrantType().equals("refresh_token"))
			throw new ServiceException("Invalid grant type", "ERR-AUTH-008");

		String refreshToken = refreshTokenPayload.getRefreshToken();
		String device = HttpRequestUtil.getDevice(request);
		String audience = request.getHeader("Host");
		Optional<String> authToken = Optional.ofNullable(request.getHeader(CommonConstants.AUTH_HEADER));
		tokenUtil.verifyTokenAndCookies(request, response, audience, authToken);
		OAuthToken token = authService.refreshToken(refreshToken, device, response);

		return new ResponseEntity<>(token, responseHeaders, HttpStatus.OK);
	}

	@ApiOperation(value = "API to clear a loggedin session", notes = "API to logout the user. User session and cookies will be cleared")
	@DeleteMapping(value = "/logout")
	public Map<String, String> logout(@ApiIgnore @CookieValue(value = "ref_tok", required = false) String refToken,
			@RequestHeader(value = CommonConstants.AUTH_HEADER) String password, HttpServletRequest request,
			HttpServletResponse response) {
		String device = HttpRequestUtil.getDevice(request);
		String audience = request.getHeader("Host");
		Optional<String> authToken = Optional.ofNullable(request.getHeader(CommonConstants.AUTH_HEADER));
		Authentication authentication = tokenUtil.verifyTokenAndCookies(request, response, audience, authToken);
		AuthUser authUser = (AuthUser) authentication.getPrincipal();
		new SecurityContextLogoutHandler().logout(request, response, authentication);
		request.getSession().invalidate();
		Map<String, String> logoutMessage = new HashMap<>();
		logoutMessage.put("message", authService.logout(authUser.getUsername(), device, refToken, response));
		return logoutMessage;
	}

	@GetMapping("/adlogouturl")
	@ApiOperation(value = "AD Logout URL", notes = "Gives logout URL for Titan AD")
	public ADLogoutUrlDto getADlogoutUrl() {

		ADLogoutUrlDto logoutUrl = new ADLogoutUrlDto();

		System.out.println("adding url ---------------- ");

		logoutUrl.setLogoutUrl("https://zst.titan.in/adfs/ls/IdpInitiatedSignon.aspx");

		return logoutUrl;
	}

}
