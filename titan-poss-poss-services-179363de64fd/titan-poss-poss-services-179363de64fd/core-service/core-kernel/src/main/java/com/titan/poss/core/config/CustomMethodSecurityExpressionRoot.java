/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

import com.titan.poss.core.utils.CustomSecurityPrincipal;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class CustomMethodSecurityExpressionRoot extends SecurityExpressionRoot
		implements MethodSecurityExpressionOperations {

	public CustomMethodSecurityExpressionRoot(Authentication authentication) {
		super(authentication);
	}

	private Object filterObject;
	private Object returnObject;
	private Object target;

	@Override
	public void setFilterObject(Object filterObject) {
		this.filterObject = filterObject;

	}

	@Override
	public Object getFilterObject() {
		return filterObject;
	}

	@Override
	public void setReturnObject(Object returnObject) {
		this.returnObject = returnObject;

	}

	@Override
	public Object getReturnObject() {
		return returnObject;
	}

	@Override
	public Object getThis() {
		return target;
	}

	/**
	 * True for store user (CORP)
	 * 
	 * Custom 'isCorpUser()' expression
	 */
	public boolean isCorpUser() {
		return CustomSecurityPrincipal.getSecurityPrincipal().isACorpUser();
	}

	/**
	 * True for store user (L1, L2, L3)
	 * 
	 * Custom 'isStoreUser()' expression
	 */
	public boolean isStoreUser() {
		return CustomSecurityPrincipal.getSecurityPrincipal().isAStoreUser();
	}

	/**
	 * True for store user (L3)
	 * 
	 * Custom 'isL3StoreUser()' expression
	 */
	public boolean isL3StoreUser() {
		return CustomSecurityPrincipal.getSecurityPrincipal().isAnL3StoreUser();
	}

	public boolean isAPIUser() {
		return CustomSecurityPrincipal.getSecurityPrincipal().isAnAPIUser();
	}

	public boolean isUserName(String userName) {
		return CustomSecurityPrincipal.getSecurityPrincipal().getUsername().equalsIgnoreCase(userName);
	}

}
