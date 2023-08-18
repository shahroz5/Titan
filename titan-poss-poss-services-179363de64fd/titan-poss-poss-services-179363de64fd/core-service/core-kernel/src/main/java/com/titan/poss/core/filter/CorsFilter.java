/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Configuration;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CorsFilter implements Filter {

	public CorsFilter() {
		// Default Constructor
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		HttpServletResponse response = (HttpServletResponse) res;
		HttpServletRequest request = (HttpServletRequest) req;

		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, PATCH");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Access-Control-Allow-Headers",
				"From, Authorization, BrandCode, HostName, Origin, Methods, Date, Content-Type, Accept, X-Requested-With, remember-me, X-Auth-Token, Request-Id");
		response.setHeader("Access-Control-Allow-Credentials", "true");
		if (!"OPTIONS".equals(request.getMethod())) {
			chain.doFilter(req, res);
		}
	}

	@Override
	public void init(FilterConfig filterConfig) {
		// init method from Filter
	}

	@Override
	public void destroy() {
		// destroy method from Filter
	}
}