/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;

import com.titan.poss.core.auth.util.JwtUtill;
import com.titan.poss.core.filter.SecurityFilter;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
//@EnableGlobalMethodSecurity(securedEnabled = true)
//@ConditionalOnProperty(prefix = "titan.common", name = "security-config", matchIfMissing = true)
@ConditionalOnMissingClass(value = { "com.titan.poss.auth.config.AuthSecurityConfig" })
@Order(102)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	JwtUtill jwtUtill;

	@Bean
	public HttpFirewall defaultHttpFirewallCore() {
		return new DefaultHttpFirewall();
	}

	@Override
	public void configure(WebSecurity webSecurity) throws Exception {
		webSecurity.ignoring().antMatchers(allowedEndPoints());
		super.configure(webSecurity);
		webSecurity.httpFirewall(defaultHttpFirewallCore());

	}

	private String[] allowedEndPoints() {
		return new String[] { "/**/auth/*/client/error-log**", "/**/auth/*/logout", "/**/auth/*/init",
				"/**/auth/*/temp/**", "/**/integration/*/temp/**", "/**/auth/*/users/**", "/**/auth/*/login**",
				"/**/auth/*/token", "/**/auth/*/reload**", "/**/user/*/users/verify-otp**",
				"/**/user/*/users/forgot-password**",
//				"/**/integration/*/notification**", "/assets/**", "/icons/**", "/favicon**", "/**/favicon**", "/css/**",
				"/assets/**", "/icons/**", "/favicon**", "/**/favicon**", "/css/**", "/js/**", "/*/error**",
				"/*/webjars/**", "/*/v2/api-docs", "/*/configuration/ui", "/*/configuration/security",
				"/*/swagger-resources/**", "/*/swagger-ui.html", "/error**", "/webjars/**", "/v2/api-docs",
				"/configuration/ui", "/configuration/security", "/swagger-resources/**", "/swagger-ui.html",
				"/**/inventory/v2/test-db/**", "json**", "/app/**", "/lib/**", "/api/**", "/camunda/rest/**",
				"/workflow/v2/workflow-task/approval-over-email/action",
				"/config/v2/files/*/download" ,
				"/integration/v2/document/download/file-path",
				"/integration/v2/document/download/file-path1",
				"/**/integration/*/vendors/**"};
	}

	@Override
	protected void configure(final HttpSecurity httpSecurity) throws Exception {
		httpSecurity.httpBasic().disable().csrf().disable().authorizeRequests().anyRequest().authenticated().and()
				.addFilterBefore(new SecurityFilter(jwtUtill), BasicAuthenticationFilter.class).sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().exceptionHandling()
				.authenticationEntryPoint(unauthorizedEntryPointCore());
	}

	@Bean
	public AuthenticationEntryPoint unauthorizedEntryPointCore() {
		return (request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	}

}
