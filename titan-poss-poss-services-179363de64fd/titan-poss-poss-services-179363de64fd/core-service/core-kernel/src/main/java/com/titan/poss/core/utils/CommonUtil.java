/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.exception.ServiceException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public final class CommonUtil {
	private CommonUtil() {
		throw new IllegalArgumentException("CommonUtil class");
	}

	public static final String SYSTEM = "System";

// UUID

	public static void printAppInfo() {

		Map<String, Object> info = getPrintInfoInMap();

		for (Map.Entry<String, Object> entry : info.entrySet()) {

			log.info("{} : {}", entry.getKey(), entry.getValue());
		}

	}

	public static Map<String, Object> getPrintInfoInMap() {

		Map<String, Object> info = new LinkedHashMap<>();

		String secret = ApplicationPropertiesUtil.getProperty("poss.auth.jwt-secret");
		if (secret != null)
			secret = CryptoUtil.encrypt(secret, "JWT SECRET");
		info.put("secret", secret);

		String env = ApplicationPropertiesUtil.getProperty("env.name");
		info.put("env", env);
		String app = ApplicationPropertiesUtil.getProperty("app.name");
		info.put("app", app);
		String envStrictCheck = ApplicationPropertiesUtil.getProperty("strictCheck");
		info.put("envStrictCheck", envStrictCheck);

		boolean strictCheck = StringUtils.isBlank(envStrictCheck) || Boolean.parseBoolean(envStrictCheck);
		info.put("strictCheck", strictCheck);
		String profile = ApplicationPropertiesUtil.getProperty("spring.profiles.active");
		info.put("profile", profile);

		return info;
	}

	/**
	 * Update pageable if user wants to list all object
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return Pageable
	 */
	public static Pageable updatePageable(Boolean isPageable, Pageable pageable) {
		if (BooleanUtils.isFalse(isPageable))
			pageable = PageRequest.of(pageable.getPageNumber(), Integer.MAX_VALUE, pageable.getSort());
		return pageable;
	}

	/**
	 * Return user details of logged in user
	 * 
	 * @return AuthUser
	 */
	public static AuthUser getAuthUser() {
		return CustomSecurityPrincipal.getSecurityPrincipal();
	}

	public static boolean isLoggedIn() {

		boolean isLoggedin = true;
		try {
			CustomSecurityPrincipal.getSecurityPrincipal();
		} catch (NullPointerException e) {
			isLoggedin = false;
		}
		return isLoggedin;
	}

	public static String getUserName() {
		return getAuthUser().getUsername();
	}

	public static String getEmployeeCode() {
		return getAuthUser().getEmployeeCode();
	}

	public static UserTypeEnum getUserType() {
		String userType = getAuthUser().getLocType();
		return UserTypeEnum.valueOf(userType);
	}

	/**
	 * Return 'location code' of logged in user
	 * 
	 * store-code for store user, regional-code for regional user, organization code
	 * for org user
	 * 
	 * @return String
	 */
	public static String getLocationCode() {

		return getAuthUser().getLocCommonCode();
	}

	/**
	 * Returns store code for store user
	 * 
	 * @return
	 */
	public static String getStoreCode() {

		return getAuthUser().getLocationCode();
	}

	/**
	 * Return 'organization code' of logged in user
	 * 
	 * @return String
	 */
	public static String getOrgCode() {
		return getAuthUser().getOrgCode();
	}

	/**
	 * Return 'user type' of logged in user
	 * 
	 * @return String
	 */
	public static String getLoggedInUserType() {
		return getAuthUser().getLocType();
	}

	/**
	 * Returns if logged in user belongs to store
	 * 
	 * @return Boolean
	 */
	public static Boolean isAStoreUser() {
		return getAuthUser().isAStoreUser();
	}

	public static Boolean isAnAPIUser() {
		return getAuthUser().isAnAPIUser();
	}

	/**
	 * Returns if logged in user belongs to corporate
	 * 
	 * @return Boolean
	 */
	public static Boolean isACorpUser() {
		return getAuthUser().isACorpUser();
	}

	public static Boolean isARegionUser() {
		return getAuthUser().isARegionUser();
	}

	/**
	 * Returns if provided user type is of a store user or not
	 * 
	 * @param userType
	 * @return Boolean
	 */
	public static Boolean isAStoreUser(String userType) {
		Boolean isStoreUser = false;
		if (userType.equals(UserTypeEnum.L1.name()) || userType.equals(UserTypeEnum.L2.name())
				|| userType.equals(UserTypeEnum.L3.name()))
			isStoreUser = true;
		return isStoreUser;
	}

	/**
	 * Returns if provided user type is of a store user or not
	 * 
	 * @param userType
	 * @return Boolean
	 */
	public static Boolean isALegacyUser() {
		return getAuthUser().isALegacyUser();
	}

	/**
	 * It checks ApiResponseDto & if HTTP status code not 200, it throws error If
	 * 200, it will ignore
	 * 
	 * @param apiResponse
	 */
	public static void throwErrorBasedOnHttpStatusCode(ApiResponseDto apiResponse) {

		Integer httpStatusCode = apiResponse.getHttpResponseCode();
		if (httpStatusCode != HttpStatus.OK.value()) {
			throwServiceErrorIf400(apiResponse.getResponse(), httpStatusCode);
			throw new ServiceException("Call to EPOSS Failed", "ERR-INT-025", apiResponse.getResponse());
		}
	}

	/**
	 * If HTTP status code is 400, throw ServiceException, else ignore
	 * 
	 * @param obj
	 * @param httpStatusCode
	 */
	public static void throwServiceErrorIf400(Object obj, Integer httpStatusCode) {

		if (httpStatusCode == HttpStatus.BAD_REQUEST.value()) {

			Object serviceExceptionResponse = obj;
			String errorCauseStr = JsonUtils.getValueFromJson(serviceExceptionResponse, CommonConstants.ERROR_CAUSE,
					String.class);
			Object errorCause = StringUtil.convertStrToJsonIfPossible(errorCauseStr);
			log.debug("\n\nNew method (JsonUtils.getValueFromJson)'s o/p :- \n{}", errorCause);

			throw new ServiceException(
					JsonUtils.getValueFromJsonString(serviceExceptionResponse, CommonConstants.MESSAGE),
					JsonUtils.getValueFromJsonString(serviceExceptionResponse, CommonConstants.CODE), errorCause);
		}
	}

	public static void rethrowServiceException(ServiceException e) {

		throw new ServiceException(e.getMessage(), e.getErrorCode(), e.getErrorDetails());
	}

	/**
	 * It returns true for DEV environment or if it is not set based on property
	 * 'env.name'
	 * 
	 * @return
	 */
	public static boolean isDev() {
		String envName = ApplicationPropertiesUtil.getProperty("env.name");
		return (envName != null && envName.equalsIgnoreCase("DEV"));
	}

	/**
	 * It returns true for EPOSS application based on property 'app.name'
	 * 
	 * @return
	 */
	public static boolean isEpossApp() {
		return ApplicationPropertiesUtil.getProperty("app.name").equalsIgnoreCase(AppTypeEnum.EPOSS.name());
	}

}
