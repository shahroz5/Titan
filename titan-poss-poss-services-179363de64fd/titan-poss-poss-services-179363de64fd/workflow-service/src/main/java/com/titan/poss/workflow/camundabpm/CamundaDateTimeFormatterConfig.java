/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.camundabpm;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.camunda.bpm.engine.rest.CustomJacksonDateFormatListener;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CamundaDateTimeFormatterConfig {
	
	@Bean
	public ServletContextInitializer initializer() {
		return new ServletContextInitializer() {
			@Override
			public void onStartup(ServletContext servletContext) throws ServletException {
				servletContext.addListener(new CustomJacksonDateFormatListener());
				servletContext.setInitParameter("org.camunda.bpm.engine.rest.jackson.dateFormat",
						"yyyy-MM-dd'T'HH:mm:ss");
			}
		};
	}
}
