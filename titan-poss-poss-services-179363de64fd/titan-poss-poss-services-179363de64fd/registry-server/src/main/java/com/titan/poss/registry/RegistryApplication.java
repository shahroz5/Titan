/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.registry;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

import de.codecentric.boot.admin.server.config.EnableAdminServer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EnableDiscoveryClient
@EnableEurekaServer
@EnableAdminServer
@SpringBootApplication
public class RegistryApplication {
	public static void main(String[] args) {
		// time stamp i.e application start time is used for log file name in
		// application.properties
		System.setProperty("timestamp", RegistryApplication.formatDateToString(new Date(), "dd-MM-yyyy-HH-mm-ss"));
		SpringApplication.run(RegistryApplication.class, args);
	}

	public static String formatDateToString(Date date, String format) {
		return new SimpleDateFormat(format).format(date);
	}

	@Bean({ "threadPoolTaskExecutor", "webMvcAsyncTaskExecutor" })
	public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
		return new ThreadPoolTaskExecutor();
	}

	@Configuration
	@Order(100)
	public static class AdminConfigurationAdapter extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.authorizeRequests().antMatchers("/instances/**").permitAll().anyRequest().authenticated().and()
					.httpBasic().and().csrf().disable();
		}

		@Bean
		public AuthenticationEntryPoint authenticationEntryPoint() {
			BasicAuthenticationEntryPoint entryPoint = new BasicAuthenticationEntryPoint();
			entryPoint.setRealmName("admin realm");
			return entryPoint;
		}
	}
}