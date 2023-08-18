/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.controller;

import java.net.URI;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.auth.service.AuthService;
import com.titan.poss.core.auth.domain.OAuthToken;

import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping(value = "${auth.base-url}")
public class SSOController {

	@Autowired
	private AuthService authService;

	private static final Logger LOGGER = LoggerFactory.getLogger(SSOController.class);

	@Value("${server.sso.redirecturl}")
	private String redirecturl;

	@GetMapping(value = "/sso/samlLogin")
	@ApiOperation(value = "samlLogin", notes = "It authenticates the login and returns the access token as response")
	public ResponseEntity<Void> samlLogin(HttpServletRequest req, HttpServletResponse res,
			Authentication authentication) {

		LOGGER.info("SAML user  :  {} ", authentication.getDetails());

		org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authentication
				.getDetails();

		LOGGER.info("SAML Username  :  {} ", user.getUsername());

		String username = user.getUsername().split("@")[0];
		OAuthToken token = authService.samlLogin(username, null, null, res);
		return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirecturl)).build();
		// return new ResponseEntity<>(token, new HttpHeaders(), HttpStatus.OK);
	}

}
