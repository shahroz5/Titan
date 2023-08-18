/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.domain.acl;

/**
 * This class list all the ACL of User Access Management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public final class UserAccessControls {

	private UserAccessControls() {
		throw new IllegalArgumentException("UserAccessControls class");
	}

	public static final String VIEW_USERS = "U0";
	public static final String ADD_EDIT_USERS = "U1";
	public static final String VIEW_ROLES = "U2";
	public static final String ADD_EDIT_ROLES = "U3";
	public static final String GENERATE_OTP = "U4";
	public static final String UPDATE_ROLE_LIMIT = "U5";
	public static final String CREATE_ROLE_LIMIT_REQ = "U6";
	public static final String VIEW_ROLE_LIMIT_REQ = "U7";
	public static final String ADD_EDIT_TXN_CODE = "U8";
	public static final String VIEW_TXN_CODE = "U9";
	public static final String CORP_VIEW_ROLE_LIMIT_REQ = "A0";
	public static final String CORP_APPROVE_ROLE_LIMIT_REQ = "A1";

}
