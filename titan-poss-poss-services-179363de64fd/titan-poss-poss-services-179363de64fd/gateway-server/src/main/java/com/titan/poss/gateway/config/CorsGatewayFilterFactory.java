/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CorsGatewayFilterFactory {

	@Bean
	public WebFilter corsFilter() {
		return (ServerWebExchange ctx, WebFilterChain chain) -> {
			ServerHttpRequest request = ctx.getRequest();
			ServerHttpResponse response = ctx.getResponse();

			response.getHeaders().set("Access-Control-Allow-Origin", "*");

			boolean isOptionCall = HttpMethod.OPTIONS.name().equalsIgnoreCase(request.getMethod().toString());

			response.getHeaders().set("isOptionMethod", Boolean.toString(isOptionCall));

			if (isOptionCall) {

				response.getHeaders().set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, PATCH");
				response.getHeaders().set("Access-Control-Max-Age", "3600");
				response.getHeaders().set("Access-Control-Allow-Headers",
						"Origin, Methods, Date, Content-Type, Accept, X-Requested-With, remember-me, X-Auth-Token, Request-Id, "
								+ "From, Authorization");
				response.getHeaders().set("Access-Control-Allow-Credentials", "true");

				return Mono.empty();
			}
			return chain.filter(ctx);
		};
	}

}