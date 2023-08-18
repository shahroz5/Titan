/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Configuration
public class BasicSecurityConfig extends WebSecurityConfigurerAdapter {
	@Value("${spring.security.user.name}")
	String user;
	@Value("${spring.security.user.password}")
	String pwd;





	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.antMatcher("/**").authorizeRequests().anyRequest().authenticated().and().httpBasic()
				.authenticationEntryPoint(authenticationEntryPoint()).and().csrf().disable();
	}





	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint() {
		BasicAuthenticationEntryPoint entryPoint = new BasicAuthenticationEntryPoint();
		entryPoint.setRealmName("admin realm");
		return entryPoint;
	}





	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication().withUser(user).password("{noop}" + pwd).roles("ADMIN");
	}
}
