/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report;

import java.util.Date;
import java.util.concurrent.Executor;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.titan.poss.core.config.SpringSecurityAuditorAware;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@EnableDiscoveryClient
@EnableEncryptableProperties
@SpringBootApplication
@ComponentScan({ "com.titan.poss" })
@EnableJpaAuditing
@EnableCaching
@RefreshScope
@EnableAsync
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT30S")
public class ReportApplication {

	public static void main(String[] args) {

		System.setProperty("timestamp", CalendarUtils.formatDateToString(new Date(), "dd-MM-yyyy-HH-mm-ss"));
		System.setProperty("java.awt.headless","true");

		SpringApplicationBuilder builder = new SpringApplicationBuilder(ReportApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		builder.environment(env);

		ApplicationPropertiesUtil.initApplicationProperties(env);
		builder.run(args);

	}

	@Bean
	AuditorAware<String> auditorProvider() {
		return new SpringSecurityAuditorAware();
	}

	// Here, we set that maximum of 2 threads should run concurrently and the queue
	// size is set to 500. Here is the complete code of the class with import
	// statements:
	@Bean
	public Executor asyncExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(2);
		executor.setMaxPoolSize(5);
		executor.setQueueCapacity(500);
		executor.setThreadNamePrefix("IReport-");
		executor.initialize();
		return executor;
	}
}
