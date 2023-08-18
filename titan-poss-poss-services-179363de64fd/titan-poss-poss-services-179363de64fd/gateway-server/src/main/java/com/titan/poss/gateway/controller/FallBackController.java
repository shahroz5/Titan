/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.gateway.controller;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
public class FallBackController {

	@GetMapping(value = "/fallBack")
	public Mono<Void> fallback(ServerHttpResponse response) {
		response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
		String json = "{\"code\":\"000\",  \"message\":\"Service is unavailable\",  \"status\":503,  \"timestamp\":"
				+ Instant.now().toEpochMilli() + "}";
		byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
		DataBuffer buffer = response.bufferFactory().wrap(bytes);
		return response.writeWith(Mono.just(buffer));
	}

}
