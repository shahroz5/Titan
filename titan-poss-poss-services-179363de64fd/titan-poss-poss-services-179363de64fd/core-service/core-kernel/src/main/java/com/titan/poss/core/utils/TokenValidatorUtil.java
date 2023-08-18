/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.titan.poss.core.dto.ApiUserConfigDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class TokenValidatorUtil {

	private static final String USER_NAME = "username";
	private static final String PSWD = "password";
	private static final String TOKEN = "token";
	
	private TokenValidatorUtil() {
		throw new IllegalStateException("TokenValidatorUtil class");
	}

	/**
	 * Check if provided expiry date in string is valid date & not expired
	 * 
	 * @param exp
	 * @return
	 */
	public static boolean isValidExpVal(String exp) {
		boolean isValid = true;
		// if not able to format, then it returns null
		Date expDate = CalendarUtils.formatDetfaultToDate(exp);
		if (expDate == null || CalendarUtils.getCurrentDate().after(CalendarUtils.formatDetfaultToDate(exp)))
			isValid = false;
		return isValid;
	}

	/**
	 * Verify if JWT provided is valid or not
	 * 
	 * @param token
	 * @return boolean
	 */
	public static boolean isValidJWT(String token, String jwtSecret) {
		if (StringUtils.isBlank(token))
			return false;
		token = token.replace("%20", " ");
		boolean isValid = true;
		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(jwtSecret)).acceptLeeway(100).withIssuer(null).build();
			verifier.verify(token.trim());
		} catch (Exception e) {
			log.warn("JWT verification failed for some reason");
			isValid = false;
		}
		return isValid;

	}

	/**
	 * Get Json in Map<String, String> format
	 * 
	 * @param configDetailStr
	 * @return Map<String, String>
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, String> getMapFromJsonStr(String configDetailStr) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configDetailStr), JsonData.class);
		Object obj = MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData()));
		return (Map<String, String>) obj;
	}
	
	public static List<String> verifyDetails(String vendorDetails) {
		String configDetailStr = vendorDetails;
		String userName = null;
		String password = null;
		String token = null;
		String exp = null;
		List<String> missingFields = new ArrayList<>();
		if (!StringUtils.isBlank(configDetailStr)) {
			// free space for new password & check last n password to not to match
			Map<String, String> map = TokenValidatorUtil.getMapFromJsonStr(configDetailStr);
			userName = map.get(USER_NAME);
			password = map.get(PSWD);
			token = map.get(TOKEN);
			exp = map.get("exp");
			if (StringUtils.isBlank(userName))
				missingFields.add(USER_NAME);
			if (StringUtils.isBlank(password))
				missingFields.add(PSWD);
		} else {
			missingFields = List.of(USER_NAME, PSWD);
		}
		if (!missingFields.isEmpty()) {
			throw new ServiceException("Credentials missing for EPOSS Token.", "ERR-FILE-040", missingFields);
		}
		return new ArrayList<>(Arrays.asList(userName, password, token, exp));
	}
	
	public static JsonData updateApiUserToken(String vendorDetails, String token, String exp) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendorDetails), JsonData.class);
		ApiUserConfigDto apiUserConfigDto = MapperUtil.mapObjToClass(jsonData.getData(), ApiUserConfigDto.class);
		apiUserConfigDto.setToken(token);
		apiUserConfigDto.setExp(exp);
		jsonData.setData(apiUserConfigDto);
		return jsonData;
	}
}
