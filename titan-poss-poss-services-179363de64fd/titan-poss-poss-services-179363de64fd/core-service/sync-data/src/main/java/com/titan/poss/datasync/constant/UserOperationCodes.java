/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserOperationCodes {

	public static final String ROLE_ADD = "ROLE-ADD";
	public static final String ROLE_UPDATE = "ROLE-UPDATE";
	public static final String CORPUSER_ADD = "CORPUSER-ADD";
	public static final String CORPUSER_UPDATE = "CORPUSER-UPDATE";
	public static final String STOREUSER_ADD = "STOREUSER-ADD";
	public static final String STOREUSER_UPDATE = "STOREUSER-UPDATE";
	public static final String STORETEMPORARYUSER_ADD = "STORETEMPORARYUSER-ADD";
	public static final String CHANGEPSWD = "CHANGEPSWD";
	public static final String VALIDATEMOBILE = "VALIDATEMOBILE";
	public static final String VERIFYOTP = "VERIFYOTP";
	public static final String EMP_RESIGNATION = "SCHEDULAR-EMP_RESIGNATION";
	public static final String USER_PASWORD = "SCHEDULAR-USER_PASSWORD_EXPIRE";
	public static final String USER_DATE = "SCHEDULAR-USER_DATE_EXPIRE";
	public static final String USER_TEMP = "SCHEDULAR-USER_TEMP_EXPIRE";
	public static final String MOBILE_EXPIRE = "SCHEDULAR-USER_MOBILE_EXPIRE";
	public static final String LOCATION_ROLE_ADD = "LOCATION_ROLE-ADD";
	
}
