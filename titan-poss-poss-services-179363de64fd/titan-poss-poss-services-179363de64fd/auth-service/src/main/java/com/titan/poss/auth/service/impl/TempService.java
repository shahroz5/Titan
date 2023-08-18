/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.auth.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.titan.poss.auth.repository.EmployeeRepository;
import com.titan.poss.auth.repository.UserLoginRepository;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.PasswordHashUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("authTempService")
public class TempService {

	@Autowired
	private EmployeeRepository empRepo;

	@Autowired
	private UserLoginRepository ulRepo;

	public String encryptString(String input) {
		return CryptoUtil.asymmetricEncrypt(input, null);
	}

	public String decryptString(String input) {
		return CryptoUtil.asymmetricDecrypt(input, null, true);
	}

	@Transactional
	public void activateUATUser() {

		Date now = CalendarUtils.getCurrentDate();
		String userName = "TempService";

		List<String> corpUsers = List.of("admin", "admin2", "commercial", "finance", "pricing", "merchandise", "iscm",
				"corp");

		int noOfEmpUpdate = empRepo.activateEmployees(corpUsers, userName, now);
		int noOfUserUpdate = ulRepo.activateUserLogin(corpUsers, userName, now);
		log.info("{}, {} no of recods updated in employee & user respectively", noOfEmpUpdate, noOfUserUpdate);
	}

	public String verifyJWT(String token, String secret) {
		token = token.replace("%20", " ");
		String remarks = "verified";
		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).acceptLeeway(100).withIssuer(null).build();
			verifier.verify(token.trim());
		} catch (Exception e) {
			remarks = e.getMessage();
		}
		return remarks;

	}

	/**
	 * @param salt
	 * @return
	 */
	public String getHashedPassword(String password, String salt) {
		return PasswordHashUtil.getSecurePassword(password, salt);
	}

	/**
	 * @param input
	 * @return
	 */
	public String symmetricEncryptString(String input) {
		return CryptoUtil.encrypt(input, null);
	}

	/**
	 * @param input
	 * @return
	 */
	public String symmetricDecryptString(String input) {
		return CryptoUtil.decrypt(input, null);
	}

}
