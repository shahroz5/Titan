package com.titan.poss.core.utils;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
public class CustomDataSyncPrincipal {
	
private static String user;

private CustomDataSyncPrincipal() {
	
}

public static String getUser() {
	return user;
}

public static void setUser(String user) {
	CustomDataSyncPrincipal.user = user;
}


}
