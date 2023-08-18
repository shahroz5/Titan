/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils;

/**
 * Contains constant string for 'START', 'END', 'OR', 'AND' operation String
 * constant
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class PreAuthorizeDetails {

	private PreAuthorizeDetails() {
		throw new IllegalArgumentException("PreAuthorizeDetails");
	}

	public static final String START = " hasPermission(true, '";
	public static final String END = " ') ";
	public static final String BIT_OR = " | ";
	public static final String BIT_AND = " & ";

	public static final String AND = " && ";
	public static final String OR = " || ";

	public static final String IS_CORP_USER = "isCorpUser()";
	public static final String IS_STORE_USER = "isStoreUser()";
	public static final String IS_API_USER = "isAPIUser()";

	public static final String LEGACY_USER = "legacy_user";
	public static final String IS_REG_USER = "isRegUser()";
}
