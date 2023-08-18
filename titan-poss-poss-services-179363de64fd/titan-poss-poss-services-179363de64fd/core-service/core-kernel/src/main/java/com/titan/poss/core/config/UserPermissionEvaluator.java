/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("PossPermission")
public class UserPermissionEvaluator implements PermissionEvaluator {
	@Override
	public boolean hasPermission(Authentication authentication, Object targetObject, Object permission) {
		if (!targetObject.toString().equals("true") && targetObject.toString().equals(permission.toString())) {
			return true;
		} else if (!targetObject.toString().equals("true")) {
			return false;
		}
		boolean hasPermission = false;
		boolean isMultiplePermissionWithAnd = false;
		boolean isMultiplePermissionWithOr = false;

		try {
			String accessCodeString = (String) permission;
			List<String> accessCodeList = new ArrayList<>();
			if (accessCodeString.contains("|") || accessCodeString.contains("&")) {
				if (accessCodeString.contains("|")) {
					accessCodeList = Arrays.asList(accessCodeString.split("\\|"));
					isMultiplePermissionWithOr = true;
				} else {
					accessCodeList = Arrays.asList(accessCodeString.split("\\&"));
					isMultiplePermissionWithAnd = true;
				}
			} else {
				accessCodeList.add(accessCodeString);
			}
			if (authentication != null && permission instanceof String) {
				hasPermission = checkPermissionByCondition(authentication, isMultiplePermissionWithAnd,
						isMultiplePermissionWithOr, accessCodeList);
			} else {
				hasPermission = false;
			}
		} catch (Exception e) {
			return false;
		}
		return hasPermission;
	}

	private boolean checkPermissionByCondition(Authentication authentication, boolean isMultiplePermissionWithAnd,
			boolean isMultiplePermissionWithOr, List<String> accessCodeList) {
		boolean hasPermission;
		User authUser = (User) authentication.getPrincipal();
		Collection<GrantedAuthority> acls = authUser.getAuthorities();
		if (isMultiplePermissionWithAnd) {
			hasPermission = validatePermissionList(accessCodeList, acls, true);
		} else if (isMultiplePermissionWithOr) {
			hasPermission = validatePermissionList(accessCodeList, acls, false);
		} else {
			hasPermission = validatePermissionList(accessCodeList, acls, false);
		}
		return hasPermission;
	}

	@Override
	public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType,
			Object permission) {
		return false;
	}

	private boolean strictCheck(Collection<GrantedAuthority> acls, String accessCode) {
		boolean isAuthorize = false;
		for (GrantedAuthority grantedAuthority : acls) {
			if (grantedAuthority.getAuthority().equals(accessCode)) {
				isAuthorize = true;
				break;
			}
		}
		return isAuthorize;
	}

	public boolean validatePermissionList(List<String> accessCodeList, Collection<GrantedAuthority> acls,
			boolean checkAllCode) {
		boolean isAuthorize = false;
		for (String acl : accessCodeList) {
			acl = acl.trim();
			isAuthorize = strictCheck(acls, acl);
			boolean flag = false;
			if (checkAllCode && !isAuthorize) {
				flag = true;
			} else {
				if (isAuthorize) {
					flag = true;
				}
			}
			if (flag) {
				break;
			}
		}
		return isAuthorize;
	}
}
