/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.config;

import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.web.filter.ForwardedHeaderFilter;

import com.titan.poss.auth.config.saml.SAMLConfigurer;
import com.titan.poss.auth.config.saml.SAMLUserDetailsServiceImpl;
import com.titan.poss.core.auth.util.JwtUtill;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
//@EnableWebSecurity
//@ConditionalOnProperty(prefix = "poss.common", name = "security-config", matchIfMissing = true)
@Order(104)
public class AuthSecurityConfig extends WebSecurityConfigurerAdapter {

	@Value("${security.saml2.metadata-url}")
	String metadataUrl;

	@Value("${server.ssl.key-alias}")
	String keyAlias;

	@Value("${server.ssl.key-store-password}")
	String password;

	@Value("${server.port}")
	String port;

	@Value("${server.ssl.key-store}")
	String keyStoreFilePath;

	@Value("${saml.eposs.url}")
	String url;

	@Autowired
	SAMLUserDetailsServiceImpl samlUserDetailsServiceImpl;

	@Autowired
	JwtUtill jwtUtill;

	private static final Logger LOGGER = LoggerFactory.getLogger(AuthSecurityConfig.class);

	@Bean
	public HttpFirewall defaultHttpFirewallAuth() {
		return new DefaultHttpFirewall();
	}

	@Override
	public void configure(WebSecurity webSecurity) throws Exception {

		webSecurity.ignoring().antMatchers(allowedEndPoints());
		super.configure(webSecurity);
		webSecurity.httpFirewall(defaultHttpFirewallAuth());
	}

	private String[] allowedEndPoints() {

		return new String[] { "/**/auth/*/client/error-log**", "/auth/*/logout/**", "/**/auth/*/init",
				"/**/auth/*/refresh", "/**/auth/*/temp/**", "/**/auth/*/users/**", "/**/auth/*/login**",
				"/**/auth/*/token", "/**/auth/*/reload**", "/**/user/*/users/verify-otp**",
				"/**/user/*/users/forgot-password**", "/**/integration/*/notification**", "/assets/**", "/icons/**",
				"/favicon**", "/**/favicon**", "/css/**", "/js/**", "/*/error**", "/*/webjars/**", "/*/v2/api-docs",
				"/*/configuration/ui", "/*/configuration/security", "/*/swagger-resources/**", "/*/swagger-ui.html",
				"/error**", "/webjars/**", "/v2/api-docs", "/configuration/ui", "/configuration/security",
				"/swagger-resources/**", "/swagger-ui.html", "/**/inventory/v2/test-db/**", "json**", "/app/**",
				"/lib/**", "/api/**", "/camunda/rest/**", "/**/auth/*/adlogouturl/" };

	}

	@Override
	protected void configure(final HttpSecurity http) throws Exception {

		String proto = "http";
		String host = "localhost";
		int port = 80;
		String hostWithPort = "localhost";
		try {
			proto = new URL(url).getProtocol();
			host = new URL(url).getHost();
			port = new URL(url).getPort();
			if (port == -1) {
				hostWithPort = host;
			} else {
				hostWithPort = host + ":" + port;
			}
		} catch (MalformedURLException e) {
			LOGGER.error("MalformedURLException: ", e);
		}

		System.out.println("Url --------------- : " + hostWithPort);

		http.csrf().disable().authorizeRequests().antMatchers("/saml/**", "/*/actuator/**").permitAll().anyRequest()
				.authenticated().and().apply(SAMLConfigurer.saml()).userDetailsService(samlUserDetailsServiceImpl)
				.serviceProvider().keyStore().storeFilePath(keyStoreFilePath).password(password).keyname(keyAlias)
				.keyPassword(password).and().protocol(proto).hostname(hostWithPort).basePath("/eposs/api").and()
				.identityProvider().metadataFilePath(metadataUrl);

	}

	@Bean
	public AuthenticationEntryPoint unauthorizedEntryPointAuth() {
		return (request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(domainUsernamePasswordAuthenticationProvider());
	}

	@Bean
	public AuthenticationProvider domainUsernamePasswordAuthenticationProvider() {
		return new AuthenticationManagerConfig();
	}

	@Bean(name = BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return authenticationManager();
	}

	@Bean
	FilterRegistrationBean<ForwardedHeaderFilter> forwardedHeaderFilter() {
		final FilterRegistrationBean<ForwardedHeaderFilter> filterRegistrationBean = new FilterRegistrationBean<>();
		filterRegistrationBean.setFilter(new ForwardedHeaderFilter());
		filterRegistrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return filterRegistrationBean;
	}
}
