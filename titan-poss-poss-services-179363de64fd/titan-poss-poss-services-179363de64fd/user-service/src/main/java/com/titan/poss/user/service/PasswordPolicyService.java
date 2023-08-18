/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service;

import com.titan.poss.user.dao.UserLoginDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface PasswordPolicyService {

	/**
	 * This method checks for all password policy required
	 * 
	 * @param userName
	 * @param oldHashedPassword
	 * @param newHashedPassword
	 * @param encodedPassword
	 */
	UserLoginDao checkPasswordPolicy(UserLoginDao userLogin, String oldHashedPassword, String newHashedPassword,
			String encodedPassword);
}
