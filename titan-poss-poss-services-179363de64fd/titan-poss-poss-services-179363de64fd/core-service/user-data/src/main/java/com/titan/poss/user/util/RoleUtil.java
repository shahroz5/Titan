/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.util;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
public class RoleUtil {

	private RoleUtil() {
		throw new IllegalArgumentException("RoleUtil class");
	}

	public static boolean isRoleBelongToBtq(String accesssType) {
		boolean isValid = false;
		try {
			String storeAccess = accesssType.substring(2, 5);
			if (storeAccess.charAt(0) == '1' || storeAccess.charAt(1) == '1' || storeAccess.charAt(2) == '1')
				isValid = true;
		} catch (StringIndexOutOfBoundsException e) {
			log.error("{} is an invalid accessType", accesssType);
		}
		return isValid;
	}

}
