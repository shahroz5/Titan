/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.config;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Properties;

import org.jasypt.util.text.BasicTextEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.PropertySource;

import com.ulisesbocchio.jasyptspringboot.annotation.EncryptablePropertySource;
import com.ulisesbocchio.jasyptspringboot.wrapper.EncryptableEnumerablePropertySourceWrapper;

@Configuration
@EncryptablePropertySource(value = {
		"file:${spring.cloud.config.fallbackLocation:}/backup-${spring.profiles.active}.properties" }, ignoreResourceNotFound = true)
public class EnvironmentFileWriter implements EnvironmentAware {

	@Autowired
	private ConfigurableEnvironment env2;

	@Value("${jasypt.encryptor.password}")
	private String jasyptPwd;

	@Value("${spring.cloud.config.fallbackLocation:}")
	private String fallbackLocation;

	@Value("${spring.profiles.active}")
	private String profile;

	private static final Logger LOGGER = LoggerFactory.getLogger(EnvironmentFileWriter.class);

	@Override
	public void setEnvironment(Environment environment) {
		try {
			Properties prop = new Properties();
			PropertySource<?> ps = env2.getPropertySources().get("bootstrapProperties");
			if (ps == null) {
				LOGGER.error("bootstrapProperties property source not found");
				return;
			}
			String[] data = ((EncryptableEnumerablePropertySourceWrapper<?>) ps).getPropertyNames();
			BasicTextEncryptor encryptor = new BasicTextEncryptor();
			encryptor.setPassword(jasyptPwd);
			if (data.length > 0) {
				for (String key : data) {
					if (key.contains("password") || key.contains("secret")) {
						prop.put(key, "ENC(" + encryptor.encrypt(ps.getProperty(key).toString()) + ")");
					} else {
						prop.put(key, ps.getProperty(key));
					}

				}
				File directory = new File(fallbackLocation);
				if (!directory.exists()) {
					directory.mkdirs();
				}
				prop.store(new FileOutputStream(fallbackLocation + "/backup-" + profile + ".properties"), null);
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
	}

}
