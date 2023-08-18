/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import com.titan.poss.core.auth.domain.OAuthToken;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface AuthService {

	OAuthToken getAuthToken(String userName, String password);
}
