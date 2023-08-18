/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.workflow;

import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.titan.poss.core.config.SpringSecurityAuditorAware;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
/**
 * Main Application Class for Workflow-service
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan({ "com.titan.poss" })
@EnableJpaAuditing
@EnableProcessApplication
public class WorkflowServiceApplication {

	public static void main(String[] args) {
		
		SpringApplication application = new SpringApplication(WorkflowServiceApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		application.setEnvironment(env);
		ApplicationPropertiesUtil.initApplicationProperties(env);
		application.run(args);
	}
	
	@Bean
	AuditorAware<String> auditorProvider() {
		return new SpringSecurityAuditorAware();
	}


}
