/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.utils;

import org.springframework.security.core.context.SecurityContextHolder;

import com.titan.poss.core.auth.domain.AuthUser;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
public class CustomSecurityPrincipal {

	private CustomSecurityPrincipal() {
		//Empty Constructor
	}





	public static AuthUser getSecurityPrincipal() {
		return (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

}
