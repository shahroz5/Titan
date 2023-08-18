package com.titan.poss.integration.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.ConfigurableEnvironment;

@Configuration
@PropertySource({ "classpath:NetcarrotsErrorCodes.properties" })
public class ApplicationIntgPropertiesUtil {

	@Autowired
	private static ConfigurableEnvironment env = null;

	public static void initApplicationIntgProperties(ConfigurableEnvironment env) {
		ApplicationIntgPropertiesUtil.env = env;
	}
	public static String getValue(String key) {
		return env.getProperty(key);
	}

}
