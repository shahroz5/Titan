/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration;

import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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

import com.titan.poss.core.config.SpringSecurityAuditorAware;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.integration.util.ApplicationIntgPropertiesUtil;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@EnableDiscoveryClient
@EnableEncryptableProperties
@SpringBootApplication
@EnableJpaAuditing
//@EnableCaching
@EnableAsync
@RefreshScope
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT30S")
@ComponentScan({ "com.titan.poss" })
public class IntegrationServiceApplication {

	public static void main(String[] args) {

		// timestamp i.e application start time is used for log file name in
		// application.properties
		System.setProperty("timestamp", CalendarUtils.formatDateToString(new Date(), "dd-MM-yyyy-HH-mm-ss"));

		SpringApplication application = new SpringApplication(IntegrationServiceApplication.class);
		ConfigurableEnvironment env = new StandardEnvironment();
		application.setEnvironment(env);
		ApplicationPropertiesUtil.initApplicationProperties(env);
		ApplicationIntgPropertiesUtil.initApplicationIntgProperties(env);
		application.run(args);
	}

	@Bean
	AuditorAware<String> auditorProvider() {
		return new SpringSecurityAuditorAware();
	}

}
