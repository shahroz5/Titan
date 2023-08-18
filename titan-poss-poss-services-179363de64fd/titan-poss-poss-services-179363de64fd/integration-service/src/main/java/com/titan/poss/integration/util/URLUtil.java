/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Mindtree
 * @version 1.0
 */
public class URLUtil {

	private URLUtil() {
		throw new IllegalArgumentException("URLUtil class");
	}

	private static final Logger LOGGER = LoggerFactory.getLogger(URLUtil.class);

	private static final Integer DEFAULT_PORT = 80;

	public static int getPortNumberInInt(String portStr) {
		int port = DEFAULT_PORT;
		try {
			port = Integer.parseInt(portStr);
		} catch (NumberFormatException e) {
			LOGGER.error("port provided is not in number format: {}, falling back to default port", port);
			port = DEFAULT_PORT;
		}
		return port;
	}

}
