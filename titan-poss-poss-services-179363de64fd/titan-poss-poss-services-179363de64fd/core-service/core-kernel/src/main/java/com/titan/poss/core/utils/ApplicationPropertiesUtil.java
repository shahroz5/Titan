/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.utils;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.io.ClassPathResource;

import com.titan.poss.core.exception.ServiceException;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class ApplicationPropertiesUtil {
	private static Properties errorProperties = new Properties();
	private static Properties commonProperties = new Properties();
	private static ConfigurableEnvironment env = null;

	private ApplicationPropertiesUtil() {
		throw new IllegalArgumentException("ApplicationPropertiesUtil class");
	}

	public static void initApplicationProperties(ConfigurableEnvironment env) {
		ApplicationPropertiesUtil.env = env;

		try {
			errorProperties.load(new ClassPathResource("error-messages.properties").getInputStream());
		} catch (IOException e) {
			throw new ServiceException("error-messages.properties-file IOExecption while loading properties",
					"ERR-CORE-002", "messages.properties");
		}

		try {
			commonProperties.load(new ClassPathResource("common.properties").getInputStream());
		} catch (IOException e) {
			throw new ServiceException("common.properties-file IOExecption while loading properties", "ERR-CORE-002",
					"common.properties");
		}
	}

	public static String getProperty(String key) {
		if (env.getProperty(key) != null) {
			return env.getProperty(key);
		} else if (commonProperties.getProperty(key) != null) {
			return commonProperties.getProperty(key);
		} else {
			return errorProperties.getProperty(key);
		}
	}

}