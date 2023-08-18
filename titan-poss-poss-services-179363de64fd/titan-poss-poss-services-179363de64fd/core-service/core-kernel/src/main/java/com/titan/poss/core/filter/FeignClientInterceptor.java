/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.filter;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.ContentTypesEnum;
import com.titan.poss.core.exception.ServiceErrorDecoder;
import com.titan.poss.core.utils.ServiceResponseDecoder;

import feign.Logger;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import feign.codec.Decoder;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class FeignClientInterceptor implements RequestInterceptor {

	private static final String COOKIE = "Cookie";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String ACCEPT = "Accept";
	private static final String APPLICATION_JSON = ContentTypesEnum.JSON.getValue();

	private Decoder decoder;

	@Bean
	public ServiceResponseDecoder responseDecoder() {
		return new ServiceResponseDecoder(decoder);
	}

	@Bean
	public ServiceErrorDecoder errorDecoder() {
		return new ServiceErrorDecoder();
	}

	@Bean
	public Logger.Level feignLoggerLevel() {
		return Logger.Level.BASIC;
	}

	@Override
	public void apply(RequestTemplate requestTemplate) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
					.getRequest();
			requestTemplate.header(CommonConstants.AUTH_HEADER, request.getHeader(CommonConstants.AUTH_HEADER));
			requestTemplate.header(COOKIE, request.getHeader(COOKIE));
			requestTemplate.header(CONTENT_TYPE, APPLICATION_JSON);
			requestTemplate.header(ACCEPT, APPLICATION_JSON);
		}
	}

}
