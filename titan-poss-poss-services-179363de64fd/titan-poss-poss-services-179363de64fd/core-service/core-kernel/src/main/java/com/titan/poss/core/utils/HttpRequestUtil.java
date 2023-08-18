/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.utils;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class HttpRequestUtil {

	private HttpRequestUtil() {
		throw new IllegalStateException("HttpRequestUtil class");
	}

	public static String getHost(HttpServletRequest req) {
		String host = req.getHeader("X-FORWARDED-HOST");
		if (host == null || host.isEmpty()) {
			host = req.getHeader("Host");
		}
		host = host.split(":")[0];
		return host;
	}

	public static String getDevice(HttpServletRequest req) {
		String device = req.getHeader("X-FORWARDED-FOR");
		if (device != null && !device.isEmpty()) {
			device = device.split(",")[0];
		}
		if (device == null || device.isEmpty()) {
			device = req.getRemoteHost();
		}
		return device;
	}

}
