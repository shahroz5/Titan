/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.auth.controller;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.auth.service.UserService;
import com.titan.poss.auth.service.impl.TempService;
import com.titan.poss.core.domain.validator.ProfileRegex;
import com.titan.poss.core.utils.CryptoUtil;

import brave.Tracer;
import io.swagger.annotations.ApiOperation;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
//@Profile("dev.eposs")
@ProfileRegex("^[dev|qa|local].*$")
@RequestMapping(value = "${auth.base-url}/temp")
public class TempController {

	@Autowired
	private TempService tempService;

	@Autowired
	private UserService userService;

	@Autowired
	private Tracer tracer;

	@ApiOperation(value = "Encrypt the string usinng asymmetric encryption")
	@GetMapping(value = "/encrypt")
	public String encryptInput(@RequestParam(name = "input", required = true) String input) {
		return tempService.encryptString(input);
	}

	@ApiOperation(value = "Decrypt the string usinng asymmetric decryption")
	@GetMapping(value = "/decrypt")
	public String decryptInput(@RequestParam(name = "input", required = true) String input) {
		return tempService.decryptString(input);
	}

	@ApiOperation(value = "Encrypt the string usinng symmetric encryption")
	@GetMapping(value = "/symmetric-encrypt")
	public String symmetricEncryptInput(@RequestParam(name = "input", required = true) String input) {
		return tempService.symmetricEncryptString(input);
	}

	@ApiOperation(value = "Decrypt the string usinng symmetric decryption")
	@GetMapping(value = "/symmetric-decrypt")
	public String symmetricDecryptInput(@RequestParam(name = "input", required = true) String input) {
		return tempService.symmetricDecryptString(input);
	}

	// @formatter:off
	@ApiOperation(value = "Activate UAT users", notes = "This API will activate all UAT corporate users and some store users.<br><br>"
			+ "Some corporate users are admin, commercial, finance, pricing etc  (run in eposs auth service)<br>"
			+ "Some store user sm\\*, bos\\*, rso\\* (run in poss auth service)")
	// @formatter:off
	@PatchMapping(value = "/activate-users")
	public void activateUATUser() {
		tempService.activateUATUser();
	}

	@ApiOperation(value = "API to verify secret", notes ="Provide token & secret. It will return if the token is verifided or failed")
	@PatchMapping(value = "/token")
	public String verifyJwtToken(@RequestParam(required = true) String token, @RequestParam(required = true) String secret) {
		return tempService.verifyJWT(token, secret);
	}

	@ApiOperation(value = "API to give hashed password", notes ="Provide salt of existing user")
	@PatchMapping(value = "/password")
	public String getHashedPassword(@RequestParam(required = true) String salt, @RequestParam(required = true) String password) {
		return tempService.getHashedPassword(password, salt);
	}
	
	@GetMapping(value = "/decrypt-with-error")
	public String decryptWithError(@RequestParam(required = true) String input) {
		String output;
		try {
			output = CryptoUtil.decrypt(input, "input", true);
			output = "Decrypting \"" + input +  "\"</br></br>Output: <b>" + output + "</b>";
		} catch(Exception e) {
			output = convertExceptionToHtmlOp(e);
		}
		return output;
	}
	
	private String convertExceptionToHtmlOp(Exception e) {

		String errMessage = "We are experiencing issue.";
		if(StringUtils.isNotBlank(e.getMessage())) {
			errMessage = e.getMessage();
		}
		String mssg = "( Trace ID : " + tracer.currentSpan().context().spanIdString() + " ) " + errMessage;
		return convertTextToRedColor(mssg);

	}
	
	private String convertTextToRedColor(String str) {
		return  "<span style = \"color:red\">" + str + "</span>";
	}


}
