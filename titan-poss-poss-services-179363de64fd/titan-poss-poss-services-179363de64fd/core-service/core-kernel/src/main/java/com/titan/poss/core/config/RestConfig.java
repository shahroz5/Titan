/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Configuration
@ComponentScan(basePackages = { "com.titan.poss.*" })
public class RestConfig implements WebMvcConfigurer {
	@Override
	public void configureContentNegotiation(final ContentNegotiationConfigurer configurer) {
		// Turn off suffix-based content negotiation
		configurer.favorPathExtension(false);
	}
}
